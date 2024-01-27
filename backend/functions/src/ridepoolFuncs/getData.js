const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// gets Data of a user for a specific role
exports.getUserData = functions.https.onCall(async (data, context) => {

    const uid = data.uid;
    const role = data.role;
   
});