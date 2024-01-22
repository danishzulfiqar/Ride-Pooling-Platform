import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function form({backbutton,currentUser,sethaveaccount}) {

  const [fname,setfname] = useState('');
  const [lname,setlname] = useState('');
  const [email,setemail] = useState('');
  const [dob,setdob] = useState('');
  const [gender,setgender] = useState('');
  const [phone,setphone] = useState('');
  const functions = getFunctions(auth.app);

  const UID = currentUser.uid;

  const data = {
    uid:UID,
    fname:fname,
    lname:lname,
    dob:dob,
    email:email,
    gender:gender,
    phone:phone} 

    console.log(data);

  function senddata(){
    callSavePassengerDataFunction(data);
  }


  const callSavePassengerDataFunction = async (data) => {
    const savePassengerData = httpsCallable(functions, 'savePassengerData');
    try {
      const result = await savePassengerData(data);
      console.log(result.data.status); // Process result data
      // Additional logic based on the result
      sethaveaccount(result.data.status)
    } catch (error) {
      console.error("Error calling Savepassenger Function:", error);
    }
  };

  const setback = () => {
    backbutton(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backbtn} onPress={setback}>
        <Icon name="arrow-left" size={30} color="grey" />
      </TouchableOpacity>

      <View style={styles.ddcontainer}>
        <Image
          style={styles.imgstyle}
          resizeMode="contain"
          source={require('../assets/Hlogo.png')}
        />
      </View>
      <View>
      <View style={styles.name}>
        <TextInput style={styles.inputStyles1} 
        placeholder="FIRST NAME..." 
        onChangeText={(text) => setfname(text)}
        value={fname}
        />
        <TextInput style={styles.inputStyles1} 
        placeholder="LAST NAME..." 
        onChangeText={(text) => setlname(text)}
        value={lname}
        />
      </View>
        <TextInput style={styles.inputStyles} 
        inputMode='email'
        placeholder="EMAIL..." 
        onChangeText={(text) => setemail(text)}
        value={email}
        />
        <TextInput style={styles.inputStyles} 
        placeholder="DOB..." 
        onChangeText={(text) => setdob(text)}
        value={dob}
        />
        <TextInput style={styles.inputStyles} keyboardType="phone-pad" 
        placeholder="PHONE NO..." 
        onChangeText={(text) => setphone(text)}
        value={phone}
        />
        <Picker
         style={styles.inputStyles2}
         selectedValue={gender}
         onValueChange={(itemValue) => setgender(itemValue)}>
         <Picker.Item label="Select Gender" value="" />
         <Picker.Item label="Male" value="m" />
         <Picker.Item label="Female" value="f" />
         <Picker.Item label="Other" value="o" />
        </Picker>
        <TouchableOpacity style={styles.buttonstyle} onPress={senddata}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin:40
  },

  ddcontainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },

  name:{
    flexDirection:'row',
    width:'100%'
  },

  inputStyles1: {
    width:'49%',
    fontSize:16,
    marginRight:4,
    marginBottom: 24,
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },

  inputStyles2: {
    height: 20,
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 16,
  },

  inputStyles: {
    fontSize:16,
    marginBottom: 24,
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },

  imgstyle: {
    width: 450,
    height:200,
  },
  buttonstyle: {
    justifyContent: 'center',
    marginTop: 40,
    alignSelf: 'center',
    height: 40,
    width: 320,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FF6969',
  },
});
