import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Modal, TextInput} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useSelector, useDispatch } from 'react-redux';
import MapView from "react-native-maps";
import mapStyle from '../styles/mapStyle';
import * as Location from "expo-location";
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import firestore from  '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { AirbnbRating } from 'react-native-ratings';
import UserRequest from './userRequest';
import MapNavigation from '../components/mapNavigation';
import { SetPickupLocation, SetPickupLocationCoords, SetDropoffLocation, 
  SetDropoffLocationCoords, SetRidePhaseKey, SetNavigationPhase } from '../redux/action';

export default function HomeComponent({navigation}) {
    const mapRef = useRef(null);
    const [mode, setMode] = useState(null);
    const [riderName, setRiderName] = useState(null);
    const [rideBooked, setRideBooked] = useState(false);
    const [rideCancelled, setRideCancelled] = useState(false);
    const [checkUserReq, setCheckUserReq] = useState(false);
    const [reviewBox, setReviewBox] = useState(false);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState(null);


    const dispatch = useDispatch();
    const API_KEY = "YOUR_GOOGLE_API_KEY";
    const UID = useSelector(state => state.appEssentials.uid);
    const role = useSelector(state => state.appEssentials.role);
    const ridePhaseKey = useSelector(state => state.appEssentials.ridePhaseKey);
    const navigationPhase = useSelector(state => state.appEssentials.navigationPhase);
    

    useEffect(() => {
        const RiderRef = firestore().collection("riders").doc(UID);
    
        const unsubscribe = RiderRef.onSnapshot(snapshot => {
          if (snapshot.exists) {
            let updatedRiderData = snapshot.data();
            console.log(updatedRiderData);
            setRideBooked(updatedRiderData.crest.activities.rides_booked);
            setRideCancelled(updatedRiderData.crest.activities.rides_cancelled);
            setRiderName(
              updatedRiderData.crest.UserData.first_name + ' ' +
              updatedRiderData.crest.UserData.last_name
            );
          } else {
            console.log("No such document!");
          }
        });
    
        return () => {
          // Unsubscribe from the snapshot listener when component unmounts
          unsubscribe();
        };
      }, []);

    useEffect(() => {
        console.log('location set')
        setUserLocation();
      }, []);

    const setUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
    
        let currentLocation = await Location.getCurrentPositionAsync({});
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&key=${API_KEY}`
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch address from coordinates");
        }
    
        const data = await response.json();
        const formattedAddress = data.results[0].formatted_address;
        console.log(formattedAddress);
    
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            },
            1000
          );
        } else {
        }
      };

      const setAvailability = async (available) => {
        const availabilityRef = firestore().collection("riders").doc(UID);
        
        const updateData = {
          availability: available,
        };
      
        try {
          await availabilityRef.update(updateData);
          console.log("Availability updated successfully!");
        } catch (error) {
          console.error("Error updating availability: ", error);
        }
      };

      const ratingCompleted = (rating) => {
        setRating(rating);
      }
    
      const ratingFunc = async () => {
        const data = {
          uid: UID,
          ridebidKey: ridePhaseKey,
          role: role,
          mode: 'GO',
          rating: rating,
          review: review,
        };
      
        console.log("this is data for end ride " + JSON.stringify(data));
      
        const addReviewAndRating = functions().httpsCallable('addReviewAndRating');
      
        try {
          const result = await addReviewAndRating(data);
          console.log("this is result " + JSON.stringify(result.data));
          setReviewBox(false);
          dispatch(SetNavigationPhase(false));
          dispatch(SetPickupLocation('Enter Pickup Location'));
          dispatch(SetPickupLocationCoords(null));
          dispatch(SetDropoffLocation('Enter Dropoff Location'));
          dispatch(SetDropoffLocationCoords(null));
          dispatch(SetRidePhaseKey(null));
        } catch (error) {
          console.error("Error calling addReviewAndRating:", error);
        }
      };

  return (
    <SafeAreaView style={styles.container}>
     { navigationPhase === true ? (
      <MapNavigation navigation={navigation} setReviewBoxHome={setReviewBox} />
     ) : (
      <>
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
                  <Text style={styles.modalheading}>How was your journey?</Text>
                  <Text style={styles.modalText}>Rate User</Text>
                  <View style={styles.rating}>
                  <AirbnbRating
                    count={5}
                    defaultRating={rating}
                    selectedColor="#FF6969"
                    size={40}
                    showRating={false}  
                    onFinishRating={ratingCompleted}
                  />
                  </View>
                  <TextInput style={styles.modalInput} placeholder="Comment" onChangeText={(text) => setReview(text)} />
                  <TouchableOpacity
                    style={styles.submitbtn}
                    onPress={() => {ratingFunc();}}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
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
              userLocationPriority='high'
              showsUserLocation={true}
              loadingEnabled={true}
              customMapStyle={mapStyle}
              onMapReady={async () => {
                  await setUserLocation();
                }}
            >
            </MapView>
            </View>

            { checkUserReq === true ? (
                <UserRequest navigation={navigation} setCheckUserReq={setCheckUserReq} mode={mode}/>
            ) : (
                <View style={styles.viewContainer}>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={ mode === "GO" ? styles.optionBTnClicked : styles.optionBTn}
                    onPress={() => {
                      setMode("GO");
                    }}
                  >
                    <Text style={styles.optionText}>Go</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={ mode === "Pooling" ? styles.optionBTnClicked : styles.optionBTn}
                    onPress={() => {
                      setMode("Pooling");
                    }}
                  >
                    <Text style={styles.optionText}>Pooling</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={ mode === "Sharing" ? styles.optionBTnClicked : styles.optionBTn}
                    onPress={() => {
                      setMode("Sharing");
                    }}
                  >
                    <Text style={styles.optionText}>Sharing</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.carCard}>
                  <Image
                    style={styles.Carimage}
                    source={require("../assets/car2.png")}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.headText}>{riderName}</Text>
                    <Text style={styles.text}>Rides booked:{rideBooked}</Text>
                    <Text style={styles.text}>
                      Rides cancelled:{rideCancelled}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.btnStart}
                  onPress={function () {
                    if (mode === null) {
                      Toast.show({
                        type: "error",
                        text1: "Please Select a mode",
                        text1Style: {
                          fontSize: 18,
                        },
                      });
                    } else {
                      setAvailability(true);
                      setCheckUserReq(true);
                    }
                  }}
                >
                  <Text style={styles.btnText}>START</Text>
                </TouchableOpacity>
              </View>
            ) }
      </>
     ) }
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
  },

  viewContainer: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingTop: responsiveHeight(3),
    paddingBottom: responsiveHeight(3),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  options: {
    alignSelf: "center",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionBTn: {
    backgroundColor: "white",
    height: responsiveHeight(5),
    width: responsiveWidth(25),
    marginBottom: responsiveHeight(2),
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  optionBTnClicked: {
    backgroundColor: "#FF6969",
    height: responsiveHeight(5),
    width: responsiveWidth(25),
    marginBottom: responsiveHeight(2),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },

  optionText: {
    fontFamily: "custom",
    color: "black",
    fontSize: responsiveFontSize(2.2),
  },

  btnText: {
    fontFamily: "customb",
    color: "white",
    fontSize: responsiveFontSize(2.4),
  },

  btnStart: {
    backgroundColor: "#FF6969",
    width: "90%",
    height: responsiveHeight(5),
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  btnStop: {
    backgroundColor: "#FF6969",
    width: "20%",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },



  headText: {
    fontFamily: "CustomB",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 15,
    textAlign: "left",
  },

  text: {
    fontFamily: "custom",
    fontSize: responsiveFontSize(1.8),
    marginRight: 15,
    textAlign: "left",
  },

  Carimage: {
    width: 150,
    height: responsiveHeight(12),
  },

  carCard: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginBottom: responsiveHeight(2),
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
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