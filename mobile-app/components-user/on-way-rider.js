import { React, useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import MapViewDirections from "react-native-maps-directions";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import newstyle from "../styles/mapstyle";
import { faMessage, faPhone, faStar } from "@fortawesome/free-solid-svg-icons";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function RiderOnWay({
  setRiderBooked,
  set,
  setA,
  setB,
  ridersDistanceVal,
  loc1Coordinates,
  setLoc1Coordinates,
  setLoc2Coordinates,
  setAni1lat, setAni1lng,
  setAni2lat, setAni2lng,
  setloc1lat, setloc1lng,
  setloc2lat, setloc2lng
}) {
  const mapRef = useRef(null);
  const [duration, setDuraton] = useState();
  const [distance, setDistance] = useState();
  console.log(ridersDistanceVal);
  console.log(loc1Coordinates);

  function backToMain() {
    setRiderBooked(0);
    set(0);
    setA("ENTER  PICK-UP  LOCATION");
    setB("ENTER  DROP-OFF  LOCATION");
    setLoc1Coordinates(null);
    setLoc2Coordinates(null);
    setAni1lat(null); setAni1lng(null);
    setAni2lat(null); setAni2lng(null);
    setloc1lat(null); setloc1lng(null);
    setloc2lat(null); setloc2lng(null);
  }

  useEffect(() => {
    const fetchDistanceData = async () => {
      try {
        const loc1Lat = loc1Coordinates.lat;
        const loc1Lng = loc1Coordinates.lng;
        const ridersDistanceValLat = ridersDistanceVal.lat;
        const ridersDistanceValLng = ridersDistanceVal.lng;

        const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${loc1Lat},${loc1Lng}&destinations=${ridersDistanceValLat},${ridersDistanceValLng}&key=${API_KEY}`);
        const data = await response.json();
        const distanceValue = data.rows[0].elements[0].distance.value;
        const distInKm = ((distanceValue / 1000).toFixed(1)) + ' Km' ;
        const durationValue = data.rows[0].elements[0].duration.text;

        setDistance(distInKm);
        setDuraton(durationValue);
        console.log(distInKm)

      } catch (error) {
        console.error('Error fetching distance data:', error);
      }
    };
  
    fetchDistanceData();
  }, [ridersDistanceVal]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapsContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
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
        >

          {ridersDistanceVal && (
            <Marker
              coordinate={{
                latitude: ridersDistanceVal.lat,
                longitude: ridersDistanceVal.lng,
              }}
              title="Location 2"
              description="Your drop-off location"
            />
          )}

          {loc1Coordinates && (
            <Marker
              coordinate={{
                latitude: loc1Coordinates.lat,
                longitude: loc1Coordinates.lng,
              }}
              title="Location 2"
              description="Your drop-off location"
            />
          )}

          {loc1Coordinates.lat &&
            loc1Coordinates.lng &&
            ridersDistanceVal.lat &&
            ridersDistanceVal.lng && (
              <MapViewDirections
                origin={{
                  latitude: ridersDistanceVal.lat,
                  longitude: ridersDistanceVal.lng,
                }}
                destination={{
                  latitude: loc1Coordinates.lat,
                  longitude: loc1Coordinates.lng,
                }}
                apikey={API_KEY}
                strokeWidth={3}
                strokeColor="#000000"
                precision="high"
                onReady={(result) => {
                  const coordinates = result.coordinates;
                  mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                  });
                }}
              />
            )}
        </MapView>
      </View>

      <View style={styles.boxContainer}>
        <View style={styles.timing}>
          <Text
            style={{
              color: "grey",
              fontFamily: "Custom",
              fontSize: 24,
              alignSelf: "flex-start",
            }}
          >
            Arriving in ...{" "}
          </Text>
          <Text
            style={{
              color: "black",
              fontFamily: "CustomB",
              fontSize: 24,
              alignSelf: "flex-end",
            }}
          >
            {duration}
          </Text>
        </View>
        <View style={styles.hr} />

        <View style={styles.info}>
          <View style={styles.rating}>
            <Image
              style={styles.driverImg}
              resizeMode="contain"
              source={require("../assets/user.png")}
            />
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>5</Text>
              <FontAwesomeIcon
                style={styles.ratingLogo}
                icon={faStar}
                size={10}
                color="white"
              />
            </View>
          </View>

          <View style={styles.vehicleInfo}>
            <Text style={styles.infoText}>Ali Khan</Text>
            <Text style={styles.infoText1}>BMX-221 / Civic-X</Text>
            <Text style={styles.infoText1}>{distance}</Text>
          </View>
        </View>

        <View style={styles.contact}>
          <TouchableOpacity style={styles.contactBtn}>
            <FontAwesomeIcon icon={faPhone} size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn}>
            <FontAwesomeIcon icon={faMessage} size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={backToMain}>
            <Text
              style={{ color: "white", fontFamily: "CustomB", fontSize: 16 }}
            >
              Cancel Ride
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 150,
  },

  boxContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  hr: {
    backgroundColor: "grey",
    height: 2,
    width: "90%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
  },

  timing: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
  },

  info: {
    flexDirection: "row",
    width: "50%",
    marginBottom: 20,
  },

  contact: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    padding: 10,
    marginBottom: 5,
  },

  contactBtn: {
    backgroundColor: "#141E46",
    borderRadius: 15,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  vehicleInfo: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    textAlign: "left",
  },

  infoText: {
    fontFamily: "Custom",
    fontSize: 18,
    right: 10,
    marginBottom: 6,
  },

  infoText1: {
    fontFamily: "Custom",
    color: "grey",
    fontSize: 18,
    right: 10,
    marginBottom: 6,
  },

  rating: {
    flexDirection: "column",
    width: "100%",
  },

  ratingText: {
    fontSize: 15,
    fontFamily: "Custom",
  },

  ratingLogo: {},

  driverImg: {
    width: "auto",
    height: 70,
  },

  ratingBox: {
    flexDirection: "row",
    gap: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6969",
    width: "30%",
    alignSelf: "center",
  },
});
