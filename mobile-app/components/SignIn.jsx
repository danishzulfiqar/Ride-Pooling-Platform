import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, Alert, Keyboard
} from 'react-native';
import { auth } from '../firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

function SignIn({ user, setUser }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current);
      setVerificationId(verificationId);
      setShowCodeInput(true);
      Alert.alert("Verification code sent", "Please check your phone for the verification code.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      setUser(userCredential.user);
      Alert.alert("Phone authentication successful", "You are now signed in!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.page}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
        />
        {!user ? (
          <>
            <Text style={styles.heading}>Phone Sign In</Text>
            <View style={styles.formContainer}>
              {!showCodeInput ? (
                <>
                  <TextInput
                    style={styles.input}
                    onChangeText={setPhoneNumber}
                    value={phoneNumber}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                  <TouchableOpacity onPress={sendVerification} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Send Code</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    onChangeText={setCode}
                    value={code}
                    placeholder="Enter Verification Code"
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity onPress={confirmCode} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Confirm Code</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.userMsg}>Hi, {user.phoneNumber}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles remain unchanged

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  userMsg: {
    fontSize: 18,
    marginVertical: 20,
    opacity: 0.5
  },
  heading: {
    fontSize: 40,
    marginBottom: 20
  },
  formContainer: {
    width: '75%',
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    opacity: 0.5
  },
  input: {
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    width: '100%',
    textTransform: 'lowercase',
    margin: 8,
    padding: 12,
    borderRadius: 6
  },
  submitButton: {
    backgroundColor: 'black',
    width: '100%',
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 20
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  alternativeButton: {
    marginTop: 8
  }
});


export default SignIn;