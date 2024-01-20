const test = require('firebase-functions-test')();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK for Emulators
const app = admin.initializeApp(); // Use initializeApp() without any parameters

// Import your Cloud Function
const { savePassengerData } = require('/Users/danish/React Native/Development/RidePool/RidePool-Backend/functions/index.js');


describe('savePassengerData', () => {
  afterEach(() => {
    // Reset Firebase Emulator data between tests
    test.cleanup();
  });

  it('should save passenger data to the database', async () => {
    // Define a test user data
    const userData = {
      uid: 'testUid',
      fname: 'John',
      lname: 'Doe',
      dob: '01/01/1990',
      email: 'johndoe@example.com',
      gender: 'male',
      phone: '1234567890',
    };

    // Call the Cloud Function with test data
    const wrapped = test.wrap(savePassengerData);
    const result = await wrapped(userData, { auth: { uid: 'testAdminUid' } });

    // Perform assertions
    expect(result.status).toBe('success');
    expect(result.message).toBe('new user made');

    // Verify the data in the Firestore Emulator (if needed)
    const userDoc = app.firestore().collection('users').doc('testUid');
    const userSnapshot = await userDoc.get();
    expect(userSnapshot.exists).toBe(true);
  });
});
