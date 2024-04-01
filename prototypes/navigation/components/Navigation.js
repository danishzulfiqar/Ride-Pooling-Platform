import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Nav() {
  const mapRef = useRef(null);
  const [heading, setHeading] = useState();
  const [location, setLocation] = useState(null);
  const [loc1lat, setloc1lat] = useState();
  const [loc1lng, setloc1lng] = useState();
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
  });

  async function getUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    } else {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMarkerPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setHeading(location.coords.heading);
      setloc1lat(location.coords.latitude);
      setloc1lng(location.coords.longitude);
      animateCameraToLocation(
        location.coords.latitude,
        location.coords.longitude,
        location.coords.heading
      );
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getUserLocation();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const animateCameraToLocation = (latitude, longitude, heading1) => {
    mapRef.current.animateCamera({
      center: {
        latitude: latitude,
        longitude: longitude,
      },
      pitch: 50,
      altitude: 500,
      zoom: 19,
      heading: heading1, // You can optionally include heading
      duration: 1000, // Animation duration
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        // showsUserLocation={true}
        showsCompass={true}
      >
        {location && (
          <Marker coordinate={markerPosition} anchor={{ x: 0.5, y: 0.5 }}>
            <Image
              source={require("../assets/car.png")}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
          </Marker>
        )}

        {loc1lat && (
          <MapViewDirections
            apikey={API_KEY}
            origin={{
              latitude: loc1lat,
              longitude: loc1lng,
            }}
            // waypoints={[
            //     {latitude:33.651592,longitude:73.156456},
            //     ]}
            destination={{ latitude: 33.7077, longitude: 73.0498 }}
            strokeWidth={5}
            strokeColor="black"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
