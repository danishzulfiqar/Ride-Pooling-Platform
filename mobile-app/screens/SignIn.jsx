import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, Alert, Image, Keyboard
} from 'react-native';
import { auth } from '../firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import OTPTextInput from 'react-native-otp-textinput';


const ScreenStates = {
  NUMBER_SCREEN: 'NUMBER_SCREEN',
  CODE_SCREEN: 'CODE_SCREEN',
  LOGGED_IN_SCREEN: 'LOGGED_IN_SCREEN'
};


function SignIn({ user, setUser, backbutton, role, sethaveaccount }) {
  const [phoneNumber, setPhoneNumber] = useState("+92");
  const [otpInput, setOtpInput] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(ScreenStates.NUMBER_SCREEN);
  const recaptchaVerifier = useRef(null);
  const [code, setCode] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const functions = getFunctions(auth.app);

  const setback = () => {
    backbutton(0);
  };

  const callCheckDataFunction = async (uid, role) => {
    const checkData = httpsCallable(functions, 'checkData');
    try {
      const result = await checkData({ uid, role });
      console.log(result.data);
      setLoading(false);
      sethaveaccount(result.data);
    } catch (error) {
      console.error("Error calling checkData Function:", error);
    }
  };

  const sendVerification = async () => {
    if (phoneNumber.length === 13) {
      try {
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current);
        setVerificationId(verificationId);
        setCurrentScreen(ScreenStates.CODE_SCREEN);
        Toast.show({
          type: 'success',
          text1: 'Code Sent',
          text1Style: {
            fontSize: 18
          },
          text2: 'Verification code sent to your phone number',
        });
      } catch (error) {
        console.error(error);
        if (error.code === "auth/invalid-phone-number") {
          Toast.show({
            type: 'error',
            text1: 'Invalid Number',
            text1Style: {
              fontSize: 18
            },
            text2: 'Please enter a correct phone number',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'System Error',
            text1Style: {
              fontSize: 18
            },
            text2: error,
          });
        }
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Phone number',
        text1Style: {
          fontSize: 18
        },
        text2: "Enter correct phone number without 0",
        text2Style: {
          fontSize: 13
        },
      });
    }
  };

  const confirmCode = async () => {
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otpInput);
      const userCredential = await signInWithCredential(auth, credential);
      await callCheckDataFunction(userCredential.user.uid, role);
      console.log(role);
      setUser(userCredential.user);
      setCurrentScreen(ScreenStates.LOGGED_IN_SCREEN);
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error.code === 'auth/invalid-verification-code') {
        Toast.show({
          type: 'error',
          text1: 'Incorrect Code',
          text1Style: {
            fontSize: 18
          },
          text2: 'The code you entered is incorrect. Please try again.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error occured',
          text1Style: {
            fontSize: 18
          },
          text2: 'We cannot process your request. Please try again.'
        });
      }
    }
  };

  const onCodeChange = (index, value) => {
    const newCode = [...code];

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }

    if (!value && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        visible={loading}
        textContent={'Please wait'}
        textStyle={{ color: 'white' }}
        overlayColor="rgba(0,0,0,0.5)"
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {
          <View>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.container}>
                <TouchableOpacity style={styles.backbtn} onPress={setback}>
                  <Icon name="arrow-left" size={30} color="grey" />
                </TouchableOpacity>
                <FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={auth.app.options} />

                {currentScreen === ScreenStates.NUMBER_SCREEN && (

                  <View>
                    {/* <View style={styles.ddcontainer}>
                      <Image
                        style={styles.imgstyle}
                        resizeMode="contain"
                        source={require('../assets/Hlogo.png')} />
                    </View> */}

                    <Text style={styles.below_img}>| PASSENGER LOGIN</Text>
                    <Text style={styles.phn_text}>Enter Your Phone Number</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.countryCode}>+92</Text>
                      <TextInput
                        style={styles.inputStyles}
                        onChangeText={(text) => setPhoneNumber("+92" + text)}
                        value={phoneNumber.substring(3)}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        selectionColor="orange"
                        maxLength={10}
                      />
                    </View>
                    <TouchableOpacity style={styles.buttonstyle} onPress={sendVerification}>
                      <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, color: 'white' }}>
                        CONTINUE
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {currentScreen === ScreenStates.CODE_SCREEN && (
                  <View style={styles.formContainer}>
                    <Text style={styles.heading}>Enter Verification Code</Text>
                    <OTPTextInput
                      handleTextChange={(text) => setOtpInput(text)}
                      containerStyle={styles.otpContainer}
                      textInputStyle={styles.otpInput}
                      tintColor="#FF6969"
                      offTintColor="#BBB"
                      inputCount={6}
                    />
                    <TouchableOpacity onPress={confirmCode} style={styles.buttonstyle}>
                      <Text style={{ color: 'black', fontFamily: 'CustomB', fontSize: 16, color: 'white' }}>Confirm Code</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        }
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Custom',
    fontSize: 20,
  },
  formContainer: {
    marginTop: 100,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputGroup: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 20,
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 20,
    marginRight: 0,
    justifyContent: 'center',
  },
  input: {
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    width: '86%',
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
  container: {
    margin: 40,
    justifyContent: 'center'
  },

  phn_text: {
    fontFamily: 'CustomB',
    fontSize: 16,
    marginTop: 30,
    alignSelf: "flex-start"
  },

  below_img: {
    fontFamily: 'CustomB',
    marginBottom: 20,
    alignSelf: 'flex-start',
    fontSize: 22
  },

  ddcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // borderColor:"black",
    // borderWidth:2,
    marginBottom: Platform.OS === 'ios' ? 30 : 30,
  },

  backbtn: {
    marginBottom: 60,
  },

  inputStyles: {
    width: 185,
    marginLeft: 5,
    marginTop: 15,
    fontSize: 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },

  imgstyle: {
    width: 450,
    height: 200,
  },
  buttonstyle: {
    justifyContent: 'center',
    marginTop: 30,
    alignSelf: 'center',
    height: 40,
    width: 320,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FF6969',
  },
});

export default SignIn;
