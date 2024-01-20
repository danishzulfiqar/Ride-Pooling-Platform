const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();

// Checks Data for a specific Role i.e. Rider, Users and send response as true or false
exports.checkData = functions.https.onCall(async (data, context) => {

    const Role = data.role;
    const UID = data.uid;

    // checking arguments
    if (!UID || !Role) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with arguments "uid" and "Role" .');
    }

    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    let ref;

    if (Role == "user") {
        ref = admin.database().ref(`/users/${UID}`);
    } else if (Role == "rider") {
        ref = admin.database().ref(`/riders/${UID}`)
    }

    try {
        const snapshot = await ref.once('value');
        return snapshot.exists();
    } catch (error) {

        throw new functions.https.HttpsError('unknown', error.message, error);
    }
})


// function for saving passenger(user) data
exports.savePassengerData = functions.https.onCall(async (data, context) => {


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
        gender: data.gender,
        phone_number: data.phone,
        registration_date: new Date().toISOString()
    }

    let ref = admin.database().ref(`/users/${UID}`);

    const snapshot = await ref.once('value');


    // checks if data already exists for specific node
    if (snapshot) {
        throw new functions.https.HttpsError('unknown', "User already exists for the given role");
    }

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

    }).then(() => {
        return { status: "success", message: "new user made" };
    }).catch(() => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })

})


// function to send new rider approval request
exports.sendNewRiderData = functions.https.onCall(async (data, context) => {

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
        gender: data.gender,
        phone_number: data.phone,
        registration_date: new Date().toISOString()
    }

    let ref = admin.database().ref(`/ApprovalRequests/pending_riders/${UID}`);

    const snapshot = await ref.once('value');

    // checks if data already exists for specific node
    if (snapshot) {
        throw new functions.https.HttpsError('unknown', "User already exists for the given role");
    }

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

    }).then(() => {
        return { status: "success", message: "approval request sent" };
    }).catch(() => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })

})