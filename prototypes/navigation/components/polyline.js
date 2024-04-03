import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Route() {
  const mapRef = useRef(null);
  const [heading, setHeading] = useState();
  const [location, setLocation] = useState(null);
  const [loc1lat, setloc1lat] = useState();
  const [loc1lng, setloc1lng] = useState();
  const [route, setRoute] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
  });
  const [l, setL] = useState({
    latitude: 33.7077,
    longitude: 73.0498,
  });

  async function getRoute() {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${loc1lat},${loc1lng}&destination=${l.latitude},${l.longitude}&key=${API_KEY}`
      );
      const data = await response.json();
      // Decode the polyline points
      const polylinePoints = polyline.decode(data.routes[0].overview_polyline.points);
      // Convert the decoded polyline points into an array of {latitude, longitude} objects
      const coordinates = polylinePoints.map(point => ({
        latitude: point[0],
        longitude: point[1]
      }));
      setRoute(coordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  }

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

  ////////// get users location after 1 sec ///////////
  useEffect(() => {
    const interval = setInterval(() => {
      getUserLocation();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  ////////// get route when users location is set ///////////
  useEffect(() => {
    if (loc1lat !== undefined && loc1lng !== undefined) {
      getRoute();
    }
  }, [loc1lat, loc1lng]);

  const animateCameraToLocation = (latitude, longitude, heading1) => {
    mapRef.current.animateCamera({
      center: {
        latitude: latitude,
        longitude: longitude,
      },
      pitch: 50,
      altitude: 500,
      zoom: 17,
      heading: heading1, // You can optionally include heading
      duration: 7000, // Animation duration
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
          <Marker coordinate={markerPosition} anchor={{ x: 0.47, y: 0.7 }}>
            <Image
              source={require("../assets/car.png")}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
          </Marker>
        )}
        {route && (
          <Polyline coordinates={route} strokeWidth={8} strokeColor="#000" />
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
