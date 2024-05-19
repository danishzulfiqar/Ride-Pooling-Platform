const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { GeoFirestore } = require('geofirestore');
const geofire = require('geofire-common');
const firestore = require("firebase-admin/firestore");
require('dotenv').config();
const {
    generateEmailVerificationLink,
    sendEmailVarificationLink,
} = require('./validateData');
const { user } = require('firebase-functions/v1/auth');


// function for saving passenger(user) data
exports.savePassengerData = functions.https.onCall(async (data, context) => {

    console.log("savePassengerData called", data);

    // checking valid arguments
    if (!data.uid || !data.fname || !data.lname || !data.dob || !data.email || !data.gender || !data.phone) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }


    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    const UID = data.uid;

    const UserData = {
        user_id: data.uid,
        first_name: data.fname,
        last_name: data.lname,
        DOB: data.dob,
        email: data.email,
        email_verification: false,
        gender: data.gender,
        phone_number: data.phone,
        registration_date: new Date().toISOString()
    }

    const db = admin.firestore();
    const ref = db.collection('users').doc(data.uid);

    // Check if user already exists
    const doc = await ref.get();

    // checks if data already exists for specific node
    if (doc.exists) {
        throw new functions.https.HttpsError('already-exists', "User already exists for the given role");
    }

    let result;

    await ref.set({
        crest: {
            UserData,
            account_status: true,
            activities: {
                rides_booked: 0,
                rides_cancelled: 0,
                rides_history: {}
            },
            rating: {
                rating_factor: 2,
                rating_value: 5
            },
        },
        current_ride: {
            RidebidKey: "",
            rideStatus: false,
        },
        availability: false

    }).then(async () => {
        await admin.auth().getUserByEmail(data.email)
            .then(async () => {
                result = { status: true, msg: "User made successfully!", emailSendStatus: false, emailMessage: "Email exists for another user" };
            }).catch(async (error) => {
                const emailReturn = await sendEmailVarificationLink({ email: data.email, uid: data.uid });
                result = { status: true, msg: "User made successfully!", emailSendStatus: emailReturn.status, emailMessage: emailReturn.message };
            })
    }).catch((error) => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })
    return result;
})


// function to save rider data
exports.saveRiderData = functions.https.onCall(async (data, context) => {

    console.log("saveRiderData called", data);

    // checking valid arguments
    if (!data.uid || !data.fname || !data.lname || !data.dob || !data.email || !data.gender || !data.phone) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }


    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }


    const UID = data.uid;

    const UserData = {
        user_id: data.uid,
        first_name: data.fname,
        last_name: data.lname,
        DOB: data.dob,
        email: data.email,
        email_verification: false,
        gender: data.gender,
        phone_number: data.phone,
        registration_date: new Date().toISOString()
    }

    const db = admin.firestore();
    const ref = db.collection('riders').doc(data.uid);

    // Check if user already exists
    const doc = await ref.get();

    // checks if data already exists for specific node
    if (doc.exists) {
        throw new functions.https.HttpsError('already-exists', "User already exists for the given role");
    }

    let result;

    await ref.set({
        crest: {
            UserData,
            account_status: true,
            activities: {
                rides_booked: 0,
                rides_cancelled: 0,
                rides_history: {}
            },
            rating: {
                rating_factor: 2,
                rating_value: 5
            },
            varification: {
                driving_license: false,
                vehicle_registration: false,
                vehicle_insurance: false,
                vehicle_inspection: false,
                vehicle_photo: false
            },
            varified: false,
        },
        current_ride: {
            RidebidKey: "",
            rideStatus: false,
        },
        availability: false,

    }).then(async () => {
        result = { status: true, msg: "rider request sent!" };
    }
    ).catch((error) => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })
    return result;

});


// function to save geopoint and geohash of a specific role
exports.saveLocationData = functions.https.onCall(async (data, context) => {

    console.log("saveLocationData called", data);

    // checking valid arguments
    if (!data.uid || !data.role || !data.lat || !data.lng) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }

    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    const role = data.role;
    const UID = data.uid;

    const db = admin.firestore();
    let ref;

    if (role != "rider" && role != "user") {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }

    if (role == "rider") {
        ref = db.collection('riders').doc(UID);
    } else if (role == "user") {
        ref = db.collection('users').doc(UID);
    }

    //checking if user doesn't exists
    const doc = await ref.get();
    if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const geoPoint = new firestore.GeoPoint(data.lat, data.lng);
    const hash = geofire.geohashForLocation([data.lat, data.lng]);

    let result;

    await ref.update(
        {
            location: {
                geopoint: geoPoint,
                geohash: hash
            }
        }
    ).then(() => {
        result = { status: true, msg: "Location saved successfully!" };
    }).catch((error) => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })
    return result;

});


// ------------------------- Go mode functions ---------------------------

// function for sending request to get GO mode available riders

exports.sendRequestToRider = functions.https.onCall(async (data, context) => {

    console.log("sendRequestToRider called", data);

    // checking valid arguments
    if (!data.uid || !data.pickup || !data.dropoff || !data.pickup_lat || !data.pickup_lng || !data.dropoff_lat || !data.dropoff_lng || !data.riderUID) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }

    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    const UID = data.uid;
    // getting user's rating and info
    const db = admin.firestore();
    const userRef = db.collection('users').doc(UID);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const user_Data = userDoc.data();

    const requestData = {
        basicInfo: {
            user_id: UID,
            first_name: user_Data.crest.UserData.first_name,
            last_name: user_Data.crest.UserData.last_name,
            phone_number: user_Data.crest.UserData.phone_number,
        },
        rating: {
            value: user_Data.crest.rating.rating_value,
            totalRides: user_Data.crest.activities.rides_booked,
        },
        route: {
            pickup: data.pickup,
            dropoff: data.dropoff,
            pickup_location: new firestore.GeoPoint(data.pickup_lat, data.pickup_lng),
            dropoff_location: new firestore.GeoPoint(data.dropoff_lat, data.dropoff_lng),
        },
        price: 4354,
        request_time: new Date().toISOString(),
    }

    // console.log("Request Data:", requestData);

    // cheking if rider exists then saving requestData to rider's request node
    const riderRef = db.collection('riders').doc(data.riderUID);
    const riderDoc = await riderRef.get();
    if (!riderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Rider not found');
    }

    let result;

    // adding new request to rider's request subcollection with name of uid of user
    await riderRef.collection('requests').doc(UID).set(requestData)
        .then(() => {
            result = { status: true, msg: "Request sent to rider!" };
        }).catch((error) => {
            console.error('Error sending request:', error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })

    return result;

});



// function for making a new GO ride bid in rides collection

exports.makeNewGoRideBid = functions.https.onCall(async (data, context) => {

    console.log("makeNewRideBid called", data);


    // checking valid arguments
    if (!data.uid || !data.mode || !data.userId || !data.riderId || !data.pickup || !data.dropoff || !data.pickup_lat || !data.pickup_lng || !data.dropoff_lat || !data.dropoff_lng || !data.price) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }

    // if data.mode is not GO then throw error
    if (data.mode != "GO") {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called for GO mode only, see documentation for reference');
    }

    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    const UID = data.uid;
    const RIDERID = data.riderId;
    const USERID = data.userId;

    // checking if user and rider both are available

    const db = admin.firestore();
    const userRef = db.collection('users').doc(USERID);
    const riderRef = db.collection('riders').doc(RIDERID);

    //  chacking if availability node is true for both user and rider
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const riderDoc = await riderRef.get();
    if (!riderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Rider not found');
    }

    const user_Data = userDoc.data();
    const rider_Data = riderDoc.data();

    if (!user_Data.availability) {
        throw new functions.https.HttpsError('unavailable', 'User is not available for ride');
    }

    if (!rider_Data.availability) {
        throw new functions.https.HttpsError('unavailable', 'Rider is not available for ride');
    }

    // user and rider reference documents if exists
    const userRefDoc = db.collection('users').doc(USERID);
    const riderRefDoc = db.collection('riders').doc(RIDERID);

    // retrieving user and rider data crest node
    const userCrestDoc = await userRefDoc.get();
    const riderCrestDoc = await riderRefDoc.get();

    if (!userCrestDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User reference not found');
    }

    if (!riderCrestDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Rider reference not found');
    }

    const userCrest = userCrestDoc.data().crest;
    const riderCrest = riderCrestDoc.data().crest;

    // making user and rider data for ride bid
    const userInfo = {
        name: userCrest.UserData.first_name + " " + userCrest.UserData.last_name,
        phone: userCrest.UserData.phone_number,
        gender: userCrest.UserData.gender,
        rating: userCrest.rating.rating_value,
        rides: userCrest.activities.rides_booked,
    }

    const riderInfo = {
        name: riderCrest.UserData.first_name + " " + riderCrest.UserData.last_name,
        phone: riderCrest.UserData.phone_number,
        gender: riderCrest.UserData.gender,
        rating: riderCrest.rating.rating_value,
        rides: riderCrest.activities.rides_booked,
    }

    const riderLocation = riderCrestDoc.data().location;

    // console.log("User info :", userInfo );
    // console.log("Rider info :", riderInfo);

    // creating new ride bid data
    const rideData = {
        mode: "GO",
        active_status: true,
        riderData: {
            rider_id: RIDERID,
            riderInfo: riderInfo,
            location: riderLocation,
        },
        userData: {
            user_id: USERID,
            userInfo: userInfo,
            pickup: data.pickup,
            dropoff: data.dropoff,
            pickup_location: new firestore.GeoPoint(data.pickup_lat, data.pickup_lng),
            dropoff_location: new firestore.GeoPoint(data.dropoff_lat, data.dropoff_lng),
            pickup_status: false,
        },
        destination: {
            destinationLoc: new firestore.GeoPoint(data.pickup_lat, data.pickup_lng),
            destinationName: data.pickup,
        },
        bid_time: new Date().toISOString(),
    }

    // saving ride bid data to Rides collection
    let result;

    await db.collection('Rides').doc('Bids').collection('GO').add(rideData)
        // returning success message and bid key to user ie the document id of the ride bid
        .then((docRef) => {
            result = { status: true, msg: "Ride bid made successfully!", bidKey: docRef.id };
        }).catch((error) => {
            console.error('Error making ride bid:', error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })

    const bidRef = db.collection('Rides').doc('Bids').collection('GO').doc(result.bidKey);

    // updating user and rider documents with ride bid key and ride status
    await userRef.update({
        current_ride: {
            RidebidKey: result.bidKey,
            rideStatus: true,
        },
        availability: false,
    }).catch((error) => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })

    await riderRef.update({
        current_ride: {
            RidebidKey: result.bidKey,
            rideStatus: true,
        },
        availability: false,
    }).catch((error) => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })

    return result;


});


// function for sending msg in the chatbox of a specific ride bid

exports.sendMsgInChat = functions.https.onCall(async (data, context) => {

    console.log("sendMsgInChat called", data);

    // checking valid arguments
    if (!data.uid || !data.ridebidKey || !data.role || !data.mode || !data.msg) {
        console.log("input data is invalid");
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }else{
        console.log("input data is valid");
    }

    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    const UID = data.uid;
    const RIDEBIDKEY = data.ridebidKey;
    const ROLE = data.role;
    const MSG = data.msg;
    const MODE = data.mode;

    // checking if user exists in the given role

    const db = admin.firestore();
    let ref;

    if (ROLE == "user") {
        ref = db.collection('users').doc(UID);
    } else if (ROLE == "rider") {
        ref = db.collection('riders').doc(UID);
    } else {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }

    const doc = await ref.get();
    if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found for the given role');
    }

    if (MODE == "GO") {

        // checking if ride bid exists for the given mode
        const rideRef = db.collection('Rides').doc('Bids').collection("GO").doc(RIDEBIDKEY);

        const rideDoc = await rideRef.get();
        if (!rideDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Ride bid not found in the given mode');
        }

        // checking if ride bid is active
        const rideData = rideDoc.data();
        if (!rideData.active_status) {
            throw new functions.https.HttpsError('unavailable', 'Ride bid is not active');
        }

        // checking if user is part of the ride bid for GO mode

       if (ROLE == "user") {
            if (rideData.userData.user_id != UID) {
                throw new functions.https.HttpsError('unauthorized', 'User is not part of the ride bid');
            }
        } else if (ROLE == "rider") {
            if (rideData.riderData.rider_id != UID) {
                throw new functions.https.HttpsError('unauthorized', 'Rider is not part of the ride bid');
            }
        }

        // adding message to the chatbox of the ride bid
        // adding new doc to the chat collection of the ride bid

        let result;

        await rideRef.collection('chat').doc().set({
            sender: UID,
            ROLE : ROLE,
            message: MSG,
            time: new Date().toISOString(),
        }).then(() => {
            result = { status: true, msg: "Message sent successfully!" };
        }).catch((error) => {
            console.error('Error sending message:', error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })

        return result;


    } else {
        throw new functions.https.HttpsError('invalid-argument', 'Only GO mode is supported for now');
    }

})

