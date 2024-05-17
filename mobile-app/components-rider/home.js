import { React, useState, useMemo, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import newstyle from "../styles/mapstyle";
import UserRequestCard from "./userRequestCard";
import Navigation from "./navigation";
import { getFirestore, collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app } from "../firebase";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Home() {
  const mapRef = useRef(null);
  const [navMode, setNavMode] = useState(false);
  const [slider, setslider] = useState(1);
  const [mode, setMode] = useState(null);
  const [riderName, setRiderName] = useState(null);
  const [rideBooked, setRideBooked] = useState(false);
  const [rideCancelled, setRideCancelled] = useState(false);
  const [ridePhaseKey, setRidePhaseKey] = useState(null);
  const [rideStatus, setRideStatus] = useState(false);
  const [riderLocation, setRiderLocation] = useState();
  const snapPoints = useMemo(() => ['35%','70%'], []);
  const functions = getFunctions(auth.app);

  useEffect(() => {
    const db = getFirestore(app);
    let uid = auth.currentUser.uid;
    const RiderRef = doc(db, "riders/" + uid);

    const unsubscribe = onSnapshot(RiderRef, (snapshot) => {
      let updatedRiderData = snapshot.data();
      console.log(updatedRiderData);
      setRideBooked(updatedRiderData.crest.activities.rides_booked);
      setRideBooked(updatedRiderData.crest.activities.rides_cancelled);
      setRiderName(updatedRiderData.crest.UserData.first_name+updatedRiderData.crest.UserData.last_name);
    });

    return () => {
      // Unsubscribe from the snapshot listener when component unmounts
      unsubscribe();
    };
  }, []);


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
  {rideStatus === false ? (
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
        searching for passengers...
      </Text>
      <UserRequestCard mode={mode} setRidePhaseKey={setRidePhaseKey} setRideStatus={setRideStatus}/>
    </ScrollView>
    </BottomSheet>

    ):(

      <View style={styles.viewContainer}>
      <View style={styles.options}>
        <TouchableOpacity style={styles.optionBTn} onPress={()=>{setMode('GO')}}>
          <Text style={styles.optionText}>Go</Text>
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
        <Text style={styles.headText}>{riderName}</Text>
        <Text style={styles.text}>Rides booked:{rideBooked}</Text>
        <Text style={styles.text}>Rides cancelled:{rideCancelled}</Text>
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
  ) : (
    <Navigation ridePhaseKey={ridePhaseKey}/>
  )}
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
    paddingBottom:20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10 
  },

  options:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginLeft:25,
    marginRight:25
  },

  optionBTn:{
    backgroundColor: "white",
    paddingLeft:10,
    paddingRight:10,
    height:38,
    width:'30%',
    marginBottom:10,
    borderRadius:10,
    borderColor:"black",
    borderWidth:2,
    alignItems:"center",
    justifyContent:"center",
  },

  optionText:{
    fontFamily: "Custom",
    color:'black',
    fontSize:16,
  },

  btnText:{
    fontFamily: "CustomB",
    color:'white',
    fontSize:18,
  },

  btnStart:{
    backgroundColor: "#FF6969",
    width:'88%',
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

  headText:{
    fontFamily: "CustomB",
    fontSize:16,
    marginRight:15,
    textAlign:"left"
  },

  text:{
    fontFamily: "Custom",
    fontSize:14,
    marginRight:15,
    textAlign:"left"
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
    backgroundColor:'#d9d9d9',
    borderRadius:10,
    paddingLeft:5,
    paddingRight:5
  }
});

