const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { GeoFirestore } = require('geofirestore');
const geofire = require('geofire-common');
const firestore = require("firebase-admin/firestore");


// function for generatting fake rider data which can be called without any arguments
exports.generateFakeRiderData = functions.https.onCall(async (data, context) => {

    console.log("generateFakeRiderData called", data);

    const db = admin.firestore();
    const riderRef = db.collection('riders');

    const UserData = {
        user_id: "fake_rider_" + Math.floor(Math.random() * 1000000),
        first_name: "Fake",
        last_name: "Rider",
        DOB: "1990-01-01",
        email: "fake_rider_" + Math.floor(Math.random() * 1000000) + "@ridepool.com",
        email_verification: false,
        gender: "male",
        phone_number: "0300" + Math.floor(Math.random() * 10000000),
        registration_date: new Date().toISOString()
    }

    // insering new document in rider collection
    const ref = await riderRef.add({
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
        },
        current_ride: {
            RidebidKey: "",
            rideStatus: false,
        },
        availability: false,
        location:{
            geopoint: new firestore.GeoPoint(24.8607, 67.0011),
            geohash: geofire.geohashForLocation([24.8607, 67.0011])
        }
    });

    return { result: "Fake Rider Data Generated" };
});