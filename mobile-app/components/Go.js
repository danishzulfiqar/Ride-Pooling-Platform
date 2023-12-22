import { React, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const API_KEY = 'YOUR_GOOGLE_API_KEY';



export default function Go() {
  const [Change, setChange] = useState(0);

  return (

    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
    <View>
          <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
          <TouchableOpacity style={[styles.btn3, Change === 1 ? styles.buttonPressed : null]} onPress={() => { setChange(1) }}>
            <Image
              style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/motor-sports.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn3, Change === 2 ? styles.buttonPressed : null]} onPress={() => { setChange(2) }}>
            <Image
              style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/standard.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn3, Change === 3 ? styles.buttonPressed : null]} onPress={() => { setChange(3) }}>
            <Image
              style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/air-conditioner.png')} />
          </TouchableOpacity>
        </View>

      <View style={styles.inputcontainer}>
        <Text style={styles.h1}>GO</Text>
        {/* <TextInput 
        style={styles.input} 
        placeholder=" Enter pick-up point" 
        selectionColor="orange" 
        underlineColorAndroid="transparent"/> */}

        {/* <TextInput 
        style={styles.input} 
        placeholder="Enter your destination" 
        selectionColor="orange"
        underlineColorAndroid="transparent"/> */}

        <GooglePlacesAutocomplete
            styles={{
          container: {
            flex: 0,
          },
          textInputContainer: {
            backgroundColor: '#ECECEC',
            marginLeft: 0,
            marginRight: 0,
            height: 40,
            borderRadius:5,
            alignItems:'center',
            marginTop:10
          },
          textInput: {
            backgroundColor:'transparent',
            color: 'black',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: 'orange',
          },
        }}
        placeholder=" Enter pick-up point" 
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        const location1 = data.description;
        console.log(details);
      }}
      query={{
        key: API_KEY,
        language: 'en',
      }}
    />

<GooglePlacesAutocomplete
            styles={{
          container: {
            flex: 0,
          },
          textInputContainer: {
            backgroundColor: '#ECECEC',
            marginLeft: 0,
            marginRight: 0,
            height: 40,
            borderRadius:5,
            alignItems:'center',
            marginTop:10
          },
          textInput: {
            backgroundColor:'transparent',
            color: 'black',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: 'orange',
          },
        }}
        placeholder="Enter your destination"  
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        const location2 = data.description;
        console.log(details);
      }}
      query={{
        key: API_KEY,
        language: 'en',
      }}
    />

        <TouchableOpacity style={styles.btn}><Text style={{alignSelf:"center"}}>Choose from Map</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn2}><Text style={{alignSelf:"center"}}>Find Rider</Text></TouchableOpacity>
      </View>
      </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop:290,
  },

  inputcontainer: {
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    marginTop: 2,
    borderRadius: 10,
    // For iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowColor: 'black',
    // For Android
    elevation: 6,
  },

  h1:{
    fontFamily:"monospace",
    fontSize:20,
    padding:10,
    backgroundColor:'grey',
    width:120,
    marginBottom:5,
    textAlign:'center',
    borderRadius:10
  },

  input:{
    height:40,
    marginTop:10,
    borderRadius:5,
    backgroundColor:"#ECECEC"
  },

  btn:{
    marginTop:10,
    backgroundColor:"#ECECEC",
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center',
    
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },

  btn2:{
    marginTop:20,
    backgroundColor:"orange",
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  imgstyle: {
    width: 50,
    height: 50,
  },

  btn3: {
    marginTop: 10,
    backgroundColor: "#ECECEC",
    height: 60,
    width: 128,
    marginLeft: 1,
    marginRight: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: 'orange',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },
});
