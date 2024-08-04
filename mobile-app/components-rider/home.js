import { React, useState, useMemo, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import Toast from "react-native-toast-message";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import newstyle from "../styles/mapstyle";
import UserRequestCard from "./userRequestCard";
import NavigationToUser from "./navigationToUser";
import Navigation from "../component-Chatbox/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AirbnbRating } from 'react-native-ratings';
import firestore from  '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import ngeohash from "ngeohash";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Home() {
  const route = useRoute();
  const { role } = route.params;
  const mapRef = useRef(null);
  const [navMode, setNavMode] = useState(false);
  const [slider, setslider] = useState(1);
  const [mode, setMode] = useState(null);
  const [riderName, setRiderName] = useState(null);
  const [rideBooked, setRideBooked] = useState(false);
  const [navigationPhase, setNavigationPhase] = useState(false);
  const [rideCancelled, setRideCancelled] = useState(false);
  const [ridePhaseKey, setRidePhaseKey] = useState(null);
  const [rideStatus, setRideStatus] = useState(false);
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewBox, setReviewBox] = useState(false);
  const [riderLocation, setRiderLocation] = useState();
  const [riderLatitude, setRiderLatitude] = useState();
  const [riderLongitude, setRiderLongitude] = useState();
  const snapPoints = useMemo(() => ["35%", "70%"], []);


  const ratingCompleted = (rating) => {
    setRating(rating);
  }

  const ratingFunc = async () => {
    const data = {
      uid: auth().currentUser.uid,
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
      setReviewBox(!reviewBox);
    } catch (error) {
      console.error("Error calling addReviewAndRating:", error);
    }
  };
  
  


  useEffect(() => {
    const uid = auth().currentUser.uid;
    const RiderRef = firestore().collection("riders").doc(uid);

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

  /////////////////// Set Rider Availability //////////////////////

  const setAvailability = async (available) => {
    const uid = auth().currentUser.uid;
    const availabilityRef = firestore().collection("riders").doc(uid);
    
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

  const updateRiderLocation = async () => {
    const uid = auth().currentUser.uid;
    const availabilityRef = firestore().collection("riders").doc(uid);
    const geohash = ngeohash.encode(riderLatitude, riderLongitude);
    console.log('this is riders HOME geohash update: ',geohash);
    
    const updateData = {
      location: {
        geohash:  geohash,
        geopoint: {
          latitude: riderLatitude,
          longitude: riderLongitude,
        }, // Use GeoPoint for latitude and longitude
      }
    };
  
    try {
      await availabilityRef.update(updateData);
      console.log("Rider location updated successfully!");
    } catch (error) {
      console.error("Error updating rider location: ", error);
    }
  };

  ////////////////////////// Get users location /////////////////////////
  const setUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setRiderLatitude(currentLocation.coords.latitude);
    setRiderLongitude(currentLocation.coords.longitude);
    console.log(riderLatitude, riderLongitude);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address from coordinates");
    }

    const data = await response.json();
    const formattedAddress = data.results[0].formatted_address;
    setRiderLocation(formattedAddress);
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

  return (
    <View style={{ flex: 1 }}>
      {navigationPhase === false ? (
        rideStatus === false ? (
          <View style={styles.container}>
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
                loadingEnabled={true}
                customMapStyle={newstyle}
                showsUserLocation={true}
                userLocationPriority="high"
                onMapReady={async () => {
                  await setUserLocation();
                }}
              ></MapView>
            </View>

            {slider === 0 ? (
              <BottomSheet index={0} snapPoints={snapPoints}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.mode}>{mode}</Text>
                  <TouchableOpacity
                    style={styles.btnStop}
                    onPress={function () {
                      setAvailability(false);
                      setslider(1);
                      setMode(null);
                    }}
                  >
                    <Text style={styles.btnText}>Stop</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView>
                  <Text
                    style={{
                      fontFamily: "Custom",
                      fontSize: 16,
                      alignSelf: "center",
                      margin: 20,
                    }}
                  >
                    searching for passengers...
                  </Text>
                  <UserRequestCard
                    mode={mode}
                    setRidePhaseKey={setRidePhaseKey}
                    setRideStatus={setRideStatus}
                  />
                </ScrollView>
              </BottomSheet>
            ) : (
              <View style={styles.viewContainer}>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={styles.optionBTn}
                    onPress={() => {
                      setMode("GO");
                    }}
                  >
                    <Text style={styles.optionText}>Go</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionBTn}
                    onPress={() => {
                      setMode("Pooling");
                    }}
                  >
                    <Text style={styles.optionText}>Pooling</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionBTn}
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
                      updateRiderLocation();
                      setAvailability(true);
                      setslider(0);
                    }
                  }}
                >
                  <Text style={styles.btnText}>START</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <NavigationToUser
            ridePhaseKey={ridePhaseKey}
            role={role}
            setNavigationPhase={setNavigationPhase}
            setRideStatus={setRideStatus}
          />
        )
      ) : (
        <Navigation
          ridePhaseKey={ridePhaseKey}
          role={role}
          setReviewBox={setReviewBox}
          setslider={setslider}
          setNavigationPhase={setNavigationPhase}
          setRideStatus={setRideStatus}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
    paddingTop: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  options: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 25,
    marginRight: 25,
  },

  optionBTn: {
    backgroundColor: "white",
    paddingLeft: 10,
    paddingRight: 10,
    height: 38,
    width: "30%",
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    fontFamily: "Custom",
    color: "black",
    fontSize: 16,
  },

  btnText: {
    fontFamily: "CustomB",
    color: "white",
    fontSize: 18,
  },

  btnStart: {
    backgroundColor: "#FF6969",
    width: "88%",
    height: 40,
    borderRadius: 10,
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

  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 25,
    marginRight: 25,
  },

  mode: {
    fontFamily: "Custom",
    fontSize: 20,
  },

  headText: {
    fontFamily: "CustomB",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 15,
    textAlign: "left",
  },

  text: {
    fontFamily: "Custom",
    fontSize: 14,
    marginRight: 15,
    textAlign: "left",
  },

  Carimage: {
    width: 150,
    height: 80,
  },

  carCard: {
    flexDirection: "row",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },

  modalView: {
    margin: 20,
    width: "70%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
    fontSize: 18,
    fontFamily: "CustomB",
  },

  modalText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "Custom",
  },

  modalInput:{
    padding:5,
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },

  submitbtn: {
    backgroundColor: "#ECECEC",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 5,
    width: "100%",
    marginTop: 10,
  },

  rating:{
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
  },

});
