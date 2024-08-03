import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from  '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';

export default function RiderCard({ setRiderBooked, l1, l2, loc1coords, loc2coords, uid, setRidePhaseKey, loc1lat, loc1lng}) {
  const [timer, setTimer] = useState(0);
  const [progressTime, setProgressTime] = useState(1);
  const [riderCardData, setRiderCardData] = useState(null);
  
  // console.log("this is rider information" + JSON.stringify(riderCardData));


  useEffect(() => {
    if (auth().currentUser.uid) {
      const uid = auth().currentUser.uid;
      const usersRef = firestore().collection('users').doc(uid);

      // Listen for changes to the users document
      const unsubscribe = usersRef.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const userData = { uid: snapshot.id, ...snapshot.data() };
          console.log("this is " + JSON.stringify(userData));
          console.log("this is ride status " + userData.current_ride.rideStatus);
          setRidePhaseKey(userData.current_ride.RidebidKey);
          setRiderBooked(userData.current_ride.rideStatus);
        } else {
          console.log("User document does not exist");
        }
      });

      return () => {
        // Unsubscribe from the snapshot listener when component unmounts
        unsubscribe();
      };
    }
  }, [auth().currentUser.uid]);

//////////////////////// Getting Rider Card ////////////////////////// 
const data = {
  uid: auth().currentUser.uid,
  lat:loc1lat,
  lng:loc1lng,
  radius:100000,
}

useEffect(() => {
  const fetchData = () => {
    console.log('called rider card');
    getGoRidersDataFunction(data)
      .catch((error) => {
        console.error("Error in senddata:", error);
      });
  };

  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);

const getGoRidersDataFunction = async (data) => {
  const getGoRiders = functions().httpsCallable('getGoRiders');
  try {
    const result = await getGoRiders(data);
    setRiderCardData(result.data);
    console.log("available rider " + JSON.stringify(result.data));
  } catch (error) {
    console.error("Error calling Function:", error);
  }
};

  /////////////// SENDING RIDER REQUEST ///////////////////


  const requestingRider = async (userId) => {
    const data = {
      uid: auth().currentUser.uid, 
      pickup: l1,
      dropoff: l2, 
      pickup_lat: loc1coords.lat, 
      pickup_lng: loc1coords.lng, 
      dropoff_lat: loc2coords.lat, 
      dropoff_lng: loc2coords.lng,
      riderUID: userId
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

  ////////////////////////////////////////////////////////

  useEffect(() => {
    let interval;
    if (riderCardData !== null) {
      setTimer(10); // TIME IN SEC
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            let newTime = prevTimer - 1;
            setProgressTime(newTime/10);
            return newTime;
          } else {
            clearInterval(interval); // Clear interval when timer reaches 0
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup function
  }, [riderCardData]);
  

  return (
    <View style={styles.container}>
    {!riderCardData ? (
    <View style={styles.search}> 
      <Text style={styles.searchTxt}>searching...</Text>
    </View>
  ) : (
    
    riderCardData.slice().reverse().map((card, index) => (
  <View style={styles.cardContainer} key={index}>
    <ProgressBar color='black' style={{height:5}} progress={progressTime}/>
    <View style={styles.card}>
      <View style={styles.leftCardSide}>
        <Text style={styles.cardHeadText}>{card.crest.UserData.first_name}{card.crest.UserData.last_name}</Text>
        <Text style={styles.cardText}>Availability:True</Text>
        <Text style={styles.cardText}>{card.crest.UserData.phone_number}</Text>
        <TouchableOpacity
          style={styles.btn3}
          onPress={() => {
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
        <Text style={styles.cardHeadText}> {card.crest.rating.rating_value} <Icon name="star" size={20} color="black" /></Text>
        <Text style={styles.cardText}>Geohash: {card.location.geohash}</Text>
        <Text style={styles.cardText}>{card.location.geopoint._longitude},{card.location.geopoint._latitude}</Text>
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
    fontSize: 16,
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
