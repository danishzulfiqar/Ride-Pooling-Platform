const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

const functionsConfig = functions.config().myapp;

const senderEmail = functionsConfig ? functionsConfig.sender_email : process.env.senderEmail;
const senderEmailPassword = functionsConfig ? functionsConfig.sender_email_password : process.env.pas;

// email configuration for sending email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: senderEmail,
        pass: senderEmailPassword,
    },
    tls: {
        rejectUnauthorized: false,
    },
});


// Checks Data for a specific Role i.e. Rider, Users and send response as true or false
exports.checkData = functions.https.onCall(async (data, context) => {

    console.log("checkData called", data);

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

    const db = admin.firestore();
    let ref;

    if (Role == "user") {
       ref =  db.collection('users').doc(UID);
    } else if (Role == "rider") {
       ref = db.collection('riders').doc(UID);
    }

    try {
        const doc = await ref.get();
        return doc.exists;
    } catch (error) {

        throw new functions.https.HttpsError('unknown', error.message, error);
    }
})

// Link and validate email address
exports.validateEmail = functions.https.onCall(async (data, context) => {

    console.log("validateEmail called", data);

    const email = data.email;
    const UID = data.uid;

    // checking arguments
    if (!UID || !email) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with arguments "uid" and "email" .');
    }

    // checking auth state and if user sent request himself
    if (!context.auth || (context.auth.uid != data.uid)) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication required."
        );
    }

    try {
        const response = await sendEmailVarificationLink({ email: email, uid: UID });
        return response;
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Error sending email.', error: error };
    }

})


// Generate Email Verification Link & linking email
async function generateEmailVerificationLink(data) {
    console.log("generateEmailVerificationLink called", data);

    const userId = data.uid;
    const email = data.email;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?';
    let password = '';
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    try {
        // Fetch the user record
        const userRecord = await admin.auth().getUser(userId);
        console.log("Record found", userRecord);

        // Validate email
        if (!email || !password) {
            throw new Error("Invalid Arguments. User email and password are required.");
        }

        // Linking the email to the user account
        await admin.auth().updateUser(userId, {
            email: email,
            emailVerified: false,
            password: password
        });
        console.log("Email linked successfully to user:", userId);

        // Check if email is already verified
        if (userRecord.emailVerified) {
            return "Email is already verified.";
        }

        // Generate the verification link
        const verificationLink = await admin.auth().generateEmailVerificationLink(email);
        console.log("Verification link generated:", verificationLink);

        return verificationLink;
    } catch (error) {
        console.error("Error in generateEmailVerificationLink:", error);
        throw error;
    }
}
// Exporting generateEmailVerificationLink
exports.generateEmailVerificationLink = generateEmailVerificationLink;


// Sending email with link to user
async function sendEmailVarificationLink(data) {
    console.log("sendEmail called", data);

    const varifyLink = await generateEmailVerificationLink(data);

    const mailOptions = {
        from: senderEmail,
        to: data.email,
        subject: 'RidePool Email Verification',
        html: `<!DOCTYPE html>
        <html>
        <head>
          <title>Email Confirmation</title>
        </head>
        
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1A237E;">Verify Your Email Address</h2>
            <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
            <a href="${varifyLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; margin-top: 15px; border-radius: 4px;">Verify Email</a>
            <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
          </div>
        </body>
        
        </html>`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                reject({ status: false, message: 'Error sending verification email.' });
            } else {
                console.log('Email sent: ' + info.response);
                resolve({ status: true, message: "Email Sent" });
            }
        });
    });
}
// Exporting sendEmailVarificationLink
exports.sendEmailVarificationLink = sendEmailVarificationLink;