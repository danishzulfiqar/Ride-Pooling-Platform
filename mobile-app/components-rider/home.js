import { React, useState, useMemo, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { getFunctions, httpsCallable } from 'firebase/functions';
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
  const snapPoints = useMemo(() => ['35%','70%'], []);


    ////////////////////////// Get users location /////////////////////////
    const setUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
  
      let currentLocation = await Location.getCurrentPositionAsync({});
  
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
        // In case mapRef.current is not available, ensure loading is also set to false
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
        }}
      >
      </MapView>
    </View>
    {slider === 0 ?(
      <BottomSheet index={0} snapPoints={snapPoints}> 
      <View style={styles.information}>
        <Text style={{fontFamily:'CustomB', fontSize:20}}>RIDER INFORMATION</Text>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.btnStart} onPress={function(){setslider(1)}}>
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
        <TouchableOpacity style={styles.optionBTn}>
          <Text style={styles.optionText}>GO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBTn}>
          <Text style={styles.optionText}>Pooling</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBTn}>
          <Text style={styles.optionText}>Sharing</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.btnStart} onPress={function(){setslider(0)}}>
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
    alignItems: 'center',
    paddingTop:20,
    paddingBottom:20
  },

  options:{
    flexDirection:"row",
    gap:5,
  },

  optionBTn:{
    backgroundColor: "#ECECEC",
    padding:10,
    width:'30%',
    marginBottom:10,
    borderRadius:10,
    alignItems:"center",
    justifyContent:"center",
  },

  optionText:{
    fontFamily: "CustomB",
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
    alignItems:"center",
    justifyContent:"center",
  },

  buttonContainer:{
    alignItems:"center"
  },

  information:{
    alignItems:"center",
    margin:20
  },
});