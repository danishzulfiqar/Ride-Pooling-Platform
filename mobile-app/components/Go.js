import { React, useState, useMemo, useEffect, useRef } from "react";
import MapView, {
  PROVIDER_DEFAULT,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
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

const API_KEY = "YOUR_GOOGLE_API_KEY";

export default function Go() {
  const mapRef = useRef(null);
  const [Change, setChange] = useState(0);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [A, setA] = useState("ENTER PICKUP LOCATION");
  const [B, setB] = useState("ENTER DROPOFF LOCATION");
  const [loc1lat,setloc1lat] = useState(0);
  const [loc1lng,setloc1lng] = useState(0);
  const [loc2lat,setloc2lat] = useState(0);
  const [loc2lng,setloc2lng] = useState(0);
  const [locSlider, setLocSlider] = useState(0);
  const [showSlider, setShowSlider] = useState(0);
  const [loc1Coordinates, setLoc1Coordinates] = useState();
  const [loc2Coordinates, setLoc2Coordinates] = useState();
  const snapPoints = useMemo(() => ["30%", "55%"], []);
  const snapPoints1 = useMemo(() => ["30%", "55%"], []);

  function showingSlider() {
    setShowSlider(1);
  }

  const newstyle = [
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#d6e2e6",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#cfd4d5",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#7492a8",
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      elementType: "labels.text.fill",
      stylers: [
        {
          lightness: 25,
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#dde2e3",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#cfd4d5",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#dde2e3",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#7492a8",
        },
      ],
    },
    {
      featureType: "landscape.natural.terrain",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#dde2e3",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#588ca4",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [
        {
          saturation: -100,
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#a9de83",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#bae6a1",
        },
      ],
    },
    {
      featureType: "poi.sports_complex",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#c6e8b3",
        },
      ],
    },
    {
      featureType: "poi.sports_complex",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#bae6a1",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#41626b",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          saturation: -45,
        },
        {
          lightness: 10,
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#c1d1d6",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#a6b5bb",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#9fb6bd",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [
        {
          saturation: -70,
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#b4cbd4",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#588ca4",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#008cb5",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "transit.station.airport",
      elementType: "geometry.fill",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: -5,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#a6cbe3",
        },
      ],
    },
  ];

  async function movetoloc(locationString) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationString
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      const { results } = data;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        const loc1Coords = results[0].geometry.location;
        setloc1lat(loc1Coords.lat);
        setloc1lng(loc1Coords.lng);
        setLoc1Coordinates(loc1Coords);
        console.log('setting loc cords' + loc1Coordinates);
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,  
          },
          1000
        );
      } else {
        console.error("No results found for the given location.");
      }
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
  }

  async function movetoloc1(locationString) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationString
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      const { results } = data;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        const loc2Coords = results[0].geometry.location;
        setloc2lat(loc2Coords.lat);
        setloc2lng(loc2Coords.lng);
        setLoc2Coordinates(loc2Coords);
        console.log('setting loc cords' + loc2Coordinates);
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          1000
        );
      } else {
        console.error("No results found for the given location.");
      }
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
  }

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (errorMsg) {
      console.log(errorMsg);
    } else if (location) {
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
  
      // Animate to the new region
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }, 1000);
      }
    }
  }, [errorMsg, location]);


  const [region, setRegion] = useState({
    latitude: latitude || 0,
    longitude: longitude || 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  function onChangeLoc1(region) {
    setRegion(region);
    console.log("static 1" + region);

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        if (results.length > 0) {
          const address = results[0].formatted_address;
          setA(address);
          setLoc1Coordinates({lat:region.latitude,lng:region.longitude});
          setloc1lat(region.latitude);
          setloc1lng(region.longitude);
        }
      })
      .catch((error) => {
        console.error("Error fetching location coordinates:", error);
      });
  }

  function onChangeLoc2(region) {
    setRegion(region);
    console.log("static 2" + region);

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        if (results.length > 0) {
          const address = results[0].formatted_address;
          setB(address);
          setLoc2Coordinates({lat:region.latitude,lng:region.longitude});
          setloc2lat(region.latitude);
          setloc2lng(region.longitude);
        }
      })
      .catch((error) => {
        console.error("Error fetching location coordinates:", error);
      });
  }

  return (
    <View style={{ flex: 1 }}>
      {locSlider === 0 ? (
        <View style={styles.container}>
          <View style={styles.mapsContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              ref={mapRef}
              Region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              customMapStyle={newstyle}
            >
              {latitude && longitude && (
                <Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  title="Location 1"
                  description="Your location"
                />
              )}

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

              <MapViewDirections
                origin={{ latitude: loc1lat, longitude: loc1lng }}
                destination={{ latitude: loc2lat, longitude: loc2lng }}
                apikey={API_KEY}
                strokeWidth={5}
                strokeColor="#000000"
                precision="high"
              />
            </MapView>
          </View>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {showSlider === 1 ? (
              <Slider l1={A} l2={B} set={setShowSlider} />
            ) : (
              <BottomSheet index={1} snapPoints={snapPoints}>
                <View style={styles.topCon}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      marginRight: 10,
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
                            setLocSlider(1);
                          }}
                        >
                          <Text
                            style={{ marginLeft: 10, fontFamily: "Custom" }}
                          >
                            {A}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.dropoffT}>
                        <TouchableOpacity
                          onPress={() => {
                            setLocSlider(null);
                          }}
                        >
                          <Text
                            style={{ marginLeft: 10, fontFamily: "Custom" }}
                          >
                            {B}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => setShowSlider(1)}
                    >
                      <Text style={{ alignSelf: "center",fontFamily:'CustomB',color:'black',fontSize:16 }}>
                        Choose from Map
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn2}
                      onPress={showingSlider}
                    >
                      <Text style={{ alignSelf: "center",fontFamily:'CustomB',color:'white',fontSize:16  }}>Find Rider</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BottomSheet>
            )}
          </TouchableWithoutFeedback>
        </View>
      ) : locSlider === 1 ? (
        <View style={styles.container}>
          <View style={styles.mapsContainer}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              ref={mapRef}
              initialRegion={{
                latitude: latitude || 0,
                longitude: longitude || 0,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
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

          <BottomSheet index={1} snapPoints={snapPoints1}>
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
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                movetoloc(data.description);
                const location1 = data.description;
                setA(location1);
                console.log("textinput1" + location1);
              }}
              query={{ key: API_KEY, language: "en" }}
            />
            <TouchableOpacity style={styles.btn4}>
              <Text style={{ alignSelf: "center",fontFamily:'CustomB',color:'black',fontSize:16 }}>Choose from Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn5}
              onPress={() => {
                setLocSlider(0);
              }}
            >
              <Text style={{fontFamily:'CustomB', fontSize:16,color:'white'}}>OKAY</Text>
            </TouchableOpacity>
          </BottomSheet>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.mapsContainer}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              ref={mapRef}
              initialRegion={{
                latitude: latitude || 0,
                longitude: longitude || 0,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
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
          <BottomSheet index={1} snapPoints={snapPoints1}>
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
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                const location2 = data.description;
                movetoloc1(data.description);
                setB(location2);
                console.log(details);
              }}
              query={{ key: API_KEY, language: "en" }}
            />
            <TouchableOpacity style={styles.btn4}>
              <Text style={{ alignSelf: "center",fontFamily:'CustomB',color:'black',fontSize:16 }}>Choose from Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn5}
              onPress={() => {
                setLocSlider(0);
              }}
            >
              <Text style={{fontFamily:'CustomB', fontSize:16,color:'white'}}>OKAY</Text>
            </TouchableOpacity>
          </BottomSheet>
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
    height: "100%",
  },

  inputcontainer: {
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    marginTop: 2,
    borderRadius: 10,
    // For iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowColor: "black",
    // For Android
    elevation: 6,
  },

  h1: {
    fontFamily: "Custom",
    fontSize: 20,
    padding: 10,
    backgroundColor: "#141E46",
    width: 120,
    color: "white",
    marginBottom: 5,
    textAlign: "center",
    borderRadius: 10,
  },

  markerContainer: {
    position: "absolute",
    top: "30%",
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
    marginTop: 10,
    backgroundColor: "#ECECEC",
    height: 60,
    width: 128,
    marginLeft: 1,
    marginRight: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "white",
    borderColor: "#FF6969",
    borderWidth: 2,
    borderRadius: 10,
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
});
