const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { GeoFirestore } = require('geofirestore');
const geofire = require('geofire-common');
const firestore = require("firebase-admin/firestore");

// get sData of a user for a specific role
exports.getUserData = functions.https.onCall(async (data, context) => {

    console.log("getUserData called", data);


    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }


    const uid = data.uid;
    const role = data.role;

});


// generate GeoPoint for specific lats and lngs
exports.generateGeoPoint = functions.https.onCall(async (data, context) => {

    try {
        const { lat, lng } = data;
        const geoPoint = new firestore.GeoPoint(lat, lng);
        const hash = geofire.geohashForLocation([data.lat, data.lng]);

        return { geoPoint, hash };

    } catch (error) {
        console.error('Error generating GeoPoint:', error);
        return { error: 'An error occurred while generating GeoPoint.' };
    }
});


// Get GO mode avilaible riders in specific radius 
exports.getGoRiders = functions.https.onCall(async (data, context) => {

    console.log("getGoRiders called", data);

    // checking valid arguments
    if (!data.lat || !data.lng || !data.radius) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with valid arguments, see documentation for reference');
    }


    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    const db = admin.firestore();

    const { lat, lng, radius } = data;
    const geoPoint = new firestore.GeoPoint(lat, lng);
    const hash = geofire.geohashForLocation([data.lat, data.lng]);
    const center = [lat, lng];
    const radiusInM = radius;

    const bounds = geofire.geohashQueryBounds(center, radius);

    const promises = [];

    for (const b of bounds) {
        console.log(b);
        const q = db.collection('riders')
            .where('availability', '==', true)
            .orderBy('geohash')
            .startAt(b[0])
            .endAt(b[1]);

        promises.push(q.get());
    }

    try {
        const snapshots = await Promise.all(promises);

        const matchingDocs = [];

        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const lat = doc.get('lat');
                const lng = doc.get('lng');
                const distanceInM = geofire.distanceBetween([lat, lng], center) * 1000;
                console.log(doc.data(), distanceInM);
                if (distanceInM <= radiusInM) {
                    matchingDocs.push(doc.data());
                }
            }
        }

        return matchingDocs;

    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Unable to fetch riders', error);
    }

});