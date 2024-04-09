import { React, useState, useMemo, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { getFunctions, httpsCallable } from 'firebase/functions';
import Toast from 'react-native-toast-message';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import newstyle from "../styles/mapstyle";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Home() {
  const mapRef = useRef(null);
  const [slider, setslider] = useState(1);
  const [mode, setMode] = useState(null);
  const [riderLocation, setRiderLocation] = useState();
  const snapPoints = useMemo(() => ['35%','70%'], []);


    ////////////////////////// Get users location /////////////////////////
    const setUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
  
      let currentLocation = await Location.getCurrentPositionAsync({});
      const response = await fetch(
                 `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&key=${API_KEY}`
              );
      
               if (!response.ok) {
                 throw new Error("Failed to fetch address from coordinates");
               }
      
               const data = await response.json();
               const formattedAddress = data.results[0].formatted_address;
               setRiderLocation(formattedAddress);
               console.log(formattedAddress);
  
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          1000
        );
      } else {
      }
    };

  return (
    <View style={{ flex: 1 }}>
  <View style={styles.container}>
    <View style={styles.mapsContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        camera={{
          center: { latitude: 33.6844, longitude: 73.0479 },
          pitch: 0,
          heading: 0,
          altitude: 500,
          zoom: 10,
        }}
        loadingEnabled={true}
        customMapStyle={newstyle}
        showsUserLocation={true}
        userLocationPriority="high"
        onMapReady={async () => {
          await setUserLocation();
        }}>
      </MapView>
    </View>

    {slider === 0 ?(
      <BottomSheet index={0} snapPoints={snapPoints}>

      <View style={styles.buttonContainer}>
      <Text style={styles.mode}>
        {mode}
      </Text>
      <TouchableOpacity style={styles.btnStop} onPress={function(){setslider(1); setMode(null)}}>
        <Text style={styles.btnText}>
          Stop
        </Text>
      </TouchableOpacity>
    </View>

    <ScrollView>
      <Text style={{fontFamily:'Custom', fontSize:16, alignSelf:"center", margin:20 }}>
        searching for passengers.
      </Text>
    </ScrollView>
    </BottomSheet>

    ):(

      <View style={styles.viewContainer}>
      <View style={styles.options}>
        <TouchableOpacity style={styles.optionBTn} onPress={()=>{setMode('GO')}}>
          <Text style={styles.optionText}>GO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBTn} onPress={()=>{setMode('Pooling')}}>
          <Text style={styles.optionText}>Pooling</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBTn} onPress={()=>{setMode('Sharing')}}>
          <Text style={styles.optionText}>Sharing</Text>
        </TouchableOpacity>
      </View>
      
      
    <View style={styles.carCard}>
      <Image style={styles.Carimage} source={require('../assets/car2.png')} resizeMode="contain"/>
      <View>
        <Text style={styles.text}>NAME</Text>
        <Text style={styles.text}>CAR ID</Text>
      </View>
    </View>

      <TouchableOpacity style={styles.btnStart}
       onPress={function(){
        if(mode === null){
          Toast.show({
            type: 'error',
            text1: 'Please Select a mode',
            text1Style: {
              fontSize: 18
            },
          });
        } else {
          setslider(0);
        }
        }}>
        <Text style={styles.btnText}>
          START
        </Text>
      </TouchableOpacity>
    </View>)}

  </View>
</View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  mapsContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  viewContainer: {
    backgroundColor:'white',
    position: 'absolute',
    bottom: 0, 
    width: '100%',
    paddingTop:20,
    paddingBottom:20
  },

  options:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginLeft:25,
    marginRight:25
  },

  optionBTn:{
    backgroundColor: "black",
    paddingLeft:10,
    paddingRight:10,
    height:40,
    width:'30%',
    marginBottom:10,
    borderRadius:10,
    alignItems:"center",
    justifyContent:"center",
  },

  optionText:{
    fontFamily: "Custom",
    color:'white',
    fontSize:18,
  },

  btnText:{
    fontFamily: "Custom",
    fontSize:18,
  },

  btnStart:{
    backgroundColor: "#FF6969",
    width:'90%',
    height:40,
    borderRadius:10,
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"center",
  },

  btnStop:{
    backgroundColor: "#FF6969",
    width:'20%',
    height:40,
    borderRadius:10,
    alignItems:"center",
    justifyContent:"center",
  },

  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 25,
    marginRight: 25
  },
  

  mode:{
    fontFamily: "Custom",
    fontSize:20,
  },

  text:{
    fontFamily: "Custom",
    fontSize:16,
    marginRight:15,
    textAlign:"right"
  },

  Carimage:{
    width:150,
    height:80
  },

  carCard:{
    flexDirection: "row",
    marginLeft: 25,
    marginRight: 25,
    marginBottom:10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor:'#B4B4B8',
    borderRadius:10,
    paddingLeft:5,
    paddingRight:5
  }
});