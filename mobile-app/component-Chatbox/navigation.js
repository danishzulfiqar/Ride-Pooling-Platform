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
import { getFunctions, httpsCallable } from 'firebase/functions';


const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Navigation({
  ridePhaseKey, 
  role, 
  setReviewBox, 
  setNavigationPhase, 
  setRideStatus,
  setRiderBooked,
  set,
  setA,
  setB,
  setLoc1Coordinates,
  setLoc2Coordinates,
  setAni1lat, setAni1lng,
  setAni2lat, setAni2lng,
  set1lat, set1lng,
  setloc2lat, setloc2lng, }) {
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
  const [startRideStatus, setStartRideStatus] = useState(null);
  const [dropoffStatus, setDropoffStatus] = useState(null);
  const [fairPrice, setFairPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [chatBox, setChatBox] = useState(false);
  const [destinationlocation, setDestinationlocation] = useState('COMSATS University Islamabad');
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
  });
  const [l, setL] = useState({
    latitude: 33.7077,
    longitude: 73.0498,
  });
  const functions = getFunctions(auth.app);
  const snapPoints = useMemo(() => ['20%', chatBox ? '100%' : '40%'], [chatBox]);
  const db = getFirestore(app);

////////////////// reading bids->go->rideBidKey from firestore /////////////////////

useEffect(() => {
  const RiderRef = doc(db, "Rides/Bids/GO/jUaMEO6kMYI5VtSAzAPw");
  console.log('this is ridePhaseKey'+ ridePhaseKey);

  // Listen for changes to the RiderRef
  const unsubscribe = onSnapshot(RiderRef, (snapshot) => {
    if (snapshot.exists()) {
      const updatedRequest = snapshot.data(); // Retrieve the data of the specific document
      console.log('this is data from backend' + JSON.stringify(updatedRequest));
        setL({
          latitude: updatedRequest.destination.destinationLoc.latitude,
          longitude: updatedRequest.destination.destinationLoc.longitude,
        });
        setDestinationlocation(updatedRequest.destination.destinationName);
        setStartRideStatus(updatedRequest.active_status);
        setDropoffStatus(updatedRequest.userData.dropoff_status);
        if (updatedRequest.userData.dropoff_status === true) {
          endUserRide();
        } else {
          console.log('else ' + updatedRequest.userData.dropoff_status);
        }
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
    console.log('this is data' + data);
    const distanceValue = data.rows[0].elements[0].distance.value; // Meters
    const distInKm = ((distanceValue / 1000).toFixed(1)) + ' Km' ; // Kilo meters
    const durationValue = data.rows[0].elements[0].duration.text;

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


const startRide = async ()=> {
  const data = {
    uid: auth.currentUser.uid,
    mode: 'GO',
    ridebidKey: ridePhaseKey,
    role: role,
  }

  console.log("this is data for start ride " + JSON.stringify(data));

        const updateGoRideBidPickupStatus = httpsCallable(functions, "updateGoRideBidPickupStatus");
        try {
          const result = await updateGoRideBidPickupStatus(data);
          console.log(result.data);
        } catch (error) {
          console.error("Error calling updateGoRideBidPickupStatus:", error);
        }
}

const endRide = async ()=> { // Rider End Ride
  const data = {
    uid: auth.currentUser.uid,
    ridebidKey: ridePhaseKey,
    role: role,
    mode: 'GO',
  }

  console.log("this is data for end ride " + JSON.stringify(data));

        const endGoRideBid = httpsCallable(functions, "endGoRideBid");
        try {
          const result = await endGoRideBid(data);
          setReviewBox(result.data.status);
          setNavigationPhase(false);
          setRideStatus(false);
        } catch (error) {
          console.error("Error calling endGoRideBid:", error);
        }

}

const endUserRide = ()=> { // User End Ride
    setNavigationPhase(false);
    setReviewBox(true);
    setRiderBooked(false);
    set(0);
    setA("ENTER  PICK-UP  LOCATION");
    setB("ENTER  DROP-OFF  LOCATION");
    setLoc1Coordinates(null);
    setLoc2Coordinates(null);
    setAni1lat(null); setAni1lng(null);
    setAni2lat(null); setAni2lng(null);
    set1lat(null); set1lng(null);
    setloc2lat(null); setloc2lng(null);
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


      <BottomSheet index={1} snapPoints={snapPoints}>
            {chatBox === true ? (
              <ChatBox setChatBox={setChatBox} ridePhaseKey={ridePhaseKey} role={role}/>
            ) : (
              startRideStatus === false ? (
              role === 'rider'? (
                <View style={styles.boxContainer}>
                <Text style={{ color: "gray", fontFamily: "Custom", fontSize: 16, alignSelf: "center", padding:10 }}>waiting for Passenger...</Text>
                <View style={styles.hr} />
                <View style={styles.btnContacts}>
                <TouchableOpacity style={styles.contactBtn}>
                <FontAwesomeIcon icon={faPhone} size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactBtn} 
                onPress={() => {
                  console.log("chatbox");
                  setChatBox(true);
                }}>
                <FontAwesomeIcon icon={faMessage} size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactBtn}>
                <FontAwesomeIcon icon={faShieldHalved} size={25} color="white" />
                </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.startBtn} onPress={startRide}>
                  <Text style={{ color: "black", fontFamily: "CustomB", fontSize: 16, alignSelf: "center" }}>Start Ride</Text>
                </TouchableOpacity>
              </View>
              ) : (
                <View style={styles.boxContainer}>
                <Text style={{ color: "gray", fontFamily: "Custom", fontSize: 16, alignSelf: "center", padding:10 }}>Rider is waiting for you...</Text>
                <View style={styles.hr} />
                <View style={styles.btnContacts}>
                <TouchableOpacity style={styles.contactBtn}>
                <FontAwesomeIcon icon={faPhone} size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactBtn} 
                onPress={() => {
                  setChatBox(true);
                  }}>
                <FontAwesomeIcon icon={faMessage} size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactBtn}>
                <FontAwesomeIcon icon={faShieldHalved} size={25} color="white" />
                </TouchableOpacity>
                </View>
              </View>
              )
            ) : (
              <View style={styles.boxContainer}>
              <View style={styles.infoBox1}>
              <View style={styles.infoBox2}>
              <View style={styles.infoBox3}>
                <Text style={styles.distanceInfo}>{distance} || {duration}</Text>
              </View>
              </View>
            </View>
            <Text style={styles.text1}>away from</Text>
            <Text style={styles.text2}>{destinationlocation}</Text>
            { role === 'rider'? (
              <TouchableOpacity style={styles.endBtn} onPress={endRide}>
              <Text style={{ color: "black", fontFamily: "CustomB", fontSize: 16, alignSelf: "center" }}>End Ride</Text>
            </TouchableOpacity>
            ) : null }
              </View>
            ) 
            )}
        </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  hr: {
    backgroundColor: "grey",
    height: 1,
    width: "80%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 5,
  },

  boxContainer: {
    flex:1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  infoBox3:{
    backgroundColor: "rgba(255, 105, 105, 0.4)",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
  },

  infoBox2:{
    backgroundColor: "rgba(255, 105, 105, 0.5)",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
  },

  infoBox1:{
    backgroundColor: "rgba(255, 105, 105, 0.6)",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
  },

  distanceInfo: {
    fontFamily: 'Custom',
    fontSize: 20,
    color: 'white',
  },

  text1:{
    marginTop: 10,
  },

  text2: {
    fontFamily: 'Custom',
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },

  btnContacts:{
    width: '60%',
    alignSelf:'center',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent:'space-between',
    marginBottom:20
  },

  contactBtn: {
    backgroundColor: "#FF6969",
    borderRadius: 40,
    padding: 16,
  },

  startBtn: {
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

  endBtn: {
    backgroundColor: "#ECECEC",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 10,
    width: "85%",
    alignSelf: "center",
    marginTop: 10,
  },

});
