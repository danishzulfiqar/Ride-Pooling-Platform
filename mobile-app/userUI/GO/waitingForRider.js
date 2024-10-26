import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Image, Modal, TextInput, BackHandler } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import firestore from  '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import functions from '@react-native-firebase/functions';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import MapStyle from '../../styles/mapStyle';
import BottomSheet from '@gorhom/bottom-sheet';
import { SetPickupLocation, SetPickupLocationCoords, SetDropoffLocation, 
  SetDropoffLocationCoords, SetRidePhaseKey, SetNavigationPhase } from '../../redux/action';
import ChatBox from '../../components/chatBox';
import Toast from 'react-native-toast-message';


export default function WaitingForRider({navigation}) {
  const mapRef = useRef(null);
  const refRBSheet = useRef(null);
  const [reviewBox, setReviewBox] = useState(false);
  const [duration, setDuration] = useState();
  const [distance, setDistance] = useState();
  const [riderLocationLat, setRiderLocationLat] = useState(null);
  const [riderLocationLng, setRiderLocationLng] = useState(null);
  const [l1, setL1] = useState(0);
  const [l2, setL2] = useState(0);
  const [route, setRoute] = useState(null);
  const [riderName, setRiderName] = useState(null);
  const [riderRating, setRiderRating] = useState(null);
  const [cancelComment, setCancelComment] = useState(null);
  const [startRide, setStartRide] = useState(false);
  const snapPoints = useMemo(() => [responsiveHeight(20), responsiveHeight(65)], []);

  const API_KEY = "YOUR_GOOGLE_API_KEY";
  const dispatch = useDispatch();

  const role = useSelector(state => state.appEssentials.role);
  const UID = useSelector(state => state.appEssentials.uid);
  const ridePhaseKey = useSelector(state => state.appEssentials.ridePhaseKey);
  const userLocationCoords = useSelector(state => state.location.userLocationCoords);
  const pickupAddress = useSelector(state => state.location.pickupLocation);
  const dropoffAddress = useSelector(state => state.location.dropoffLocation);
  const pickupCoords = useSelector(state => state.location.pickupLocationCoords);
  const dropoffCoords = useSelector(state => state.location.dropoffLocationCoords);

  useEffect(() => {
    const RiderRef = firestore().collection('Rides').doc('Bids').collection('GO').doc(ridePhaseKey);
  
    // Listen for changes to the RiderRef
    const unsubscribe = RiderRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const updatedRequest = snapshot.data(); // Retrieve the data of the specific document
        console.log("this is bidkey information " + JSON.stringify(updatedRequest));
        setRiderLocationLat(updatedRequest.riderData.location.geopoint.latitude);
        setRiderLocationLng(updatedRequest.riderData.location.geopoint.longitude);
        setL1(updatedRequest.userData.pickup);
        setL2(updatedRequest.userData.dropoff);
        setRiderName(updatedRequest.riderData.riderInfo.name);
        setRiderRating(updatedRequest.riderData.riderInfo.rating.toFixed(1));
        if(updatedRequest.userData.pickup_status === true){
          dispatch(SetNavigationPhase(true));
          navigation.replace('Go');
        }
        if(updatedRequest.cancel_status.status === true){
          setReviewBox(false);
          handleFirebaseRidePhaseNode();
          dispatch(SetPickupLocation('Enter Pickup Location'));
          dispatch(SetPickupLocationCoords(null));
          dispatch(SetDropoffLocation('Enter Dropoff Location'));
          dispatch(SetDropoffLocationCoords(null));
          dispatch(SetRidePhaseKey(null));
          navigation.replace('Go');
          Toast.show({
            type: "info",
            text1: "Ride Cancelled",
            text1Style: {
              fontSize: 18,
              fontFamily:'custom'
            },
            text2: `Rider Cancelled the Ride`,
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
  }, []);

  async function getRoute() {
    const loc1Lat = pickupCoords.lat;
    const loc1Lng = pickupCoords.lng;
    const ridersDistanceValLat = riderLocationLat;
    const ridersDistanceValLng = riderLocationLng;
try {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${loc1Lat},${loc1Lng}&destination=${ridersDistanceValLat},${ridersDistanceValLng}&key=${API_KEY}`
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

  const fetchDistanceData = async () => {
      try {
        const loc1Lat = pickupCoords.lat;
        const loc1Lng = pickupCoords.lng;
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

    const checkDistance = (distanceValue) => {
        if(distanceValue < 30){
          setStartRide(true);
          console.log("Rider is close");
        }
      }

  useEffect(() => {
    if (riderLocationLat && riderLocationLng) {
      fetchDistanceData();
      getRoute();
    }
  }, [riderLocationLat, riderLocationLng]);

  useEffect(() => {
    if (route && mapRef.current) {
      // Fit the map to the coordinates of the polyline
      mapRef.current.fitToCoordinates(route, {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated: true,
      });
    }
  }, [route]);

  const cancelRide = async () => {
    const data = {
      uid: UID,
      mode: 'GO',
      ridebidKey: ridePhaseKey,
      role: role,
      reason: cancelComment,
    };
  
    console.log("this is data for end ride " + JSON.stringify(data));
  
    const cancelGoRideBid = functions().httpsCallable('cancelGoRideBid');
    try {
      const result = await cancelGoRideBid(data);
      console.log("this is result " + JSON.stringify(result));
      setReviewBox(false);
      handleFirebaseRidePhaseNode();
      dispatch(SetPickupLocation('Enter Pickup Location'));
      dispatch(SetPickupLocationCoords(null));
      dispatch(SetDropoffLocation('Enter Dropoff Location'));
      dispatch(SetDropoffLocationCoords(null));
      dispatch(SetRidePhaseKey(null));
      navigation.replace('Go');
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

  const handleFirebaseRidePhaseNode = async () => {
    const ref = firestore().collection("users").doc(UID);

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

  useEffect(()=>{
    const handleBackButton = () => {

      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  },[])


  return (
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
      <View style={styles.mapsContainer}>
            <MapView
              style={styles.map}
              ref={mapRef}
              camera={{
                center: { latitude: 33.6844, longitude: 73.0479 },
                pitch: 0,
                heading: 0,
                altitude: 500,
                zoom: 10,
              }}
              loadingEnabled={true}
              customMapStyle={MapStyle}
            >
            {pickupCoords &&
                dropoffCoords && (
                  <Marker
                    coordinate={{
                      latitude: pickupCoords.lat,
                      longitude: pickupCoords.lng,
                    }}
                    title="PickUp Location"
                    description={pickupAddress}>
                          <Image
                              source={require("../../assets/man.png")}
                              resizeMode="contain"
                              style={{ width: 30, height: 30 }} />
                    </Marker>
                )}

                  {riderLocationLat && riderLocationLng &&
                      (<Marker
                          coordinate={{
                              latitude: riderLocationLat,
                              longitude: riderLocationLng,
                          }}
                          title="Rider"
                          description="On its way">
                          <Image
                              source={require("../../assets/motorcycle.png")}
                              resizeMode="contain"
                              style={{ width: 30, height: 30 }} />
                      </Marker>)}

                  {route && (
                      <Polyline coordinates={route} strokeWidth={4} strokeColor="#000" />
                  )}

                {/* {pickupCoords && dropoffCoords && (
                <MapViewDirections
                  origin={{ latitude: pickupCoords.lat, longitude: pickupCoords.lng }}
                  destination={{ latitude: dropoffCoords.lat, longitude: dropoffCoords.lng }}
                  apikey={API_KEY}
                  strokeWidth={3}
                  strokeColor="#000000"
                  precision="high"
                  onReady={(result) => {
                    const coordinates = result.coordinates;
                    mapRef.current.fitToCoordinates(coordinates, {
                      edgePadding: { top: 50, right: 50, bottom: 400, left: 50 },
                      animated: true,
                    });
                  }}
                      onError={(errorMessage) => {
                        console.log('MapViewDirections Error: ', errorMessage);
                        // Handle the error, e.g., show a message to the user
                      }}
                />
              )} */}
            </MapView>
          </View>

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
              {startRide ? (
                <View style={styles.waitingCont}>
                  <Text style={styles.waitingText}>
                    Rider is waiting...
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
                      {riderName} arriving in {duration}.
                    </Text>
                    <Text style={styles.carNumber}>Car / KB-3</Text>
                  </View>
                  <View >
                    <View style={styles.rating}>
                      <Image
                        style={styles.driverImg}
                        resizeMode="contain"
                        source={require("../../assets/user.png")}
                      />
                      <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>{riderRating}</Text>
                        <Entypo name="star-outlined" size={responsiveFontSize(2)} color="black" />
                      </View>
                    </View>
                    {/* <Text style={styles.carNumber}>Car / KB-3</Text> */}
                  </View>
                </View>
              )}


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
                              source={require('../../assets/money.png')} />
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
                              source={require('../../assets/a.png')} />
                          <Text style={styles.locationText}>{l1}</Text>
                      </View>
                      <View style={styles.location}>
                          <Image style={styles.imgstyle}
                              resizeMode="contain"
                              source={require('../../assets/b.png')} />
                          <Text style={styles.locationText}>{l2}</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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

  mapsContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
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

})