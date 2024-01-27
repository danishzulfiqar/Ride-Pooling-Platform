const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const nodemailer = require('nodemailer');
require('dotenv').config();
const {
    generateEmailVerificationLink,
    sendEmailVarificationLink,
} = require('./src/ridepoolFuncs/validateData');

// ---------- Importing Functions by catigoury -----------------

const validateData = require('./src/ridepoolFuncs/validateData');
const saveData = require('./src/ridepoolFuncs/saveData');
const getData = require('./src/ridepoolFuncs/getData');

admin.initializeApp();


// --------------- validateData funcs ----------------------

// Checks Data for a specific Role i.e. Rider, Users and send response as true or false
exports.checkData = validateData.checkData;

// function to send email Validation request
exports.validateEmail = validateData.validateEmail;


// --------------- saveData funcs --------------------------

// function for saving passenger(user) data
exports.savePassengerData = saveData.savePassengerData;

// function to send new rider approval request
exports.sendNewRiderData = saveData.sendNewRiderData;


// --------------- getData funcs ---------------------------
