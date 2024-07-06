import { React, useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import polyline from "@mapbox/polyline";
import { auth, app } from "../firebase";
import newstyle from "../styles/mapstyle";
import Icon from "react-native-vector-icons/FontAwesome";
import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMessage, faPhone, faStar, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, collection, getDocs, doc, onSnapshot, updateDoc } from "firebase/firestore";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ChatBox from "../component-Chatbox/chatBox";


const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function RiderOnWay({
  setRiderBooked,
  set,
  setA,
  setB,
  loc1Coordinates,
  setLoc1Coordinates,
  setLoc2Coordinates,
  setAni1lat, setAni1lng,
  setAni2lat, setAni2lng,
  setloc1lat, setloc1lng,
  setloc2lat, setloc2lng,
  ridePhaseKey,
  role,
  setNavigationPhase,
}) {
  const mapRef = useRef(null);
  const [duration, setDuration] = useState();
  const [distance, setDistance] = useState();
  const [riderLocationLat, setRiderLocationLat] = useState(null);
  const [riderLocationLng, setRiderLocationLng] = useState(null);
  const [l1, setL1] = useState(0);
  const [l2, setL2] = useState(0);
  const [route, setRoute] = useState(null);
  const [riderName, setRiderName] = useState(null);
  const [riderRating, setRiderRating] = useState(null);
  const [riderPhone, setRiderPhone] = useState(null);
  const [chatBox, setChatBox] = useState(false);
  const snapPoints = useMemo(() => ['22%', chatBox ? '100%' : '60%'], [chatBox]);


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

///////////////// Reading from firestore //////////////////
  useEffect(() => {
    const db = getFirestore(app);
    const RiderRef = doc(db, "Rides/Bids/GO", ridePhaseKey);
  
    // Listen for changes to the RiderRef
    const unsubscribe = onSnapshot(RiderRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedRequest = snapshot.data(); // Retrieve the data of the specific document
        console.log("this is bidkey information " + JSON.stringify(updatedRequest));
        setRiderLocationLat(updatedRequest.riderData.location.geopoint.latitude);
        setRiderLocationLng(updatedRequest.riderData.location.geopoint.longitude);
        setL1(updatedRequest.userData.pickup);
        setL2(updatedRequest.userData.dropoff);
        setRiderName(updatedRequest.riderData.riderInfo.name);
        setRiderRating(updatedRequest.riderData.riderInfo.rating);
        console.log("this is riderLocationLat " + riderLocationLat + riderLocationLng + l1 + l2); 
        
      } else {
        console.log("No such document!");
      }
    });
  
    return () => {
      // Unsubscribe from the snapshot listener when component unmounts
      unsubscribe();
    };
  }, []);

  ////////// get route ///////////////////

  async function getRoute() {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${loc1Coordinates.lat},${loc1Coordinates.lng}&destination=${riderLocationLat},${riderLocationLng}&key=${API_KEY}`
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

////////////// getting distance ///////////////////
    const fetchDistanceData = async () => {
      try {
        const loc1Lat = loc1Coordinates.lat;
        const loc1Lng = loc1Coordinates.lng;
        const ridersDistanceValLat = riderLocationLat;
        const ridersDistanceValLng = riderLocationLng;

        const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${loc1Lat},${loc1Lng}&destinations=${ridersDistanceValLat},${ridersDistanceValLng}&key=${API_KEY}`);
        const data = await response.json();
        const distanceValue = data.rows[0].elements[0].distance.value;
        const distInKm = ((distanceValue / 1000).toFixed(1)) + ' Km' ;
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
      if (riderLocationLat && riderLocationLng) {
        fetchDistanceData();
        getRoute();
      }
    }, [riderLocationLat, riderLocationLng]);

//////////////////// Checking distance between user and rider ///////////////////

const checkDistance = (distanceValue) => {
  if(distanceValue < 20){
    console.log("Rider is close");
    setNavigationPhase(true);
  }
}
    
//////////// fit map to route /////////////////
    useEffect(() => {
      if (route && mapRef.current) {
        // Fit the map to the coordinates of the polyline
        mapRef.current.fitToCoordinates(route, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }, [route]);

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
          userLocationPriority="high">

            { riderLocationLat && riderLocationLng &&
              (<Marker
              coordinate={{
                latitude: riderLocationLat,
                longitude: riderLocationLng,
              }}
              title="Rider"
              description="On its way">
              <Image
              source={require("../assets/motorcycle.png")}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}/>
            </Marker>)}

            { loc1Coordinates && (
              <Marker
              coordinate={{
                latitude: loc1Coordinates.lat,
                longitude: loc1Coordinates.lng,
              }}
              title="Me">
                <Image
              source={require("../assets/man.png")}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}/>
              </Marker>
            )}

            {route && (
          <Polyline coordinates={route} strokeWidth={4} strokeColor="#000" />
        )}
       {/* {loc1Coordinates.lat &&
            loc1Coordinates.lng && 
            riderLocationLat && riderLocationLng && (
              <MapViewDirections
                origin={{
                  latitude: riderLocationLat,
                  longitude: riderLocationLng,
                }}
                destination={{
                  latitude: loc1Coordinates.lat,
                  longitude: loc1Coordinates.lng,
                }}
                apikey={API_KEY}
                strokeWidth={0}
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
            )}  */}
        </MapView>
      </View>


      <BottomSheet index={0} snapPoints={snapPoints}>
      { chatBox === true ? (
        <ChatBox  setChatBox={setChatBox} ridePhaseKey={ridePhaseKey} role={role}/>
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
            {riderName} arriving in {duration}.
          </Text>
          <Text style={styles.carNumber}>Car / KB-3</Text>
          </View>
          <View >

          <View style={styles.rating}>
            <Image
              style={styles.driverImg}
              resizeMode="contain"
              source={require("../assets/user.png")}
            />
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>{riderRating}</Text>
              <FontAwesomeIcon
                style={styles.ratingLogo}
                icon={faStar}
                size={10}
                color="white"
              />
            </View>
          </View>
          {/* <Text style={styles.carNumber}>Car / KB-3</Text> */}
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
            }}>Route</Text>
            
        <View style={styles.location}>
        <Image style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/a.png')} />
        <Text style={styles.locationText}>{l1}</Text>
      </View>
      <View style={styles.location}>
        <Image style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/b.png')} />
        <Text style={styles.locationText}>{l2}</Text>
      </View>
        </View>

          <View style={styles.btnContacts}>
          <TouchableOpacity style={styles.contactBtn}>
            <FontAwesomeIcon icon={faPhone} size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn} onPress={()=>{setChatBox(true)}}>
            <FontAwesomeIcon icon={faMessage} size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn}>
            <FontAwesomeIcon icon={faShieldHalved} size={25} color="white" />
          </TouchableOpacity>
          </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={backToMain}>
            <Text
              style={{ color: "black", fontFamily: "CustomB", fontSize: 16, alignSelf: "center" }}
            >
              Cancel Ride
            </Text>
          </TouchableOpacity>
          </View>
      )}
      </BottomSheet>
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
    fontSize:14,
    borderRadius: 5,
    fontFamily:'Custom',
    alignSelf: "flex-start",
  },
});
