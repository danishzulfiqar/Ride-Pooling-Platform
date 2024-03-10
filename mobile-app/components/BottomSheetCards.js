import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RiderCard from './ridercard';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

export default function Slider({l1,l2, set, riderCardData, setRiderBooked, setRidersData, setRidersDistanceVal}) {
  const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);

  function back(){
    set(0)
  }

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
          <TouchableOpacity style={styles.btn3} onPress={back}>
            <Text style={{    fontFamily: 'Custom', color:'white'}} >Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.hr}/>
        <ScrollView>
          <RiderCard riderCardData={riderCardData} setRiderBooked={setRiderBooked} setRidersData={setRidersData} setRidersDistanceVal={setRidersDistanceVal}/>
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
