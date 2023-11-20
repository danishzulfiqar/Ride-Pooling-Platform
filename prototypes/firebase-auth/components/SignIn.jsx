import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, Alert, Keyboard
} from 'react-native';
import { auth } from '../firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

const ScreenStates = {
  NUMBER_SCREEN: 'NUMBER_SCREEN',
  CODE_SCREEN: 'CODE_SCREEN',
  LOGGED_IN_SCREEN: 'LOGGED_IN_SCREEN'
};

function SignIn({ user, setUser }) {
  const [phoneNumber, setPhoneNumber] = useState("+92");
  const [code, setCode] = useState(new Array(6).fill(""));
  const [verificationId, setVerificationId] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(ScreenStates.NUMBER_SCREEN);
  const recaptchaVerifier = useRef(null);
  const otpInputRefs = useRef(code.map(() => React.createRef()));

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current);
      setVerificationId(verificationId);
      setCurrentScreen(ScreenStates.CODE_SCREEN);
      Alert.alert("Verification code sent", "Please check your phone for the verification code.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code.join(''));
      const userCredential = await signInWithCredential(auth, credential);
      setUser(userCredential.user);
      setCurrentScreen(ScreenStates.LOGGED_IN_SCREEN);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const onCodeChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = otpInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.page}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
        />

        {currentScreen === ScreenStates.NUMBER_SCREEN && (
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Phone Sign In</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.countryCode}>+92</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setPhoneNumber("+92" + text)}
                value={phoneNumber.substring(3)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <TouchableOpacity onPress={sendVerification} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Send Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentScreen === ScreenStates.CODE_SCREEN && (
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Enter Verification Code</Text>
            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => onCodeChange(index, value)}
                  maxLength={1}
                  keyboardType="number-pad"
                  ref={el => (otpInputRefs.current[index] = el)}
                />
              ))}
            </View>
            <TouchableOpacity onPress={confirmCode} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Confirm Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentScreen === ScreenStates.LOGGED_IN_SCREEN && (
          <Text style={styles.userMsg}>Hi, {user.phoneNumber}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

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
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 20,
    marginRight: 0
  },
  input: {
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    width: '100%',
    margin: 8,
    padding: 12,
    borderRadius: 6
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 6,
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
