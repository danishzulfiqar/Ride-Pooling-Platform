const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();


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


// Generate Email Varification Link
async function generateEmailVerificationLink(data) {
    console.log("generateVerification called", data);

    const userId = data.uid;
    const email = data.email;

    try {
        const userRecord = await admin.auth().getUser(userId);
        console.log("Record found", userRecord);

        if (!email) {
            throw new Error("Invalid Arguments. User email is required for verification.");
        }

        if (userRecord.emailVerified) {
            return "Email is already verified.";
        }

        const verificationLink = await admin.auth().generateEmailVerificationLink(email);
        console.log("Link made", verificationLink);
        return verificationLink;
    } catch (error) {
        console.error("Error in generateEmailVerificationLink:", error);
        throw error;
    }
}


// Sending email with link to user
async function sendEmailVarificationLink(data) {
    console.log("sendEmail called",data);

    const varifyLink = await generateEmailVerificationLink(data);

    const mailOptions = {
        from: process.env.senderEmail,
        to: data.email,
        subject: 'Email Verification',
        html: `<p>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            throw new Error('Error sending verification email.');
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    generateEmailVerificationLink,
    sendEmailVarificationLink,
};