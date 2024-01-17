const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();

// Checks Data for a specific Role i.e. Rider, Users and send response as true or false

exports.checkData = functions.https.onCall(async (data, context) => {

    const Role = data.role;
    const UID = data.uid;

    if (!UID || !Role) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one arguments "uid".');
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
});


// const [uid, setUid] = useState('');
//   const [role, setRole] = useState('');
//   const [response, setResponse] = useState('');

//   const checkUserAndRole = async () => {
//     const checkFunction = firebase.functions().httpsCallable('checkUserAndRole');
//     checkFunction({ UID: uid, role: role })
//       .then((result) => {
//         // Handle the result
//         setResponse(result.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         setResponse('');
//       });
//   };