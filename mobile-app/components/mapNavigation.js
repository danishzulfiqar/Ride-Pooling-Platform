import React, { useRef, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Modal, TextInput, Platform, Linking, BackHandler } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import { useSelector, useDispatch } from "react-redux";
import MapStyle from '../styles/mapStyle';
import firestore from '@react-native-firebase/firestore';
import functions from "@react-native-firebase/functions";
import { SetPickupLocation, SetPickupLocationCoords, SetDropoffLocation, 
  SetDropoffLocationCoords, SetNavigationPhase, SetRidePhaseKey } from "../redux/action";


export default function NavigateToUser({navigation, setReviewBoxHome }){
    const mapRef = useRef(null);
    const [heading, setHeading] = useState();
    const [location, setLocation] = useState(null);
    const [loc1lat, setloc1lat] = useState();
    const [loc1lng, setloc1lng] = useState();
    const [destinationlocation, setDestinationlocation] = useState(null);
    const [route, setRoute] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [reachedDestination, setReachedDestination] = useState(false);
    const [markerPosition, setMarkerPosition] = useState({
        latitude: 33.6844,
        longitude: 73.0479,
    });
    const [l, setL] = useState({
        latitude: 33.7077,
        longitude: 73.0498,
    });
    const API_KEY = "YOUR_GOOGLE_API_KEY";

    const dispatch = useDispatch();
    const UID = useSelector(state => state.appEssentials.uid);
    const role = useSelector(state => state.appEssentials.role);
    const ridePhaseKey = useSelector(state => state.appEssentials.ridePhaseKey);
    const navigationPhase = useSelector(state => state.appEssentials.navigationPhase);

              ////////// get users location after 1 sec ///////////
  useEffect(() => {
    const interval = setInterval(() => {
      getUserLocation();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
        if (!ridePhaseKey) return; // Exit if ridePhaseKey is not defined
      
        const rideDocRef = firestore()
          .collection('Rides')
          .doc('Bids')
          .collection('GO')
          .doc(ridePhaseKey);
      
        const unsubscribe = rideDocRef.onSnapshot(snapshot => {
          if (snapshot.exists) {
            const updatedRequest = snapshot.data();
      
            setL({
              latitude: updatedRequest.userData.dropoff_location.latitude,
              longitude: updatedRequest.userData.dropoff_location.longitude,
            });
            setDestinationlocation(updatedRequest.userData.dropoff);
            console.log('this is destination location' + updatedRequest.destination.destinationName);
            console.log(l);
            // setDropoffStatus(updatedRequest.userData.dropoff_status);
      
            if(role === 'user'){
              if (updatedRequest.userData.dropoff_status === true) {
                dispatch(SetPickupLocation('Enter Pickup Location'));
                dispatch(SetPickupLocationCoords(null));
                dispatch(SetDropoffLocation('Enter Dropoff Location'));
                dispatch(SetDropoffLocationCoords(null));
                dispatch(SetRidePhaseKey(null));
                dispatch(SetNavigationPhase(false));
                setReviewBoxHome(true);
              } 
            }
          } else {
            console.log("No such document!");
          }
        });
      
        return () => {
          // Unsubscribe from the snapshot listener when component unmounts
          unsubscribe();
        };
      }, [ridePhaseKey]);



      
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
        if(distanceValue < 30){
            setReachedDestination(true);
          console.log("Reached");
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
            animateCameraToLocation(
              location.coords.latitude,
              location.coords.longitude,
              location.coords.heading
            );
          }
        }
      
        


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
      console.log('route set');
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  }
    
    
    useEffect(() => {
        if (loc1lat !== undefined && loc1lng !== undefined) {
          getRoute();
          console.log('getting route')
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

      const endRide = async () => {
        const data = {
          uid: UID,
          ridebidKey: ridePhaseKey,
          role: role,
          mode: 'GO',
        };
      
        console.log("this is data for end ride " + JSON.stringify(data));
      
        const endGoRideBid = functions().httpsCallable('endGoRideBid');
        try {
          const result = await endGoRideBid(data);
          dispatch(SetNavigationPhase(false));
          dispatch(SetRidePhaseKey(null));
          setReviewBoxHome(true);
        } catch (error) {
          console.error("Error calling endGoRideBid:", error);
        }
      };

      const openMaps = () => {
        if (!destinationlocation || destinationlocation.trim() === '') {
          console.warn('Destination location is not available');
          return;
        }
        
        const encodedDest = encodeURIComponent(destinationlocation);
    
        let url;
        if (Platform.OS === 'ios') {
          url = `maps://app?daddr=${encodedDest}`;
        } else {
          url = `google.navigation:q=${encodedDest}`;
        }
    
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDest}`;
            return Linking.openURL(webUrl);
          }
        });
      };

      useEffect(()=>{
        const handleBackButton = () => {
    
          return false;
        };
    
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
      },[])

      useEffect(()=>{
        const handleBackButton = () => {
    
          return false;
        };
    
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
      },[])

    return(
        <SafeAreaView style={styles.container}>
        

            <MapView
                ref={mapRef}
                style={styles.map}
                showsCompass={true}
                customMapStyle={MapStyle}>
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

            <View style={styles.BottomContainer}>
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
            <TouchableOpacity style={styles.navBtn} onPress={() => {openMaps();}}>
            <Image source={ Platform.OS === 'android' ? require("../assets/maps.png") : require("../assets/imaps.png") } 
            style={{width: 20, height: 20}} />
            <Text style={styles.navBtnText}>
            Use {Platform.OS === 'android' ? 'Google Maps' : 'Apple Maps'} Navigation
            </Text>
           </TouchableOpacity>
             { 'rider' === 'rider' ? (
                <TouchableOpacity style={styles.endBtn} onPress={endRide} disabled={!reachedDestination}>
              <Text 
              style={reachedDestination === true ? styles.btntext1 : styles.btntext}>
              End Ride
              </Text>
            </TouchableOpacity>
             ) : (
                null
             ) }
              </View>
            </View>
            

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === "android" ? 20 : 0,
    },

  map: {
    flex: 1,
  },

  navBtn:{
    zIndex: 1,
    backgroundColor:'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: responsiveWidth(5),
    width: responsiveWidth(50),
    gap: responsiveHeight(1),
    width: responsiveWidth(90),
  },

  navBtnText:{
    fontFamily: "customb",
    color: "black",
    fontSize: responsiveFontSize(2),
  },

  BottomContainer :{
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: responsiveWidth(100),
    backgroundColor: 'white',
    padding: responsiveWidth(5),
    alignItems: 'center',
    justifyContent: 'center',
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

  endBtn: {
    backgroundColor: "#ECECEC",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 10,
    width: responsiveWidth(90),
    alignSelf: "center",
    marginTop: 10,
  },

  btntext1: {
    fontFamily: 'customb',
    fontSize: responsiveFontSize(2.2),
    color: 'black',
    textAlign: 'center',
  },

  btntext: {
    fontFamily: 'custom',
    fontSize: responsiveFontSize(2),
    color: 'grey',
    textAlign: 'center',
  },
  
});
