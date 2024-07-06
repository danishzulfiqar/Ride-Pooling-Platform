import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import polyline from "@mapbox/polyline";
import { auth, app } from "../firebase";
import * as Location from "expo-location";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { faMessage, faPhone, faStar, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, collection, getDocs, doc, onSnapshot, updateDoc } from "firebase/firestore";
import ChatBox from "../component-Chatbox/chatBox";


const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Route({ridePhaseKey, role, setNavigationPhase}) {
  const mapRef = useRef(null);
  const [heading, setHeading] = useState();
  const [location, setLocation] = useState(null);
  const [loc1lat, setloc1lat] = useState();
  const [loc1lng, setloc1lng] = useState();
  const [route, setRoute] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [fairPrice, setFairPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [chatBox, setChatBox] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
  });
  const [l, setL] = useState({
    latitude: 33.7077,
    longitude: 73.0498,
  });
  const snapPoints = useMemo(() => ['20%', chatBox ? '100%' : '55%'], [chatBox]);
  const db = getFirestore(app);

////////////////// reading bids->go->rideBidKey from firestore /////////////////////

useEffect(() => {
  const RiderRef = doc(db, "Rides/Bids/GO", ridePhaseKey);

  // Listen for changes to the RiderRef
  const unsubscribe = onSnapshot(RiderRef, (snapshot) => {
    if (snapshot.exists()) {
      const updatedRequest = snapshot.data(); // Retrieve the data of the specific document
      console.log(JSON.stringify(updatedRequest));
        setL({
          latitude: updatedRequest.destination.destinationLoc.latitude,
          longitude: updatedRequest.destination.destinationLoc.longitude,
        });
        setUserName(updatedRequest.userData.userInfo.name);
        setUserPhone(updatedRequest.userData.userInfo.phone);
        setPickupLocation(updatedRequest.userData.pickup);
       setUserRating(updatedRequest.userData.userInfo.rating);
    } else {
      console.log("No such document!");
    }
  });

  return () => {
    // Unsubscribe from the snapshot listener when component unmounts
    unsubscribe();
  };
}, []);

/////////////// get distance //////////////////

const fetchDistanceData = async () => {
  try {
    const loc1Lat = l.latitude;
    const loc1Lng = l.longitude;
    const ridersDistanceValLat = loc1lat;
    const ridersDistanceValLng = loc1lng;

    const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${loc1Lat},${loc1Lng}&destinations=${ridersDistanceValLat},${ridersDistanceValLng}&key=${API_KEY}`);
    const data = await response.json();
    const distanceValue = data.rows[0].elements[0].distance.value; // Meters
    const distInKm = ((distanceValue / 1000).toFixed(1)) + ' Km' ; // Kilo meters
    const durationValue = data.rows[0].elements[0].duration.text;

    checkDistance(distanceValue);
    setDistance(distInKm);
    setDuration(durationValue);
    console.log(distInKm);
    console.log(durationValue);

  } catch (error) {
    console.error('Error fetching distance data:', error);
  }
};

useEffect(() => {
  if(loc1lat && loc1lng){
    fetchDistanceData();
  }
}, [loc1lat, loc1lng]);


//////////////////// Checking distance between user and rider ///////////////////

const checkDistance = (distanceValue) => {
  if(distanceValue < 20){
    console.log("You are close to the user");
    setNavigationPhase(true);
  }
}

/////////////////// getting users location ////////////////////
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
      updateRiderLocation(location.coords.latitude, location.coords.longitude);
      animateCameraToLocation(
        location.coords.latitude,
        location.coords.longitude,
        location.coords.heading
      );
    }
  }

  ///////////////// Update Rider location in firebase ///////////////////

  const updateRiderLocation = async (lat, lng) => {

    const RiderRef = doc(db, "Rides/Bids/GO", ridePhaseKey);
    const updateData = {
      "riderData.location.geopoint.latitude": lat,
    "riderData.location.geopoint.longitude": lng,
    "riderData.location.geohash": "ttgyvx3m1p"
    };
  
    try {
      await updateDoc(RiderRef, updateData);
      // console.log("Rider rides updated successfully!");
    } catch (error) {
      console.error("Error updating rider rides: ", error);
    }
    
  };

  ////////// get users location after 1 sec ///////////
  useEffect(() => {
    const interval = setInterval(() => {
      getUserLocation();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

////////////////// getting route ///////////////////////
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
              source={require("../assets/carNav.png")}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
          </Marker>
        )}
        {route && (
          <Polyline coordinates={route} strokeWidth={8} strokeColor="#000" />
        )}
      </MapView>


      <BottomSheet index={0} snapPoints={snapPoints}>
      {chatBox === true ? (
        <ChatBox setChatBox={setChatBox} ridePhaseKey={ridePhaseKey} role={role}/>
      ) : (
        <View style={styles.boxContainer}>
        <View style={styles.timing}>
          <View style={styles.timeInfo}>
          <Text
            style={{
              color: "black",
              fontFamily: "CustomB",
              fontSize: 20,
              alignSelf: "flex-start",
            }}
          >
             {userName}
          </Text>
          <Text
            style={{
              color: "grey",
              fontFamily: "Custom",
              fontSize: 16,
              alignSelf: "flex-start",
            }}
          >
             {duration} away({distance}).
          </Text>
          </View>
          <View >

          <View style={styles.rating}>
            <Image
              style={styles.driverImg}
              resizeMode="contain"
              source={require("../assets/user.png")}
            />
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>{userRating}</Text>
              <FontAwesomeIcon
                style={styles.ratingLogo}
                icon={faStar}
                size={10}
                color="white"
              />
            </View>
          </View>
          </View>
        </View>

        <View style={styles.hr} />

        <View style={styles.locationContaner} >

        <Text style={{
              color: "grey",
              fontFamily: "Custom",
              marginTop: 10,
            }}>Payment</Text>

        <View style={styles.location}>
        <Image style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/money.png')} />
        <Text style={styles.locationText}>2000 PKR</Text>
      </View>

        <Text style={{
              color: "grey",
              fontFamily: "Custom",
              marginTop: 10,
            }}>Pickup</Text>
            
        <View style={styles.location}>
        <Image style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/a.png')} />
        <Text style={styles.locationText}>{pickupLocation}</Text>
      </View>
        </View>

          <View style={styles.btnContacts}>
          <TouchableOpacity style={styles.contactBtn}>
            <FontAwesomeIcon icon={faPhone} size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={() => setChatBox(true)}>
            <FontAwesomeIcon icon={faMessage} size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn}>
            <FontAwesomeIcon icon={faShieldHalved} size={25} color="white" />
          </TouchableOpacity>
          </View>

        <TouchableOpacity style={styles.cancelBtn}>
            <Text
              style={{ color: "black", fontFamily: "CustomB", fontSize: 16, alignSelf: "center" }}
            >
              Cancel Ride
            </Text>
          </TouchableOpacity>
          </View>
      )}
        </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  boxContainer: {
    width: "100%",
  },

  hr: {
    backgroundColor: "grey",
    height: 1,
    width: "100%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 5,
  },

  timing: {
    flexDirection: "row",
    justifyContent:'space-between',
    alignSelf:'center',
    alignItems:'center',
    width: '85%',
  },

  timeInfo:{
    width: '70%',
  },

  btnContacts:{
    width: '60%',
    alignSelf:'center',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent:'space-between',
  },

  contactBtn: {
    backgroundColor: "#FF6969",
    borderRadius: 40,
    padding: 16,
  },

  cancelBtn: {
    backgroundColor: "#ECECEC",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 10,
    width: "85%",
    alignSelf: "center",
  },

  rating: {
    flexDirection: "column",
    width: "100%",
  },

  ratingText: {
    fontSize: 14,
    fontFamily: "Custom",
  },

  driverImg: {
    width: "auto",
    height: 60,
  },

  ratingBox: {
    flexDirection: "row",
    gap: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6969",
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "center",
  },

  locationContaner:{
    width:'85%',
    alignSelf:'center',
  },
  
  location:{
    flexDirection:'row',
    alignItems:'center',
  },

  locationText:{
    width:'85%',
    fontFamily:'Custom',
  },

  imgstyle:{
    width:25,
    height:25,
    marginRight:6
  },

  carNumber: {
    color: "grey",
    borderRadius: 5,
    fontFamily:'Custom',
    alignSelf: "center",
    paddingLeft:10,
    paddingRight:10,
  },
});
