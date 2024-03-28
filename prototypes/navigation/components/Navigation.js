import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
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
            // console.log(location);
            setLocation(location);
            setLoc1Lat(location.coords.latitude);
            setLoc1Lng(location.coords.longitude);
            setHeading(location.coords.heading);
            animateCameraToLocation(location.coords.latitude, location.coords.longitude, location.coords.heading);
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
            zoom: 18,
            heading: heading1, // You can optionally include heading
            duration: 7000, // Animation duration
        });
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                loadingEnabled={true}
                provider={PROVIDER_GOOGLE}
                // showsUserLocation={true}
                showsCompass={true}
            >
                {location && (
                    <Marker
                        coordinate={{ latitude: loc1lat, longitude: loc1lng, heading: heading }}
                        anchor={{ x: 0.5, y: 0.5 }}
                    // rotating with heading
                    >
                        <Image
                            source={require('../assets/right-arrow.png')}
                            // changing marker color using filter with styles
                            style={{ width: 30, height: 30 }}
                        />
                    </Marker>
                )}

            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
