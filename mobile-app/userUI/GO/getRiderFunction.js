import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Image, BackHandler } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import firestore from  '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import functions from '@react-native-firebase/functions';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';
import Entypo from '@expo/vector-icons/Entypo';
import { SetPickupLocation, SetPickupLocationCoords, SetDropoffLocation, 
  SetDropoffLocationCoords } from '../../redux/action';
import { set } from 'lodash';


export default function GetRiderFunction({ setSearchForRiders}) {
  const snapPoints = useMemo(() => [responsiveHeight(20), responsiveHeight(80)], []);
  const [riders, setRiders] = useState([]);

  const dispatch = useDispatch();

  const UID = useSelector(state => state.appEssentials.uid);
  const userLocationCoords = useSelector(state => state.location.userLocationCoords);
  const pickupAddress = useSelector(state => state.location.pickupLocation);
  const dropoffAddress = useSelector(state => state.location.dropoffLocation);
  const pickupCoords = useSelector(state => state.location.pickupLocationCoords);
  const dropoffCoords = useSelector(state => state.location.dropoffLocationCoords);
  

  useEffect(() => {

    let radius = 1000;
    let intervalId;

    const searchForRiders = () => {
      const data = {
        uid: UID,
        lat: userLocationCoords.latitude,
        lng: userLocationCoords.longitude,
        radius: radius,
      }
      console.log("data " + JSON.stringify(data));
        getGoRidersDataFunction(data);

      if (radius === 1000) {
        radius = 5000;
      } else if (radius === 5000) {
        radius = 100000;
      } else {
        radius = 1000;
      }
    };

    intervalId = setInterval(searchForRiders, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getGoRidersDataFunction = async (data) => {
    const getGoRiders = functions().httpsCallable('getGoRiders');
  
    try {
      const result = await getGoRiders(data);
      const newData = result.data;
  
      setRiders(prevRiders => {
        const updatedRiders = newData.map(rider => ({
          ...rider,
          id: rider.crest.UserData.user_id,
          progressTime: 1
        }));
  
        const uniqueRiders = updatedRiders.filter(newRider =>
          !prevRiders.some(existingRider => existingRider.crest.UserData.user_id === newRider.crest.UserData.user_id)
        );
  
        return [...prevRiders, ...uniqueRiders];
      });
  
    } catch (error) {
      console.error("Error calling Function:", error);
    }
  };
  


  useEffect(() => {
    const timer = setInterval(() => {
      setRiders(prevRiders => 
        prevRiders.map(rider => {
          const updatedRider = {
            ...rider,
            progressTime: Math.max(0, rider.progressTime - 0.05)
          };
          return updatedRider;
        }).filter(rider => rider.progressTime > 0)
      );
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

  async function deleteRequestDocument(user_id) {
    try {
      // Remove the request from local state
      setRiders(prevRiders => prevRiders.filter(rider => rider.crest.UserData.user_id !== user_id));
  
      console.log(`Rider with user_id ${user_id} has been rejected and removed from the list.`);
    } catch (error) {
      console.error("Error rejecting rider:", error);
    }
  }
  

  const requestingRider = async (riderId) => {
    const data = {
      uid: UID, 
      pickup: pickupAddress,
      dropoff: dropoffAddress, 
      pickup_lat: pickupCoords.lat, 
      pickup_lng: pickupCoords.lng, 
      dropoff_lat: dropoffCoords.lat, 
      dropoff_lng: dropoffCoords.lng,
      riderUID: riderId
    };
    
    console.log(data);
    
    const sendRequestToRider = functions().httpsCallable('sendRequestToRider');
    
    try {
      const result = await sendRequestToRider(data);
      console.log(result.data);
    } catch (error) {
      console.error("Error calling sendRequestToRider:", error);
    }
  };

  const setAvailability = async (available) => {
    const availabilityRef = firestore().collection('users').doc(UID);
    console.log(availabilityRef);
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

////////////////////////// Mobile Back button handler ///////////////////////////////

useEffect(() => {
  // Disable back button behavior
  const onBackPress = () => {
    setAvailability(false);
    dispatch(SetPickupLocation('Enter Pickup Location'));
    dispatch(SetPickupLocationCoords(null));
    dispatch(SetDropoffLocation('Enter Dropoff Location'));
    dispatch(SetDropoffLocationCoords(null));
    setSearchForRiders(false);
    return true; // Return true to stop the back action
  };

  BackHandler.addEventListener('hardwareBackPress', onBackPress);

  return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
}, []);

  return (
    <BottomSheet index={1} snapPoints={snapPoints}>
          <View style={styles.BottomContainer}>
            <View style={styles.header}>
            <Text style={styles.headerText}>Searching For Rider....</Text>
            <TouchableOpacity style={styles.headerBtn} onPress={()=>{
              setAvailability(false);
              dispatch(SetPickupLocation('Enter Pickup Location'));
              dispatch(SetPickupLocationCoords(null));
              dispatch(SetDropoffLocation('Enter Dropoff Location'));
              dispatch(SetDropoffLocationCoords(null));
              setSearchForRiders(false);
            }}>
            <Text style={styles.headerBtnText}>Cancel</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.location}>
              <Image style={styles.imgstyle}
                resizeMode="contain"
                source={require('../../assets/a.png')} />
              <Text style={styles.locationText}>{pickupAddress}</Text>
            </View>
            <View style={styles.location}>
              <Image style={styles.imgstyle}
                resizeMode="contain"
                source={require('../../assets/b.png')} />
              <Text style={styles.locationText}>{dropoffAddress}</Text>
            </View>
          </View>
          <View style={styles.hr}/>
          <ScrollView contentContainerStyle={{ alignItems:'center' }}>
            { riders.length === 0 ? (
              <View style={{flexDirection:'row',gap:5, alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontFamily:'custom', fontSize: responsiveFontSize(2), color:'lightgrey'}}>
                   Searching
                </Text>
                <ActivityIndicator size="small" color="lightgrey" />
              </View>
            ) : (

              riders.slice().reverse().map((card, index) => (
                <View style={styles.cardContainer} key={index}>
                <ProgressBar color='black' style={{ height: 5 }} progress={card.progressTime} />                
                <View style={styles.card}>
                  <View style={styles.leftCardSide}>
                    <Text style={styles.cardHeadText}>{card.crest.UserData.first_name}{card.crest.UserData.last_name}</Text>
                    <Text style={styles.cardText}>Availability:True</Text>
                    <Text style={styles.cardText}>{card.crest.UserData.phone_number}</Text>
                    <TouchableOpacity style={styles.reqBtn} 
                    onPress={()=>{
                      requestingRider(card.crest.UserData.user_id);
                    }}>
                      <Text style={styles.headerBtnText}>Request</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rightCardSide}>
                    <Text style={styles.cardHeadText}> {card.crest.rating.rating_value.toFixed(1)} <Entypo name="star-outlined" size={responsiveFontSize(3)} color="black" /> </Text>
                    <Text style={styles.cardText}>Geohash: {card.location.geohash}</Text>
                    <Text style={styles.cardText}>{card.location.geopoint.longitude},{card.location.geopoint.latitude}</Text>
                    <TouchableOpacity style={styles.rejBtn}
                    onPress={() => deleteRequestDocument(card.crest.UserData.user_id)}>
                      <Text style={styles.headerBtnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              ))
              
            ) }
          </ScrollView>
          </BottomSheet>
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