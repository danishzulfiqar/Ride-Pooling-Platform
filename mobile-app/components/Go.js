import { React, useState, useMemo } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import { View, TouchableOpacity, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import BottomSheet from '@gorhom/bottom-sheet';
import Slider from './BottomSheetCards';

const API_KEY = 'YOUR_GOOGLE_API_KEY';



export default function Go() {
  const [Change, setChange] = useState(0);
  const [loc1, setLocation1] = useState('');
  const [loc2, setLocation2] = useState('');
  const [A,setA] = useState('ENTER PICKUP LOCATION');
  const [B,setB] = useState('ENTER DROPOFF LOCATION');
  const [locSlider,setLocSlider] = useState(0);
  const [showSlider, setShowSlider] = useState(0);
  const snapPoints = useMemo(() => ['15%', '30%', '60%'], []);
  const snapPoints1 = useMemo(() => ['15%','100%'], []);

  function showingSlider(){
    setShowSlider(1);
  }
  function getloc(){
    setLocSlider(0)
  }
  let x = 'hello';

  return (

    <View style={{flex:1,}}>
    {locSlider === 0 ? (<View style={styles.container}>
      <View style={styles.mapsContainer}>
       <MapView
         provider={PROVIDER_GOOGLE} 
         style={styles.map}
         region={{
           latitude: 33.6844,
           longitude: 73.0479,
           latitudeDelta: 0.015,
           longitudeDelta: 0.0121,
         }}
       >
       </MapView>
     </View>
  
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      {showSlider === 1 ? (<Slider l1={loc1} l2={loc2} set={setShowSlider}/>) : 
      (
        <BottomSheet index={1} snapPoints={snapPoints} >
      <View style={styles.topCon}>
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
          
          <View style={styles.location}>
            <View style={styles.pickupT} >
            <TouchableOpacity onPress={() => { setLocSlider(1) }}><Text style={{marginLeft:10}}>{B}</Text></TouchableOpacity>
            </View>
            <View style={styles.dropoffT}>
              <TouchableOpacity onPress={() => { setLocSlider(1) }}><Text style={{marginLeft:10}}>{B}</Text></TouchableOpacity>
            </View>
          </View>
  
          <TouchableOpacity style={styles.btn}><Text style={{alignSelf:"center"}}>Choose from Map</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={showingSlider}><Text style={{alignSelf:"center"}}>Find Rider</Text></TouchableOpacity>
        </View>
        </View>
        </BottomSheet>
      ) }
      </TouchableWithoutFeedback>
      </View>) : (
        <BottomSheet index={1} snapPoints={snapPoints1}>
        <GooglePlacesAutocomplete
            styles={{
          container: {
            flex: 0,
          },
          textInputContainer: {
            backgroundColor: '#ECECEC',
            marginLeft: 10,
            marginRight: 10,
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
        setA(location1);
        setLocation1(location1);
        console.log(location1);
        
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
            marginLeft: 10,
            marginRight: 10,
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
        setB(location2);
        setLocation2(location2);
        console.log(details);
      }}
      query={{
        key: API_KEY,
        language: 'en',
      }}
    />
    <TouchableOpacity style={styles.btn5} onPress={() => { setLocSlider(0) }}><Text>OKAY</Text></TouchableOpacity>
        </BottomSheet>)}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  topCon:{
    height:'100%'
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
    backgroundColor:'#141E46',
    width:120,
    color:'white',
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

  pickupT:{
    marginTop:10,
    backgroundColor:"#ECECEC",
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'start',
    borderRadius: 8,
  },

  dropoffT:{
    marginTop:10,
    backgroundColor:"#ECECEC",
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'start',
    borderRadius: 8,
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
    backgroundColor:"#FF6969",
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
    backgroundColor: 'white',
    borderColor: '#FF6969',
    borderWidth: 2,
    borderRadius: 10,
  },
  mapsContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  btn5:{
    backgroundColor:"#FF6969",
    height:40,
    width:"90%",
    marginLeft:5,
    marginRight:5,
    marginTop:16,
    borderRadius:10,
    borderColor:'black',
    borderWidth:2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center'
  },
});
