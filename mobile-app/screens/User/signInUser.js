import react, { useState, useRef } from "react";
import { ActivityIndicator, View, Text, StyleSheet, Keyboard, TouchableOpacity, SafeAreaView, Platform, TouchableWithoutFeedback } from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from "react-redux";
import PhoneInput from 'react-native-phone-number-input';
import OTPTextInput from 'react-native-otp-textinput';
import { useDispatch } from "react-redux";
import { SetUid } from '../../redux/action';
import Toast from "react-native-toast-message";
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';

export default function SignInUser({ navigation }) {
  const [authScreen, setAuthScreen] = useState('phoneNumber');
  const [otpInput, setOtpInput] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [confirm, setConfirm] = useState(null);
  const phoneInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const role = useSelector(state => state.appEssentials.role);

  const callCheckDataFunction = async (uid, role) => {
    const checkData = functions().httpsCallable('checkData');
    try {
      const result = await checkData({ uid, role });
      console.log(result.data);
      if(result.data === true){
        setLoading(false);
        setFormattedValue('');
        setAuthScreen('phoneNumber');
        navigation.navigate('DrawerNavigationUser');
      } else {
        setLoading(false);
        setFormattedValue('');
        setAuthScreen('phoneNumber');
        navigation.navigate('FormUser');
      }
      
    } catch (error) {
      console.error("Error calling checkData Function:", error);
    }
  };

  ////////////////// Verification Code ////////////////////////

  const sendVerification = async () => {
    setLoading(true);
    try {
        const confirmation = await auth().signInWithPhoneNumber(formattedValue);
        setConfirm(confirmation);
        setAuthScreen('verificationCode');
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Code Sent',
          text1Style: {
            fontSize: 18
          },
          text2: 'Verification code sent to your phone number',
          });
    } catch (error) {
        console.log('Error: ', error);
        setLoading(false);
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
            text2: String(error),
          });
        }
    }
};

  ///////////////////// Confirm Code ////////////////////////

  const confirmCode = async () => {
    setLoading(true);
    try {
      const userCredentials = await confirm.confirm(otpInput);
        const user = userCredentials.user;
        console.log('User UID: ' + user.uid + ' auth.currentuser.uid:' + auth().currentUser.uid);
        dispatch(SetUid(user.uid));
        console.log('Role:'+ role);
        await callCheckDataFunction(user.uid, role);
    } catch (error) {
        console.log('Error: ', error);
        console.error(error);
        setLoading(false);
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
 
  ////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={styles.box}>
          {
            authScreen === 'phoneNumber' ? (
              <View>
              <TouchableOpacity style={styles.backButton} onPress={
                () => { 
                  setFormattedValue('');
                  navigation.navigate('RoleScreen') }}>
                <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
              </TouchableOpacity>

              <View style={styles.headingContainer}>
              <View>
              <Text style={styles.headingText}>| PASSENGER LOGIN</Text>
              <Text style={styles.text}>Enter Your Phone Number</Text>
              </View>
              <View style={styles.inputGroup}>
                      <PhoneInput
                        ref={phoneInputRef}
                        value={formattedValue}
                        defaultCode="PK"
                        layout="first"
                        onChangeFormattedText={(text) => {
                          setFormattedValue(text);
                        }}
                        containerStyle={styles.phoneInputContainer}
                        textContainerStyle={styles.phoneTextInput}
                        textInputProps={{
                          placeholder: 'Phone Number',
                        }}
                        autoFocus
                      />
                    </View>
                    <TouchableOpacity style={styles.buttonstyle} onPress={sendVerification} >
                      {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.btnText}>Send Code</Text>
                      )}
                    </TouchableOpacity>
              </View>
              </View>
            ) : (
              <View style={styles.otpbox}>
              <Text style={styles.textOtp}>Enter Verification Code sent to your Phone number</Text>
                    <OTPTextInput
                      handleTextChange={(text) => setOtpInput(text)}
                      containerStyle={styles.otpContainer}
                      textInputStyle={styles.otpInput}
                      tintColor="#FF6969"
                      offTintColor="#BBB"
                      inputCount={6}
                    />
                    <TouchableOpacity style={styles.buttonstyle} onPress={confirmCode}>
                      { loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.btnText}>Confirm</Text>
                      )}
                    </TouchableOpacity>
              </View>
            )
          }
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  box: {    
    flex: 1,
    paddingVertical: responsiveHeight(5),
    paddingHorizontal: 20,
  },

  backButton: {
    alignSelf: 'flex-start',
  }, 

  headingContainer :{
    marginTop: responsiveHeight(20),
    gap: responsiveHeight(5),
  },

  headingText :{
    fontSize: responsiveFontSize(3),
    fontFamily: 'customb',
    color: "black",
    alignSelf: 'flex-start'
  },

  text :{
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'custom',
    color: "black",
    alignSelf: 'flex-start'
  },

  textOtp :{
    fontSize: responsiveFontSize(2),
    fontFamily: 'custom',
    color: "black",
    alignSelf: 'flex-start'
  },

  buttonstyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'android' ? responsiveHeight(5) : responsiveHeight(6),
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#FF6969',
    },

    btnText: {
    fontFamily: 'customb',
    fontSize: responsiveFontSize(2),
    color: 'white',
    }, 

    phoneInputContainer: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    elevation: 3,
  },
  
  phoneTextInput: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 10,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  otpbox: {
    flex: 1,
    alignItems: 'center',
    marginTop: responsiveHeight(20),
    gap: responsiveHeight(5),
  },

  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
  },

});