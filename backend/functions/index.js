const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importing Functions by catigoury 

// validate data functions
const validateData = require('./src/ridepoolFuncs/validateData');
// save data function 
const saveData = require('./src/ridepoolFuncs/saveData');

admin.initializeApp();

// Checks Data for a specific Role i.e. Rider, Users and send response as true or false
exports.checkData = validateData.checkData;

// function for saving passenger(user) data
exports.savePassengerData = saveData.savePassengerData;


// function to send new rider approval request
exports.sendNewRiderData = saveData.sendNewRiderData;