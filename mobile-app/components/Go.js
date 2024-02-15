import { React, useState, useMemo, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import Slider from "./BottomSheetCards";
import newstyle from "../styles/mapstyle";

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Go() {
  const mapRef = useRef(null);
  const mapRef2 = useRef(null);
  const mapRef3 = useRef(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [Change, setChange] = useState(0);
  const [loc1lat, setloc1lat] = useState();
  const [loc1lng, setloc1lng] = useState();
  const [loc2lat, setloc2lat] = useState();
  const [loc2lng, setloc2lng] = useState();
  const [locSlider, setLocSlider] = useState(0);
  const [showSlider, setShowSlider] = useState(0);
  const [enterPickUp, setEnterPickUp] = useState(false);
  const [enterDropOff, setEnterDropOff] = useState(false);
  const [loc1Coordinates, setLoc1Coordinates] = useState();
  const [loc2Coordinates, setLoc2Coordinates] = useState();
  const [A, setA] = useState("ENTER PICKUP LOCATION");
  const [B, setB] = useState("ENTER DROPOFF LOCATION");
  const snapPoints1 = useMemo(() => ["20%", "100%"], []);
  const [loading, setLoading] = useState(false);

  function showingSlider() {
    setShowSlider(1);
  }

  ///////////////////////////////  Animate to location ///////////////////////
  // useEffect(() => {
  //   fitToCoordinates();
  // }, [loc1Coordinates, loc2Coordinates]);

  // const fitToCoordinates = () => {
  //   if (loc1Coordinates && loc2Coordinates) {
  //     const coordinates = [loc1Coordinates, loc2Coordinates];

  //     mapRef.current.fitToCoordinates(coordinates, {
  //       edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //       animated: true,
  //     });
  //   }
  // };

  ////////////////////////// Get users location /////////////////////////

  // useEffect(() => {
  //   const fetchAddressFromCoordinates = async () => {
  //     try {
  //       // Get the current location
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         throw new Error("Permission to access location was denied");
  //       }

  //       const currentLocation = await Location.getCurrentPositionAsync({});
  //       setLocation(currentLocation);
  //       // Perform reverse geocoding
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&key=${API_KEY}`
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch address from coordinates");
  //       }

  //       const data = await response.json();
  //       const formattedAddress = data.results[0].formatted_address;

  //       // Update the address state variable
  //       // setA(formattedAddress);
  //     } catch (error) {
  //       console.error("Error fetching address:", error);
  //     }
  //   };

  //   fetchAddressFromCoordinates();
  // }, []);

  ////////////////////////// Get users location /////////////////////////
  const setUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    // Animate to the user's current location once it is obtained
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
      setLoading(false);
    } else {
      // In case mapRef.current is not available, ensure loading is also set to false
      setLoading(false);
    }
  };

  const [region, setRegion] = useState({
    latitude: latitude || 0,
    longitude: longitude || 0,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  ////////////////////////// Getting address from pickup coordinates  /////////////////////////

  function onChangeLoc1(region) {
    setRegion(region);

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        if (results.length > 0) {
          const address = results[0].formatted_address;
          setA(address);
          setLoc1Coordinates({ lat: region.latitude, lng: region.longitude });
          setloc1lat(region.latitude);
          setloc1lng(region.longitude);
        }
      })
      .catch((error) => {
        console.error("Error fetching pickup location coordinates:", error);
      });
  }

  ////////////////////////// Getting address from dropOff coordinates  /////////////////////////

  function onChangeLoc2(region) {
    setRegion(region);

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        if (results.length > 0) {
          const address = results[0].formatted_address;
          setB(address);
          setLoc2Coordinates({ lat: region.latitude, lng: region.longitude });
          setloc2lat(region.latitude);
          setloc2lng(region.longitude);
        }
      })
      .catch((error) => {
        console.error("Error fetching dropOff location coordinates:", error);
      });
  }

  ////////////////////////// Animate map(move) to pickup /////////////////////////

  async function movetoloc(locationString) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationString
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      const { results } = data;
      const loc1Coords = results[0].geometry.location;
      setloc1lat(loc1Coords.lat);
      setloc1lng(loc1Coords.lng);
      setLoc1Coordinates(loc1Coords);
      // if (results.length > 0) {
      //   const { lat, lng } = results[0].geometry.location;
      //   mapRef.current.animateToRegion(
      //     {
      //       latitude: lat,
      //       longitude: lng,
      //       latitudeDelta: 0.015,
      //       longitudeDelta: 0.0121,
      //     },
      //     1000
      //   );
      // } else {
      //   console.error("No results found for the given location.");
      // }
    } catch (error) {
      console.error("Error fetching pickup location coordinates:", error);
    }
  }

  function animatePickUp() {
    if (mapRef2.current) {
      mapRef2.current.animateToRegion(
        {
          latitude: loc1lat,
          longitude: loc1lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        1000
      );
    } else {
      console.error("mapRef2 is not assigned or null.");
    }
  }

  ////////////////////////// Animate map(move) to dropOff /////////////////////////

  async function movetoloc1(locationString) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationString
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      const { results } = data;
      const loc2Coords = results[0].geometry.location;
      setloc2lat(loc2Coords.lat);
      setloc2lng(loc2Coords.lng);
      setLoc2Coordinates(loc2Coords);
      // if (results.length > 0) {
      //   const { lat, lng } = results[0].geometry.location;
      //   mapRef.current.animateToRegion(
      //     {
      //       latitude: lat,
      //       longitude: lng,
      //       latitudeDelta: 0.015,
      //       longitudeDelta: 0.0121,
      //     },
      //     1000
      //   );
      // } else {
      //   console.error("No results found for the given location.");
      // }
    } catch (error) {
      console.error("Error fetching dropOff location coordinates:", error);
    }
  }

  function animateDropOff() {
    if (mapRef3.current) {
      mapRef3.current.animateToRegion(
        {
          latitude: loc2lat,
          longitude: loc2lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        800
      );
    } else {
      console.error("mapRef2 is not assigned or null.");
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////

  return (
    <View style={{ flex: 1 }}>
      {locSlider === 0 ? (
        <View style={styles.container}>
          <View style={styles.mapsContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
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
            >
              {/* {latitude && longitude && (
    <Marker
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      title="Location 1"
      description="Your location"
    />
  )} */}

              {loc1Coordinates &&
                loc1Coordinates.lat &&
                loc1Coordinates.lng && (
                  <Marker
                    coordinate={{
                      latitude: loc1Coordinates.lat,
                      longitude: loc1Coordinates.lng,
                    }}
                    title="Location 2"
                    description="Your drop-off location"
                  />
                )}

              {loc2Coordinates &&
                loc2Coordinates.lat &&
                loc2Coordinates.lng && (
                  <Marker
                    coordinate={{
                      latitude: loc2Coordinates.lat,
                      longitude: loc2Coordinates.lng,
                    }}
                    title="Location 2"
                    description="Your drop-off location"
                  />
                )}

              {loc1lat && loc1lng && loc2lat && loc2lng && (
                <MapViewDirections
                  origin={{ latitude: loc1lat, longitude: loc1lng }}
                  destination={{ latitude: loc2lat, longitude: loc2lng }}
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

          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {showSlider === 1 ? (
              <Slider l1={A} l2={B} set={setShowSlider} />
            ) : (
              <View style={styles.topCon}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.btn3,
                      Change === 1 ? styles.buttonPressed : null,
                    ]}
                    onPress={() => {
                      setChange(1);
                    }}
                  >
                    <Image
                      style={styles.imgstyle}
                      resizeMode="contain"
                      source={require("../assets/motor-sports.png")}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.btn3,
                      Change === 2 ? styles.buttonPressed : null,
                    ]}
                    onPress={() => {
                      setChange(2);
                    }}
                  >
                    <Image
                      style={styles.imgstyle}
                      resizeMode="contain"
                      source={require("../assets/standard.png")}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.btn3,
                      Change === 3 ? styles.buttonPressed : null,
                    ]}
                    onPress={() => {
                      setChange(3);
                    }}
                  >
                    <Image
                      style={styles.imgstyle}
                      resizeMode="contain"
                      source={require("../assets/air-conditioner.png")}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputcontainer}>
                  <Text style={styles.h1}>GO</Text>

                  <View style={styles.location}>
                    <View style={styles.pickupT}>
                      <TouchableOpacity
                        onPress={() => {
                          setEnterPickUp(true);
                        }}
                      >
                        <Text style={{ marginLeft: 10, fontFamily: "Custom" }}>
                          {A}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dropoffT}>
                      <TouchableOpacity
                        onPress={() => {
                          setEnterDropOff(true);
                        }}
                      >
                        <Text style={{ marginLeft: 10, fontFamily: "Custom" }}>
                          {B}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* <TouchableOpacity
                      style={styles.btn}
                      onPress={() => setShowSlider(1)}
                    >
                      <Text style={{ alignSelf: "center",fontFamily:'CustomB',color:'black',fontSize:16 }}>
                        Choose from Map
                      </Text>
                    </TouchableOpacity> */}
                  <TouchableOpacity style={styles.btn2} onPress={showingSlider}>
                    <Text
                      style={{
                        alignSelf: "center",
                        fontFamily: "CustomB",
                        color: "white",
                        fontSize: 16,
                      }}
                    >
                      Find Rider
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableWithoutFeedback>
          {/*****************************   pickUp *******************************/}
          {enterPickUp === true && (
            <BottomSheet
              index={1}
              snapPoints={snapPoints1}
              style={styles.bottomSheetStyle}
            >
              <GooglePlacesAutocomplete
                styles={{
                  container: { flex: 0 },
                  textInputContainer: {
                    backgroundColor: "#ECECEC",
                    marginLeft: 10,
                    marginRight: 10,
                    height: 40,
                    borderRadius: 5,
                    alignItems: "center",
                    marginTop: 10,
                  },
                  textInput: {
                    backgroundColor: "transparent",
                    color: "black",
                    fontSize: 16,
                    fontFamily: "Custom",
                  },
                  predefinedPlacesDescription: { color: "orange" },
                }}
                placeholder="Enter pick-up point"
                onPress={async (data, details = null) => {
                  // 'details' is provided when fetchDetails = true

                  await movetoloc(data.description);
                  const location1 = data.description;
                  setA(location1);
                }}
                query={{ key: API_KEY, language: "en" }}
              />

              <TouchableOpacity
                style={styles.btn4}
                onPress={function () {
                  setLocSlider(1);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontFamily: "CustomB",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  Choose from Map
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn5}
                onPress={() => {
                  setEnterPickUp(false);
                }}
              >
                <Text
                  style={{
                    fontFamily: "CustomB",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  OKAY
                </Text>
              </TouchableOpacity>
            </BottomSheet>
          )}

          {/*****************************   dropOff *******************************/}
          {enterDropOff === true && (
            <BottomSheet
              index={1}
              snapPoints={snapPoints1}
              style={styles.bottomSheetStyle}
            >
              <GooglePlacesAutocomplete
                styles={{
                  container: { flex: 0 },
                  textInputContainer: {
                    backgroundColor: "#ECECEC",
                    marginLeft: 10,
                    marginRight: 10,
                    height: 40,
                    borderRadius: 5,
                    alignItems: "center",
                    marginTop: 10,
                  },
                  textInput: {
                    backgroundColor: "transparent",
                    color: "black",
                    fontSize: 16,
                    fontFamily: "Custom",
                  },
                  predefinedPlacesDescription: { color: "orange" },
                }}
                placeholder="Enter your destination"
                onPress={async (data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  const location2 = data.description;

                  await movetoloc1(data.description);
                  setB(location2);
                }}
                query={{ key: API_KEY, language: "en" }}
              />
              <TouchableOpacity
                style={styles.btn4}
                onPress={function () {
                  setLocSlider(2);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontFamily: "CustomB",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  Choose from Map
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn5}
                onPress={() => {
                  setEnterDropOff(false);
                }}
              >
                <Text
                  style={{
                    fontFamily: "CustomB",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  OKAY
                </Text>
              </TouchableOpacity>
            </BottomSheet>
          )}
          {/*******************************************************************************/}
        </View>
      ) : locSlider === 1 ? (
        <View style={styles.container}>
          <View style={styles.mapsContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map1}
              ref={mapRef2}
              initialCamera={{
                center: { latitude: 33.6844, longitude: 73.0479 },
                pitch: 0,
                heading: 0,
                altitude: 1000,
                zoom: 16,
              }}
              onLayout={() => {
                // Call animatePickUp when MapView is rendered
                animatePickUp();
              }}
              onRegionChangeComplete={onChangeLoc1}
              customMapStyle={newstyle}
            ></MapView>

            <View style={styles.markerContainer}>
              <Image
                style={styles.markerImage}
                source={require("../assets/placeholder.png")}
              />
            </View>
          </View>
          <TouchableOpacity
                style={styles.btn41}
                onPress={function () {
                  setLocSlider(0);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontFamily: "CustomB",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  Enter Location
                </Text>
              </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn51}
            onPress={() => {
              setLocSlider(0);
              setEnterPickUp(false);
            }}
          >
            <Text
              style={{
                fontFamily: "CustomB",
                fontSize: 16,
                color: "white",
              }}
            >
              OKAY
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.mapsContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map1}
              ref={mapRef3}
              initialCamera={{
                center: { latitude: 33.6844, longitude: 73.0479 },
                pitch: 0,
                heading: 0,
                altitude: 1000,
                zoom: 16,
              }}
              onLayout={() => {
                // Call animatePickUp when MapView is rendered
                animateDropOff();
              }}
              onRegionChangeComplete={onChangeLoc2}
              customMapStyle={newstyle}
            ></MapView>
            <View style={styles.markerContainer}>
              <Image
                style={styles.markerImage}
                source={require("../assets/placeholder.png")}
              />
            </View>
          </View>
          <TouchableOpacity
                style={styles.btn41}
                onPress={function () {
                  setLocSlider(0);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontFamily: "CustomB",
                    color: "black",
                    fontSize: 16,
                  }}
                >
                  Enter Location
                </Text>
              </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn51}
            onPress={() => {
              setLocSlider(0);
              setEnterDropOff(false);
            }}
          >
            <Text
              style={{ fontFamily: "CustomB", fontSize: 16, color: "white" }}
            >
              OKAY
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topCon: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    // Add other styles as needed
  },

  inputcontainer: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 4,
    borderTopLeftRadius: 10, // Set the top left border radius
    borderTopRightRadius: 10,
  },

  h1: {
    fontFamily: "Custom",
    fontSize: 16,
    padding: 10,
    backgroundColor: "#141E46",
    width: 80,
    color: "white",
    textAlign: "center",
    borderRadius: 10,
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

  input: {
    height: 40,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#ECECEC",
  },

  pickupT: {
    marginTop: 10,
    backgroundColor: "#ECECEC",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "start",
    borderRadius: 8,
  },

  dropoffT: {
    marginTop: 10,
    backgroundColor: "#ECECEC",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "start",
    borderRadius: 8,
  },

  pickupT1: {
    marginTop: 10,
    backgroundColor: "#ECECEC",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "start",
    alignSelf: "center",
    borderRadius: 8,
    width: "90%",
  },

  btn: {
    marginTop: 10,
    backgroundColor: "#ECECEC",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 10,
  },

  btn2: {
    marginTop: 20,
    backgroundColor: "#FF6969",
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
  },
  imgstyle: {
    width: 50,
    height: 50,
  },

  btn3: {
    backgroundColor: "white",
    height: 50,
    width: 120,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "white",
    borderColor: "#FF6969",
    borderBottomWidth: 4,
    borderRadius: 5,
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
    marginBottom: 200,
  },
  map1: {
    ...StyleSheet.absoluteFillObject,
  },

  bottomSheetStyle: {
    zIndex: 1, // Set a higher z-index for the bottom sheet
  },

  btn4: {
    backgroundColor: "#ECECEC",
    height: 40,
    width: "90%",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 16,
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  btn5: {
    backgroundColor: "#FF6969",
    height: 40,
    width: "90%",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  btn51: {
    backgroundColor: "#FF6969",
    height: 40,
    width: "90%",
    marginLeft: 5,
    marginRight: 5,
    bottom: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
  },

  btn41: {
    backgroundColor: "#ECECEC",
    height: 40,
    width: "90%",
    marginLeft: 5,
    marginRight: 5,
    bottom: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
  },
});
