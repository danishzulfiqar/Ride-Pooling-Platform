import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapsG() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  function onChangeValue(region) {
    alert(JSON.stringify(region));
    setRegion(region);
  }

  return (
    <View style={styles.mapsContainer}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onChangeValue}
        provider={PROVIDER_GOOGLE}
        showsTraffic={true}
      >
        {/* You can add markers here if needed */}
        {/* <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} /> */}
      </MapView>
      <View style={styles.markerContainer}>
        <Image style={styles.markerImage} source={require('./assets/destination.png')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapsContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20, // Half of the image width
    marginTop: -40,  // Half of the image height
  },
  markerImage: {
    width: 40,
    height: 40,
  },
});
