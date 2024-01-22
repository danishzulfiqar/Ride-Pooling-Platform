import react from "react";
import { View, StyleSheet } from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps


export default function MapsG(){ 
  region= {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return(
   <View style={styles.mapsContainer}>
     <MapView 
       style={styles.map}
       initialRegion={region}
       provider={PROVIDER_GOOGLE}
     >
     <Marker
  coordinate={{
    latitude: 37.78810,
    longitude: -122.4340
  }}
/>

     </MapView>
   </View>
)};

const styles = StyleSheet.create({
  mapsContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });