import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import cardData from "./carddata";
import { auth } from '../firebase';
import { ProgressBar } from 'react-native-paper';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function RiderCard({ riderCardData, setRiderBooked, setRidersData, setRidersDistanceVal, l1, l2, loc1coords, loc2coords, uid }) {
  const [timer, setTimer] = useState(0);
  const [progressTime, setProgressTime] = useState(1);
  const functions = getFunctions(auth.app);

  console.log('this is riders data ' + JSON.stringify(riderCardData) );


  function sendReq(geohash,lat,lng) {
    setRidersDistanceVal({
      lat:lat,
      lng:lng,
    })
    setRiderBooked(1);
  }


  /////////////// SENDING RIDER REQUEST ///////////////////


  const requestingRider = async ( userId ) => {
    const data = {
      uid:uid, 
      pickup:l1,
      dropoff:l2, 
      pickup_lat:loc1coords.lat, 
      pickup_lng:loc1coords.lng, 
      dropoff_lat:loc2coords.lat, 
      dropoff_lng:loc2coords.lng,
      riderUID:userId
    }
    console.log(data);
    const sendRequestToRider = httpsCallable(functions, 'sendRequestToRider');
    try {
      const result = await sendRequestToRider(data);
      console.log(result.data);
    } catch (error) {
      console.error("Error calling sendRequestToRider:", error);
    }
  };

  ////////////////////////////////////////////////////////

  useEffect(() => {
    let interval;
    if (riderCardData !== null) {
      setTimer(5); // TIME IN SEC
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            let newTime = prevTimer - 1;
            setProgressTime(newTime/5);
            return newTime;
          } else {
            clearInterval(interval); // Clear interval when timer reaches 0
            setRidersData(null);
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup function
  }, [riderCardData]);
  

  return (
    <View style={styles.container}>
  {timer === 0 ? (
    <View style={styles.search}>
      <Text style={styles.searchTxt}>searching...</Text>
    </View>
  ) : (
    
    riderCardData.slice().reverse().map((card, index) => (
  <View style={styles.cardContainer} key={index}>
    <ProgressBar color='black' style={{height:5}} progress={progressTime}/>
    <View style={styles.card}>
      <View style={styles.leftCardSide}>
        <Text style={styles.cardHeadText}>CARD</Text>
        <Text style={styles.cardText}>
          Availability: {card.crest.availability}
        </Text>
        <Text style={styles.cardText}>Latitude: {card.location.geopoint._latitude}</Text>
        <TouchableOpacity
          style={styles.btn3}
          onPress={() => {
            sendReq(card.location.geohash, card.location.geopoint._latitude, card.location.geopoint._longitude); // Pass the geohash value to the sendReq function
            requestingRider(card.crest.UserData.user_id);
          }}
        >
          <Text
            style={{
              fontFamily: "CustomB",
              color: "white",
              fontSize: 15,
            }}
          >
            Request
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rightCardSide}>
        <Text style={styles.cardHeadText}>Price</Text>
        <Text style={styles.cardText}>Geohash: {card.location.geohash}</Text>
        <Text style={styles.cardText}>Longitude: {card.location.geopoint._longitude}</Text>
        <TouchableOpacity style={styles.btn31} >
          <Text
            style={{
              fontFamily: "CustomB",
              color: "white",
              fontSize: 15,
            }}
          >
            Reject
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
))

  )}
</View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  search:{
    justifyContent:"center",
    alignItems:"center",
    marginTop:45,
  },
  searchTxt:{
    fontFamily:'Custom',
    fontSize:18,
    alignSelf:"center",
    color:'#A8A196',
  },
  cardContainer: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 7,
    borderColor: "black",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
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
  },
  rightCardSide: {
    width: "50%",
    alignItems: "flex-end",
    padding: 5,
  },
  leftCardSide: {
    width: "50%",
    alignItems: "flex-start",
    padding: 5,
  },
  cardHeadText: {
    fontFamily: "CustomB",
    fontSize: 18,
  },
  cardText: {
    fontFamily: "Custom",
    fontSize: 14,
  },
  btn3: {
    backgroundColor: "#FF6969",
    height: 35,
    width: 100,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btn31: {
    backgroundColor: "black",
    height: 35,
    width: 100,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
