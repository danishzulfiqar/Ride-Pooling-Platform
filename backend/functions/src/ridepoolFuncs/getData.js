const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { GeoFirestore } = require('geofirestore');
const geofire = require('geofire-common');
const firestore = require("firebase-admin/firestore");

// get sData of a user for a specific role
exports.getUserData = functions.https.onCall(async (data, context) => {

    console.log("getUserData called", data);

    const uid = data.uid;
    const role = data.role;
   
});


// generate GeoPoint for specific lats and lngs
exports.generateGeoPoint = functions.https.onCall(async (data, context) => {

    try {
        const { lat, lng } = data; 
        const geoPoint = new firestore.GeoPoint(lat,lng);
        const hash = geofire.geohashForLocation([data.lat, data.lng]);

        return {geoPoint, hash};

    } catch (error) {
        console.error('Error generating GeoPoint:', error);
        return { error: 'An error occurred while generating GeoPoint.' };
    }
});