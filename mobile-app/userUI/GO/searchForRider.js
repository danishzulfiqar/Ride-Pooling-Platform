import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import firestore from  '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import MapStyle from '../../styles/mapStyle';
import { SetPickupLocation, SetPickupLocationCoords, SetDropoffLocation, 
  SetDropoffLocationCoords, SetRidePhaseKey } from '../../redux/action';
import GetRiderFunction from './getRiderFunction';


export default function SearchForRider({navigation, setSearchForRiders}) {
  const mapRef = useRef(null);

  const API_KEY = "YOUR_GOOGLE_API_KEY";
  const dispatch = useDispatch();

  const UID = useSelector(state => state.appEssentials.uid);
  const pickupAddress = useSelector(state => state.location.pickupLocation);
  const dropoffAddress = useSelector(state => state.location.dropoffLocation);
  const pickupCoords = useSelector(state => state.location.pickupLocationCoords);
  const dropoffCoords = useSelector(state => state.location.dropoffLocationCoords);

  useEffect(() => {

    const usersRef = firestore().collection('users').doc(UID);
  
      const unsubscribe = usersRef.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const userData = { uid: snapshot.id, ...snapshot.data() };
  
          console.log("User document exists:", userData);
  
          // Ensure current_ride and rideStatus exist before checking
          if (userData.current_ride && typeof userData.current_ride.rideStatus === 'boolean') {
            console.log("This is the ride status: ", userData.current_ride.rideStatus);
  
            if (userData.current_ride.rideStatus) {
              dispatch(SetRidePhaseKey(userData.current_ride.RidebidKey));
              setSearchForRiders(false);
              navigation.replace('WaitingForRider');
              console.log('true');
            } else {
              console.log('searching on')
            }
          } else {
            console.log("current_ride or rideStatus is undefined");
          }
        } else {
          console.log("User document does not exist");
        }
      });
  
      return () => {
        unsubscribe();
      };

  }, []);
  

  return (
    <SafeAreaView style={styles.container}>
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

          <GetRiderFunction setSearchForRiders={setSearchForRiders} navigation={navigation} />
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

  BottomContainer :{
    width: responsiveWidth(100),
    backgroundColor: 'white',
    padding: responsiveWidth(3),
    justifyContent: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    fontFamily:'customb',
    fontSize: responsiveFontSize(3),
  },

  headerBtn: {
    backgroundColor: 'black',
    padding: responsiveWidth(2),
    borderRadius: 5,
  },

  headerBtnText: {
    color: 'white',
    fontFamily:'customb',
    fontSize: responsiveFontSize(2),
  },

  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveWidth(2),
  },

  locationText :{
    fontFamily:'custom',
    fontSize: responsiveFontSize(1.6),
    width: responsiveWidth(80),
    marginLeft: responsiveWidth(2),
  },

  imgstyle: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
  },

  hr:{
    backgroundColor:'grey',
    height:responsiveHeight(0.12),
    width:'90%',
    alignSelf:"center",
    marginBottom:responsiveHeight(2),
  },



  cardContainer: {
    width: responsiveWidth(90),
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: responsiveHeight(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  card: {
    flexDirection: "row",
    padding: responsiveWidth(2),
  },

  rightCardSide: {
    width: "50%",
    alignItems: "flex-end",
    padding: responsiveWidth(1),
    gap: responsiveWidth(0.5),
  },
  leftCardSide: {
    width: "50%",
    alignItems: "flex-start",
    padding: responsiveWidth(1),
    gap: responsiveWidth(0.5),
  },
  cardHeadText: {
    fontFamily: "customb",
    fontSize: responsiveFontSize(2.2),
  },
  cardText: {
    fontFamily: "custom",
    fontSize: responsiveFontSize(1.5),
  },

  reqBtn: {
    backgroundColor: '#FF6969',
    padding: responsiveWidth(2),
    width: responsiveWidth(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

  rejBtn: {
    backgroundColor: 'black',
    padding: responsiveWidth(2),
    width: responsiveWidth(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

})