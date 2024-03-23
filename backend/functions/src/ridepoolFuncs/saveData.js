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
            }
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

    if(role != "rider" && role != "user") {
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

