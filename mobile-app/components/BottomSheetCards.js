import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RiderCard from './ridercard';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Slider({l1,l2, set}) {
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);

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
          <Text style={styles.sliderHeading}>Searching For Rider</Text>
          <TouchableOpacity style={styles.btn3}>
            <Text style={{    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color:'white'}} onPress={back}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView>
          <RiderCard />
        </BottomSheetScrollView>
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
  locationText:{
    width:'80%'
  },
  imgstyle:{
    width:20,
    height:20,
    marginLeft:25,
    marginRight:6
  },
  sliderHeading: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize:18,
    fontWeight:'bold',
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
    marginLeft:35,
    marginRight:5,
    borderRadius:10,
    borderColor:'black',
    borderWidth:2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
