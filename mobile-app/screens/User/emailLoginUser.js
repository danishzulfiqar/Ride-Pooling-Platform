import { useState } from "react";
import { View, Text, StyleSheet, Keyboard, TouchableOpacity, SafeAreaView, Platform, TouchableWithoutFeedback, TextInput } from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { SetUid } from "../../redux/action";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignInUser({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [haveAccount, setHaveAccount] = useState(true);

    const dispatch = useDispatch();
    const functions = getFunctions(app);
    const role = useSelector(state => state.appEssentials.role);

    const callCheckDataFunction = async (uid, role) => {
      console.log(uid, role);
      const data = {
        uid: uid,
        role: role,
      };
      const checkData = httpsCallable(functions, 'checkData');
      try {
        const result = await checkData(data);
        console.log(result.data);
      } catch (error) {
        console.error("Error calling checkData Function:", error);
      }
    };

    function checkPassword() {
      if (password !== confirmPassword) {
        Toast.show({
            type: 'error',
            text1: 'Error signing up:',
            text2: 'Passwords do not match',
            text1Style: {
                fontFamily: 'custom',
              fontSize: 18
            },
          });
        return false;
      } else {
        return true;
      }
    }


    async function signUpUser() {
        if (!checkPassword()) {
            return; 
          }
      try {
        await createUserWithEmailAndPassword(auth, email, confirmPassword);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        dispatch(SetUid(user.uid));
        console.log('User signed up:', user.uid);
        await callCheckDataFunction(user.uid, role);
        Toast.show({
            type: 'success',
            text1: 'Successfully signed up!',
            text1Style: {
                fontFamily: 'custom',
              fontSize: 18
            },
          });
          navigation.navigate('DrawerNavigationUser');
      } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error signing up:',
            text2: error.message,
            text1Style: {
                fontFamily: 'custom',
              fontSize: 18
            },
          });
      }
    }

    async function signInUser() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        dispatch(SetUid(user.uid));
        console.log('User signed in:', user.uid);
        await callCheckDataFunction(user.uid, role);
        Toast.show({
            type: 'success',
            text1: 'Successfully signed up!',
            text1Style: {
                fontFamily: 'custom',
              fontSize: 18
            },
          });
          navigation.navigate('DrawerNavigationUser');
      } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error signing up:',
            text2: error.message,
            text1Style: {
                fontFamily: 'custom',
              fontSize: 18
            },
          });
      }
    }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={styles.box}>
            { haveAccount ? (
                <View>
                <TouchableOpacity style={styles.backButton} 
                onPress={() => {
                        setHaveAccount(true);
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        navigation.navigate('RoleScreen');
                        }}>
                <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
              </TouchableOpacity>

              <View style={styles.headingContainer}>
              <View>
              <Text style={styles.headingText}>| PASSENGER SIGNIN</Text>
              <Text style={styles.text}>Enter Your Email And Password</Text>
              </View>
              <View style={styles.inputGroup}>
                      <TextInput 
                        style={styles.input}
                        placeholder="Email: example@gmail.com"
                        selectionColor={'#FF6969'}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                      />
                      <TextInput 
                        style={styles.input}
                        placeholder="Password"
                        selectionColor={'#FF6969'}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                      />
                    </View>
                    <TouchableOpacity style={styles.buttonstyle} onPress={()=>{signInUser()}}>
                      <Text style={styles.btnText}>
                        CONTINUE
                      </Text>
                    </TouchableOpacity>
              </View>
              <View style={styles.bottomContainer}>
                    <Text style={styles.bottomText}>Don't have an account ? </Text>
                    <TouchableOpacity onPress={()=>{
                        setEmail('');
                        setPassword('');
                        setHaveAccount(false);
                    }}>
                    <Text style={styles.bottomText2}>Signup</Text></TouchableOpacity>
              </View>
              </View>
            ) : (
                <View>
              <TouchableOpacity style={styles.backButton} 
              onPress={() => {
                        setHaveAccount(true);
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        navigation.navigate('RoleScreen');
                        }}>
                <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
              </TouchableOpacity>

              <View style={styles.headingContainer}>
              <View>
              <Text style={styles.headingText}>| PASSENGER SIGNUP</Text>
              <Text style={styles.text}>Enter Your Email And Password</Text>
              </View>
              <View style={styles.inputGroup}>
                      <TextInput 
                        style={styles.input}
                        placeholder="Email: example@gmail.com"
                        selectionColor={'#FF6969'}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                      />
                      <TextInput 
                        style={styles.input}
                        placeholder="Password"
                        selectionColor={'#FF6969'}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                      />
                      <TextInput 
                        style={styles.input}
                        placeholder="Confirm Password"
                        selectionColor={'#FF6969'}
                        secureTextEntry={true}
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                      />
                    </View>
                    <TouchableOpacity style={styles.buttonstyle} onPress={()=>{signUpUser()}}>
                      <Text style={styles.btnText}>
                        CONTINUE
                      </Text>
                    </TouchableOpacity>
              </View>
              <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>Already have an account ? </Text>
                <TouchableOpacity onPress={
                    ()=>{
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        setHaveAccount(true);
                    }
                }><Text style={styles.bottomText2}>Signin</Text></TouchableOpacity>
              </View>
              </View>
            ) }
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

  headingContainer: {
    marginTop: responsiveHeight(20),
    gap: responsiveHeight(5),
  },

  headingText: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'customb',
    color: "black",
    alignSelf: 'flex-start'
  },

  text: {
    fontSize: responsiveFontSize(1.8),
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

  input: {
    height: responsiveHeight(7),
    width: '100%',
    borderColor: 'gray',
    backgroundColor: 'white',
    fontFamily: 'custom',
    marginBottom: responsiveHeight(1),
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
  },

  bottomContainer: {
    marginTop: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  bottomText: {
    fontFamily: 'custom',
    fontSize: responsiveFontSize(1.8),
  },

  bottomText2: {
    fontFamily: 'custom',
    fontSize: responsiveFontSize(2),
    color: '#FF6969',
  },

});