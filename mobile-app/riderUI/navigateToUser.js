import React, { useRef, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Modal, TextInput, Platform, Linking, BackHandler } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import { useSelector } from "react-redux";
import MapStyle from '../styles/mapStyle';
import BottomSheet from "@gorhom/bottom-sheet";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import functions from "@react-native-firebase/functions";
import ngeohash from 'ngeohash';
import Toast from 'react-native-toast-message';
import { SetRidePhaseKey, SetNavigationPhase, SetCurrentScreenRider } from "../redux/action";
import RBSheet from "react-native-raw-bottom-sheet";
import ChatBox from "../components/chatBox";



export default function NavigateToUser(){
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
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [cancelComment, setCancelComment] = useState(null);
    const [reviewBox, setReviewBox] = useState(false);
    const [startRide, setStartRide] = useState(false);
    const [markerPosition, setMarkerPosition] = useState({
        latitude: 33.6844,
        longitude: 73.0479,
    });
    const [l, setL] = useState({
        latitude: 33.7077,
        longitude: 73.0498,
    });
    const refRBSheet = useRef();
    const snapPoints = useMemo(() => [responsiveHeight(20), responsiveHeight(65)], []);
    const API_KEY = "YOUR_GOOGLE_API_KEY";

    const dispatch = useDispatch();
    const UID = useSelector(state => state.appEssentials.uid);
    const role = useSelector(state => state.appEssentials.role);
    const ridePhaseKey = useSelector(state => state.appEssentials.ridePhaseKey);

    useEffect(() => {
      const interval = setInterval(() => {
        getUserLocation();
      }, 5000);
      return () => clearInterval(interval);
    }, []);

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

    const cancelRide = async () => {
        const data = {
          uid: UID,
          mode: 'GO',
          ridebidKey: ridePhaseKey,
          role: role,
          reason: cancelComment,
        };
      
        console.log("this is data for end ride", JSON.stringify(data));
      
        const cancelGoRideBid = functions().httpsCallable('cancelGoRideBid');
        try {
          const result = await cancelGoRideBid(data);
          console.log("this is result", JSON.stringify(result));
          setReviewBox(false);
          handleFirebaseRidePhaseNode();
          dispatch(SetRidePhaseKey(null));
          dispatch(SetCurrentScreenRider('home'));
          Toast.show({
            type: 'success',
            text1: "Ride Cancelled",
            text1Style: {
              fontSize: 18,
              fontFamily:'custom'
            },
            text2: `Ride Cancelled Successfully`,
          });
        } catch (error) {
          console.error("Error calling cancelGoRideBid:", error);
        }
      };

      
const startRideNav = async () => {
    const data = {
      uid: UID,
      mode: 'GO',
      ridebidKey: ridePhaseKey,
      role: role,
    };
  
    console.log("this is data for start ride " + JSON.stringify(data));
  
    const updateGoRideBidPickupStatus = functions().httpsCallable('updateGoRideBidPickupStatus');
    try {
      const result = await updateGoRideBidPickupStatus(data);
      console.log(result.data);
      if(result.data === true) {
        SetNavigationPhase(true);
        SetCurrentScreenRider('home');
      }
    } catch (error) {
      console.error("Error calling updateGoRideBidPickupStatus:", error);
    }
  };

    useEffect(() => {
        const RiderRef = firestore().collection('Rides').doc('Bids').collection('GO').doc(ridePhaseKey);
        // Listen for changes to the RiderRef
        const unsubscribe = RiderRef.onSnapshot((snapshot) => {
          if (snapshot.exists) {
            const updatedRequest = snapshot.data(); // Retrieve the data of the specific document
            console.log(JSON.stringify(updatedRequest));
            setL({
              latitude: updatedRequest.destination.destinationLoc.latitude,
              longitude: updatedRequest.destination.destinationLoc.longitude,
            });
            setUserName(updatedRequest.userData.userInfo.name);
            setUserPhone(updatedRequest.userData.userInfo.phone);
            setPickupLocation(updatedRequest.userData.pickup);
            setUserRating(updatedRequest.userData.userInfo.rating.toFixed(1));
            if(updatedRequest.userData.pickup_status === true){
                dispatch(SetNavigationPhase(true));
                dispatch(SetCurrentScreenRider('home'));
              }
              if(updatedRequest.cancel_status.status === true){
                setReviewBox(false);
                handleFirebaseRidePhaseNode();
                dispatch(SetRidePhaseKey(null));
                dispatch(SetCurrentScreenRider('home'));
                Toast.show({
                  type: "info",
                  text1: "Ride Cancelled",
                  text1Style: {
                    fontSize: 18,
                    fontFamily:'custom'
                  },
                  text2: `User Cancelled the Ride`,
                });
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
            setStartRide(true);
          console.log("You are close to the user");
        }
      }
      
        ///////////////// Update Rider location in firebase ///////////////////
      
        const updateRiderLocation = async (lat, lng) => {
          const RiderRef = firestore().collection('Rides').doc('Bids').collection('GO').doc(ridePhaseKey);
          const geohash = ngeohash.encode(lat, lng);
          console.log('this is riders geohash update: ',geohash);
        
          const updateData = {
            'riderData.location.geopoint.latitude': lat,
            'riderData.location.geopoint.longitude': lng,
            'riderData.location.geohash': geohash,
          };
        
          try {
            await RiderRef.update(updateData);
            console.log("Rider location updated successfully!");
          } catch (error) {
            console.error("Error updating rider location: ", error);
          }
        };

          ////////// get users location after 1 sec ///////////
  useEffect(() => {
    const interval = setInterval(() => {
      getUserLocation();
    }, 100000);
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

      const openMaps = () => {
        if (!pickupLocation || pickupLocation.trim() === '') {
          console.warn('Destination location is not available');
          return;
        }
        
        const encodedDest = encodeURIComponent(pickupLocation);
    
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

      const handleFirebaseRidePhaseNode = async () => {
        const ref = firestore().collection("riders").doc(UID);
    
        const updateDoc = {
          current_ride: {
          RidebidKey: '',
          rideStatus: false,
        }
        };
    
        try{
          await ref.update(updateDoc);
          console.log("Ride Phase Node Updated");
        }
        catch(error){
          console.log(error);
        }
        
      };

    return(
        <SafeAreaView style={styles.container}>
        <Modal
              animationType="slide"
              transparent={true}
              visible={reviewBox}
              onRequestClose={() => {
                setReviewBox(!reviewBox);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalheading}>Tell us what's the problem?</Text>
                  {/* <Text style={styles.modalText}></Text> */}  
                  <TextInput style={styles.modalInput} placeholder="Reason" onChangeText={(text) => setCancelComment(text)} />
                  <TouchableOpacity
                    style={styles.submitbtn}
                    onPress={() => {cancelRide();}}>
                    <Text style={styles.textStyle}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelbtn}
                    onPress={() => {setReviewBox(!reviewBox);}}>
                    <Text style={styles.textStyle1}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            

            <MapView
                ref={mapRef}
                style={styles.map}
                showsCompass={true}
                customMapStyle={MapStyle}
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

            <RBSheet ref={refRBSheet}
              closeOnDragDown={true}
              dragFromTopOnly={true}
              draggable={true}
              height={responsiveHeight(100)}
              openDuration={500}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20
                },
                wrapper: {
                  backgroundColor: "transparent"
                },
                draggableIcon: {
                  backgroundColor: "lightgrey"
                }
              }}
            >
              <ChatBox sheetRef={refRBSheet} />
            </RBSheet>

            <BottomSheet index={1} snapPoints={snapPoints}>
              <ScrollView>
              <View  style={styles.containerBottom}>
              { startRide ? (
                    <View style={styles.waitingCont}>
                        <Text style={styles.waitingText}>
                        Waiting for user...
                        </Text>
                    </View>
                  ) : (
                    <View style={styles.timing}>
                      <View style={styles.timeInfo}>
                          <Text
                              style={{
                                  color: "black",
                                  fontFamily: "customb",
                                  fontSize: responsiveFontSize(3),
                                  alignSelf: "flex-start",
                              }}
                          >
                              Reaching {userName} in {duration}.
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
                                  <Text style={styles.ratingText}>{userRating}</Text>
                                  <Entypo name="star-outlined" size={responsiveFontSize(2)} color="black" />
                              </View>
                          </View>
                          {/* <Text style={styles.carNumber}>Car / KB-3</Text> */}
                      </View>
                  </View>
                  ) }

                  <View style={styles.hr} />

                  <View style={styles.locationContaner} >

                      <Text style={{
                          color: "grey",
                          fontFamily: "custom",
                          marginTop: responsiveHeight(1),
                      }}>Payment</Text>

                      <View style={styles.location}>
                          <Image style={styles.imgstyle}
                              resizeMode="contain"
                              source={require('../assets/money.png')} />
                          <Text style={styles.locationText}>2000 PKR</Text>
                      </View>

                      <Text style={{
                          color: "grey",
                          fontFamily: "custom",
                          marginTop: responsiveHeight(1),
                      }}>Route</Text>

                      <View style={styles.location}>
                          <Image style={styles.imgstyle}
                              resizeMode="contain"
                              source={require('../assets/a.png')} />
                          <Text style={styles.locationText}>{pickupLocation}</Text>
                      </View>
                  </View>

                  <View style={styles.btnContacts}>
                      <TouchableOpacity style={styles.contactBtn}>
                      <Ionicons name="call-outline" size={35} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactBtn} onPress={() => refRBSheet.current.open()}>
                      <Feather name="message-square" size={35} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactBtn}>
                      <MaterialIcons name="report-gmailerrorred" size={35} color="white" />
                      </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.navBtn} onPress={() => {openMaps();}}>
            <Image source={ Platform.OS === 'android' ? require("../assets/maps.png") : require("../assets/imaps.png") } 
            style={{width: 20, height: 20}} />
            <Text style={styles.navBtnText}>
            Use {Platform.OS === 'android' ? 'Google Maps' : 'Apple Maps'} Navigation
            </Text>

            </TouchableOpacity>
                            { startRide ? (
                              <TouchableOpacity style={styles.cancelBtn} onPress={() => startRideNav()}>
                                <Text style={styles.cancelBtnText}>Start Ride</Text>
                            </TouchableOpacity>
                            ) : null }
                       
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setReviewBox(true)}>
                                <Text style={styles.cancelBtnText}>Cancel Ride</Text>
                            </TouchableOpacity>
                        
              </View>
              </ScrollView>
          </BottomSheet>
        </SafeAreaView>
    );
}
    const styles = StyleSheet.create({
        container: {
        flex: 1,
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

  waitingCont: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveWidth(6),
  },

  waitingText: {
    fontSize: responsiveFontSize(2),
    fontFamily: "customb",
    color: "grey",
  },

  containerBottom: {
    flex: 1,
    backgroundColor: '#fff',
    padding: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
  },

  hr: {
    backgroundColor: "grey",
    height: responsiveHeight(0.12),
    width: responsiveWidth(90),
    alignSelf: "center",
    marginBottom: responsiveHeight(1),
  },

  timing: {
    flexDirection: "row",
    justifyContent:'space-between',
    alignSelf:'center',
    alignItems:'center',
    width: responsiveWidth(90),
  },

  timeInfo:{
    width: responsiveWidth(60),
  },

  btnContacts:{
    width: responsiveWidth(70),
    alignSelf:'center',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    flexDirection: "row",
    justifyContent:'space-around',
  },

  contactBtn: {
    backgroundColor: "#FF6969",
    borderRadius: 50,
    marginTop: responsiveHeight(1),
    padding: responsiveHeight(1),
  },

  cancelBtn: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: 'lightgrey',
    padding: responsiveWidth(3),
    width: responsiveWidth(90),
    borderRadius: 5,
    marginTop: responsiveHeight(2),
  },

  cancelBtnText: {
    width: '100%',
    color: 'black',
    fontFamily:'customb',
    fontSize: responsiveFontSize(2),
    textAlign:'center',
    alignSelf: "center",
  },

  rating: {
    flexDirection: "column",
    width: "100%",
  },

  ratingText: {
    fontSize: responsiveFontSize(2),
    fontFamily: "custom",
  },

  driverImg: {
    width: "auto",
    height: responsiveHeight(10),
  },

  ratingBox: {
    flexDirection: "row",
    gap: 5,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6969",
    paddingLeft: responsiveWidth(6),
    paddingRight: responsiveWidth(6),
    alignSelf: "center",
  },

  locationContaner:{
    width:'100%',
    alignSelf:'center',
    gap: responsiveHeight(0.5),
  },
  
  location:{
    flexDirection:'row',
    alignItems:'center',
  },

  locationText:{
    width:responsiveWidth(80),
    fontFamily:'custom',
    fontSize: responsiveFontSize(1.7),
  },

  imgstyle:{
    width:25,
    height:25,
    marginRight:responsiveWidth(2),
  },

  carNumber: {
    color: "grey",
    fontSize:responsiveFontSize(2),
    fontFamily:'custom',
    alignSelf: "flex-start",
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },

  modalView: {
    width: responsiveWidth(70),
    backgroundColor: 'white',
    borderRadius: 5,
    padding: responsiveWidth(5),
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalheading: {
    fontSize: responsiveFontSize(2.7),
    fontFamily: "customb",
  },

  modalText: {
    fontSize: responsiveFontSize(2),
    color: "gray",
    fontFamily: "custom",
  },

  modalInput:{
    marginTop:4,
    padding:5,
    height: responsiveHeight(5),
    width: "100%",
    backgroundColor: "#ECECEC",
    borderRadius: 5,
  },

  submitbtn: {
    backgroundColor: "lightgrey",
    height: responsiveHeight(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: "100%",
    marginTop: 10,
  },

  cancelbtn: {
    backgroundColor: "#FF6969",
    height: responsiveHeight(5),
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#FF6969",
    borderRadius: 5,
    width: "100%",
    marginTop: 10,
  },

  rating:{
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
  },

  textStyle: {
    fontFamily: "customb",
    fontSize: responsiveFontSize(2),
    color: "black",
  },

  textStyle1: {
    fontFamily: "customb",
    fontSize: responsiveFontSize(2),
    color: "white",
  },
});