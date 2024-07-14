import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RiderCard from './ridercard';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getFirestore, collection, getDocs, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, app } from "../firebase";

export default function Slider({
  l1,l2, 
  set,
  loc1coords, loc2coords, 
  uid, setRiderBooked, setRidePhaseKey, 
  loc1lat, loc1lng }) {
  const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);
  const db = getFirestore(app);

  function back(){
    set(0)
  }


  /////////////////// Set Rider Availability //////////////////////

  const setAvailability = async (available) => {

    const availabilityRef = doc(db, "users", uid);
    const updateData = {
      "availability": available,
    };
  
    try {
      await updateDoc(availabilityRef, updateData);
       console.log("Availability updated successfully!");
    } catch (error) {
      console.error("Error updating availability: ", error);
    }
    
  };

  return (
    
    <View style={styles.container}>
      <BottomSheet index={1} snapPoints={snapPoints}>
      <View style={styles.location}>
        <Image style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/a.png')} />
        <Text style={styles.locationText}>{l1}</Text>
      </View>
      <View style={styles.location}>
        <Image style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/b.png')} />
        <Text style={styles.locationText}>{l2}</Text>
      </View>
        <View style={styles.headingContainer}>
          <Text style={styles.sliderHeading}>Searching For Rider...</Text>
          <TouchableOpacity style={styles.btn3} 
          onPress={()=>{
            setAvailability(false);
            back();
          }}>
            <Text style={{    fontFamily: 'Custom', color:'white'}} >Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.hr}/>
        <ScrollView>
          <RiderCard 
          setRiderBooked={setRiderBooked} 
          l1={l1} l2={l2} 
          loc1coords={loc1coords} loc2coords={loc2coords} 
          uid={uid} 
          setRidePhaseKey={setRidePhaseKey}
          loc1lat={loc1lat} loc1lng={loc1lng}/>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  location:{
    flexDirection:'row',
    marginTop:10
  },
  hr:{
    backgroundColor:'grey',
    height:2,
    width:'90%',
    alignSelf:"center",
    marginTop:20,
  },
  locationText:{
    width:'80%',
    fontFamily:'Custom',
  },
  imgstyle:{
    width:20,
    height:20,
    marginLeft:25,
    marginRight:6
  },
  sliderHeading: {
    fontFamily:'CustomB',
    fontSize:18,
    marginLeft:25,
    marginTop:10
  },
  headingContainer: {
    flexDirection:'row',
    alignItems:'center'
  },
  btn3:{
    backgroundColor:"#141E46",
    height:30,
    width:90,
    marginLeft:80,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation:5
  },
});
