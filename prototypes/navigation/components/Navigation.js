import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const API_KEY = "YOUR_API_KEY_HERE";

export default function Nav() {
    const mapRef = useRef(null);
    const [heading, setHeading] = useState();
    const [location, setLocation] = useState(null);
    const [loc1lat, setLoc1Lat] = useState(33.6844);
    const [loc1lng, setLoc1Lng] = useState(73.0479);

    async function getUserLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.error("Permission to access location was denied");
            return;
        } else {
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setLoc1Lat(location.coords.latitude);
            setLoc1Lng(location.coords.longitude);
            setHeading(location.coords.heading);
            animateCameraToLocation(location.coords.latitude, location.coords.longitude,location.coords.heading);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getUserLocation();
        }, 1000);
        return () => clearInterval(interval); 
    }, []);

    const animateCameraToLocation = (latitude, longitude,heading1) => {
        mapRef.current.animateCamera({
            center: {
                latitude: latitude,
                longitude: longitude,
            },
            pitch: 50,
            altitude: 500,
            zoom: 18,
            heading: heading1, // You can optionally include heading
            duration: 3000, // Animation duration
        });
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                loadingEnabled={true}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsCompass={true}
            ></MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
