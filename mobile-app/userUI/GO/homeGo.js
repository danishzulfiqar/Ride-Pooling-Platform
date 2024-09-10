import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Image, Platform, ScrollView, Modal, TextInput } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import RBSheet from 'react-native-raw-bottom-sheet';
import mapStyle from '../../styles/mapStyle';
import * as Location from "expo-location";
import { useDispatch, useSelector } from 'react-redux';
import firestore from  '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import Toast from 'react-native-toast-message';
import SearchForRider from './searchForRider';
import { AirbnbRating } from 'react-native-ratings';
import MapNavigation from '../../components/mapNavigation';
import { SetUserLocationCoords, SetPickupLocation, SetPickupLocationCoords, SetDropoffLocation, 
  SetDropoffLocationCoords, SetRidePhaseKey, SetNavigationPhase } from '../../redux/action';

export default function HomeGo({navigation}) {
  const mapRef = useRef(null);
  const mapRef2 = useRef(null);
  const mapRef3 = useRef(null);
  const refRBSheet1 = useRef();
  const refRBSheet2 = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [chooseFromMap, setChooseFromMap] = useState('');
  const [onChangeLocPickupAddress, setOnChangeLocPickupAddress] = useState(false);
  const [onChangeLocPickupCoords, setOnChangeLocPickupCoords] = useState(false);
  const [onChangeLocDropoffAddress, setOnChangeLocDropoffAddress] = useState(false);
  const [onChangeLocDropoffCoords, setOnChangeLocDropoffCoords] = useState(false);
  const [searchForRiders, setSearchForRiders] = useState(false);


  const dispatch = useDispatch();
  const navigationPhase = useSelector(state => state.appEssentials.navigationPhase);
  const UID = useSelector(state => state.appEssentials.uid);
  const role = useSelector(state => state.appEssentials.role);
  const ridePhaseKey = useSelector(state => state.appEssentials.ridePhaseKey);
  const userLocationCoords = useSelector(state => state.location.userLocationCoords);
  const pickupAddress = useSelector(state => state.location.pickupLocation);
  const dropoffAddress = useSelector(state => state.location.dropoffLocation);
  const pickupCoords = useSelector(state => state.location.pickupLocationCoords);
  const dropoffCoords = useSelector(state => state.location.dropoffLocationCoords);
  const [rideRole, setRideRole] = useState('');
  const [reviewBox, setReviewBox] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');


  const API_KEY = "YOUR_GOOGLE_API_KEY";

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
      setReviewBox(!reviewBox);
      setReviewBox(!reviewBox);
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
    console.log('currentLocation set');
    dispatch(SetUserLocationCoords(currentLocation.coords));
    if (mapRef.current && !hasAnimated) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        1000
      );
      setHasAnimated(true);
    } 
  };

  async function getCoordsPickup(locationString){
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationString
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      const { results } = data;
      const loc1Coords = results[0].geometry.location;
      dispatch(SetPickupLocation(locationString));
      dispatch(SetPickupLocationCoords(loc1Coords));

    } catch (error) {
      console.error("Error fetching pickup location coordinates:", error);
    }
  }

  async function getCoordsDropoff(locationString){
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationString
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      const { results } = data;
      const loc2Coords = results[0].geometry.location;
      dispatch(SetDropoffLocation(locationString));
      dispatch(SetDropoffLocationCoords(loc2Coords));

    } catch (error) {
      console.error("Error fetching pickup location coordinates:", error);
    }
  }

  function onChangeLoc1(region) {

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        if (results.length > 0) {
          const address = results[0].formatted_address;
          setOnChangeLocPickupAddress(address);
          setOnChangeLocPickupCoords({
            lat: region.latitude,
            lng: region.longitude
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching dropOff location coordinates:", error);
      });
  }

  function onChangeLoc2(region) {

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        if (results.length > 0) {
          const address = results[0].formatted_address;
          setOnChangeLocDropoffAddress(address);
          setOnChangeLocDropoffCoords({
            lat: region.latitude,
            lng: region.longitude
          });
          dispatch(SetDropoffLocation(address));
          dispatch(SetDropoffLocationCoords({
            lat: region.latitude,
            lng: region.longitude
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching dropOff location coordinates:", error);
      });
  }

  const setAvailability = async (available) => {
    const availabilityRef = firestore().collection('users').doc(UID);
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

  return (
    <>
      { searchForRiders ? (
        <SearchForRider navigation={navigation}  setSearchForRiders={setSearchForRiders} />
      ) : (
        <SafeAreaView style={styles.container}>
    { chooseFromMap === 'pickup' ? (
      <View style={{flex: 1}}>
          <View style={styles.mapsContainer}>
            <MapView
              style={styles.map}
              ref={mapRef2}
              initialCamera={{
                center: { latitude: 33.6844, longitude: 73.0479 },
                pitch: 0,
                heading: 0,
                altitude: 1000,
                zoom: 16,
              }}
              onRegionChangeComplete={onChangeLoc1}
              showsUserLocation={true}
              userLocationPriority="high"
              customMapStyle={mapStyle}
              onLayout={() => {
                if (mapRef2.current) {
                  mapRef2.current.animateToRegion(
                    {
                      latitude: userLocationCoords.latitude,
                      longitude: userLocationCoords.longitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    },
                    1000
                  );
                }
              }}
            ></MapView>

            <View style={styles.showsUserLocation}>
            <Text>{onChangeLocPickupAddress}</Text>
            </View>

            <View style={styles.markerContainer}>
              <Image
                style={styles.markerImage}
                source={require("../../assets/placeholder.png")}
              />
            </View>
          </View>
          <View style={styles.BottomContainer2}>
          <TouchableOpacity style={styles.chooseFromMapbtn} onPress={()=>{setChooseFromMap('');}}>
              <Text style={styles.btnText2}>Enter Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chooseFromMapbtn1} 
          onPress={()=>{
            dispatch(SetPickupLocation(onChangeLocPickupAddress));
            dispatch(SetPickupLocationCoords({
              lat: onChangeLocPickupCoords.lat,
              lng: onChangeLocPickupCoords.lng
            }));
            setChooseFromMap('');
            }}>
              <Text style={styles.btnText}>Done</Text>
          </TouchableOpacity>
          </View>
        </View>
    ) : chooseFromMap === 'dropoff' ? (
      <View style={{flex: 1}}>
          <View style={styles.mapsContainer}>
            <MapView
              style={styles.map}
              ref={mapRef3}
              initialCamera={{
                center: { latitude: 33.6844, longitude: 73.0479 },
                pitch: 0,
                heading: 0,
                altitude: 1000,
                zoom: 16,
              }}
              onRegionChangeComplete={onChangeLoc2}
              showsUserLocation={true}
              userLocationPriority="high"
              customMapStyle={mapStyle}
              onLayout={() => {
                if (mapRef3.current) {
                  mapRef3.current.animateToRegion(
                    {
                      latitude: userLocationCoords.latitude,
                      longitude: userLocationCoords.longitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    },
                    1000
                  );
                }
              }}
            ></MapView>

            <View style={styles.showsUserLocation}>
            <Text>{onChangeLocDropoffAddress}</Text>
            </View>

            <View style={styles.markerContainer}>
              <Image
                style={styles.markerImage}
                source={require("../../assets/placeholder.png")}
              />
            </View>
          </View>
          <View style={styles.BottomContainer2}>
          <TouchableOpacity style={styles.chooseFromMapbtn} onPress={()=>{setChooseFromMap('');}}>
              <Text style={styles.btnText2}>Enter Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chooseFromMapbtn1} 
          onPress={()=>{
            dispatch(SetDropoffLocation(onChangeLocDropoffAddress));
            dispatch(SetDropoffLocationCoords({
              lat: onChangeLocDropoffCoords.lat,
              lng: onChangeLocDropoffCoords.lng
            }));
            setChooseFromMap('');
            }}>
              <Text style={styles.btnText}>Done</Text>
          </TouchableOpacity>
          </View>
        </View>
      ) : (
      <>
      { navigationPhase === true ? (
        <MapNavigation navigation={navigation}  setReviewBoxHome={setReviewBox}/> 
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
                  <Text style={styles.modalText}>Rate Rider</Text>
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
                    onPress={() => {ratingFunc(); setUserLocation();}}
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
              customMapStyle={mapStyle}
              showsUserLocation={true}
              userLocationPriority="high"
              onLayout={async () => {
                console.log('map ready');
                await setUserLocation();
              }}
            >
            {pickupCoords &&
                dropoffCoords && (
                  <Marker
                    coordinate={{
                      latitude: pickupCoords.lat,
                      longitude: pickupCoords.lng,
                    }}
                    title="PickUp Location"
                    description={pickupAddress}
                  />
                )}

              {pickupCoords &&
                dropoffCoords && (
                  <Marker
                    coordinate={{
                      latitude: dropoffCoords.lat,
                      longitude: dropoffCoords.lng,
                    }}
                    title="DropOff Location"
                    description={dropoffAddress}
                  />
                )}

                {pickupCoords && dropoffCoords && (
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
              )}
            </MapView>
          </View>

      <RBSheet ref={refRBSheet2}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        draggable={true}
        height={responsiveHeight(80)}
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
        <View style={styles.googleContainer}>
        <GooglePlacesAutocomplete
                styles={{
                  container: { flex: 0 },
                  textInputContainer: {
                    backgroundColor: "white",
                    height: 40,
                    borderRadius: 5,
                    alignItems: "center",
                    elevation: 5,
                  },
                  textInput: {
                    backgroundColor: "transparent",
                    color: "black",
                    fontSize: responsiveFontSize(2),
                    fontFamily: "custom",
                  },
                  predefinedPlacesDescription: { color: "black" },
                }}
                placeholder="Enter drop-off point"
                onPress={async (data, details = null) => {
                  const location = data.description;
                  console.log('location', location);
                  getCoordsDropoff(location);
                }}
                query={{ key: API_KEY, language: "en" }}
              />
          <TouchableOpacity style={styles.buttonBottomContainerFind1} onPress={()=>{setChooseFromMap('dropoff')}}>
              <Text style={styles.btnText2}>Choose From Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonBottomContainerFind} onPress={() => refRBSheet2.current.close()}>
              <Text style={styles.btnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>

      <RBSheet ref={refRBSheet1}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        draggable={true}
        height={responsiveHeight(80)}
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
        <View style={styles.googleContainer}>
        <GooglePlacesAutocomplete
                styles={{
                  container: { flex: 0 },
                  textInputContainer: {
                    backgroundColor: "white",
                    height: 40,
                    borderRadius: 5,
                    alignItems: "center",
                    elevation: 5,
                  },
                  textInput: {
                    backgroundColor: "transparent",
                    color: "black",
                    fontSize: responsiveFontSize(2),
                    fontFamily: "custom",
                  },
                  predefinedPlacesDescription: { color: "black" },
                }}
                placeholder="Enter pick-up point"
                onPress={async (data, details = null) => {
                  const location = data.description;
                  getCoordsPickup(location);
                  console.log('location', location);
                }}
                query={{ key: API_KEY, language: "en" }}
              />
          <TouchableOpacity style={styles.buttonBottomContainerFind1} onPress={()=>{setChooseFromMap('pickup')}}>
              <Text style={styles.btnText2}>Choose From Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonBottomContainerFind} onPress={() => refRBSheet1.current.close()}>
              <Text style={styles.btnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>

          <View style={styles.BottomContainer}>
            <ScrollView horizontal={true} contentContainerStyle={styles.iconContainer}>
            <TouchableOpacity style={rideRole === 'bike' ? styles.iconButton1 : styles.iconButton} onPress={()=>{setRideRole('bike')}}><Image 
                    style={styles.icon}
                    resizeMode="contain"
                    source={require("../../assets/motor-sports.png")} />  
              </TouchableOpacity>
              <TouchableOpacity style={rideRole === 'car' ? styles.iconButton1 : styles.iconButton} onPress={()=>{setRideRole('car')}}><Image 
                    style={styles.icon}
                    resizeMode="contain"
                    source={require("../../assets/standard.png")} />  
              </TouchableOpacity>
              <TouchableOpacity style={ rideRole === 'carAc' ? styles.iconButton1 : styles.iconButton } onPress={()=>{setRideRole('carAc')}}><Image 
                    style={styles.icon}
                    resizeMode="contain"
                    source={require("../../assets/air-conditioner.png")} />  
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.bottomContainerGroup}>
              <TouchableOpacity style={styles.buttonBottomContainer} onPress={() => {refRBSheet1.current.open(); setUserLocation();}}>
                  <Text style={styles.btnText1}>{pickupAddress}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonBottomContainer} onPress={() => {refRBSheet2.current.open(); setUserLocation();}}>
                  <Text style={styles.btnText1}>{dropoffAddress}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonBottomContainerFind} onPress={()=>{
                if(pickupAddress === "Enter Pickup Location" || dropoffAddress === "Enter Dropoff Location"){
                      Toast.show({
                        type: 'error',
                        text1: 'No locaton',
                        text2: 'Please enter Pick-up and Drop-off locations.',
                        text1Style: {
                          fontSize: 18
                          },
                          });
                          } else {
                            setAvailability(true);
                            setSearchForRiders(true);
                            }
                            }}>
                  <Text style={styles.btnText}>Find Rider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) }
      </>
    ) }
          
    </SafeAreaView>
      ) }
    </>
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

  showsUserLocation: {
    position: "absolute",
    top: responsiveHeight(10),
    width: responsiveWidth(80),
    backgroundColor: "white",
    borderRadius: 5,  
    padding: responsiveWidth(2),
    elevation: 5,
  },

  markerContainer: {
    position: "absolute",
    top: "44%",
    left: "50%",
    marginLeft: -25, // Half of the image width
    marginTop: 0, // Half of the image height
  },

  markerImage: {
    width: 40,
    height: 40,
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

  BottomContainer2 :{
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: responsiveWidth(100),
    padding: responsiveWidth(5),
    gap: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomContainerGroup :{
    alignSelf:'flex-start',
    paddingVertical: responsiveHeight(1),
    gap: responsiveHeight(2),
    width:'100%'
  },

  buttonBottomContainer :{
    backgroundColor: 'white',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.5),
    width: '100%',
    borderRadius: 5,
    elevation: 2,
  },

  buttonBottomContainerFind :{
    justifyContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'android' ? responsiveHeight(5) : responsiveHeight(6),
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#FF6969',
  },

  buttonBottomContainerFind1 :{
    justifyContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'android' ? responsiveHeight(5) : responsiveHeight(6),
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },

  btnText2: {
    fontFamily: 'customb',
    fontSize: responsiveFontSize(2),
    color: 'black',
  },

  btnText: {
    fontFamily: 'customb',
    fontSize: responsiveFontSize(2),
    color: 'white',
  },

  btnText1: {
    fontFamily: 'custom',
    fontSize: responsiveFontSize(2),
    color: 'black',
  },

  iconContainer :{
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
  },

  icon :{
    width: responsiveHeight(7),
    height: responsiveHeight(7),
  },

  iconButton :{
    backgroundColor: 'white',
    paddingHorizontal: responsiveWidth(5),
    borderBottomWidth: 3,
    borderColor: '#FF6969',
    borderRadius: 5,
    elevation: 5,
  },

  iconButton1 :{
    backgroundColor: '#FF6969',
    paddingHorizontal: responsiveWidth(5),
    borderBottomWidth: 3,
    borderColor: '#FF6969',
    borderRadius: 5,
    elevation: 10,
  },

  

  googleContainer :{
    padding: responsiveWidth(5),
    width: '100%',
    backgroundColor: 'white',
    gap: responsiveHeight(2),
  },

  chooseFromMapbtn :{
    justifyContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'android' ? responsiveHeight(5) : responsiveHeight(6),
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },

  chooseFromMapbtn1 :{
    justifyContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'android' ? responsiveHeight(5) : responsiveHeight(6),
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#FF6969',
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