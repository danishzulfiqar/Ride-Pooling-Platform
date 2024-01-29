const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
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
        await sendEmailVarificationLink({ email: data.email, uid: data.uid });
        result = { status: true, msg: "User made successfully!" };
    }).catch((error) => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })
    return result;
})


// function to send new rider approval request
exports.sendNewRiderData = functions.https.onCall(async (data, context) => {

    console.log("sendNewRiderData called", data);

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
    if (snapshot.exists()) {
        throw new functions.https.HttpsError('unknown', "User already exists for the given role");
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

    }).then(() => {
        result = { status: true, message: "approval request sent" };
    }).catch((error) => {
        throw new functions.https.HttpsError('unknown', error.message, error);
    })

    return result;
})