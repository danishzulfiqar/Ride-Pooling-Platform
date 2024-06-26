const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const nodemailer = require('nodemailer');
const firestore = require("firebase-admin/firestore");
const { GeoFirestore } = require('geofirestore');

require('dotenv').config();
const {
    generateEmailVerificationLink,
    sendEmailVarificationLink,
} = require('./src/ridepoolFuncs/validateData');

// ---------- Importing Functions by catigoury -----------------

const validateData = require('./src/ridepoolFuncs/validateData');
const saveData = require('./src/ridepoolFuncs/saveData');
const getData = require('./src/ridepoolFuncs/getData');
const generateFakeData = require('./src/ridepoolFuncs/generateFakeData');

admin.initializeApp();


// --------------- validateData funcs ----------------------

// Checks Data for a specific Role i.e. Rider, Users and send response as true or false
exports.checkData = validateData.checkData;

// function to send email Validation request
exports.validateEmail = validateData.validateEmail;


// --------------- saveData funcs --------------------------

// function for saving passenger(user) data
exports.savePassengerData = saveData.savePassengerData;

// function to save new rider data
exports.saveRiderData = saveData.saveRiderData;


// function to save geopoint and geohash of a specific role
exports.saveLocationData = saveData.saveLocationData;

// function for sending request to get GO mode available riders
exports.sendRequestToRider = saveData.sendRequestToRider;

// function for making a new GO ride bid in rides collection
exports.makeNewGoRideBid = saveData.makeNewGoRideBid;

// function for sending msg in the chatbox of a specific ride bid
exports.sendMsgInChat = saveData.sendMsgInChat;

// function for updating GO ride bid status to pickup status
exports.updateGoRideBidPickupStatus = saveData.updateGoRideBidPickupStatus;

// function for canceling GO ride bid
exports.cancelGoRideBid = saveData.cancelGoRideBid;


// --------------- getData funcs ---------------------------

// Get a specific users data
exports.getUserData = getData.getUserData;

// Generate GeoPoint with geohash
exports.generateGeoPoint = getData.generateGeoPoint;

// Get Go mode availaible riders
exports.getGoRiders = getData.getGoRiders;


// --------------- generateFakeData funcs -------------------

// Generate a new fake rider data
exports.generateFakeRiderData = generateFakeData.generateFakeRiderData;