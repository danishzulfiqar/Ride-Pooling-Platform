import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RiderCard from './ridercard';
import BottomSheet from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Slider() {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

  return (
    
    <View style={styles.container}>
      <BottomSheet index={1} snapPoints={snapPoints}>
        <View style={styles.headingContainer}>
          <Text style={styles.sliderHeading}>Searching For Rider</Text>
          <TouchableOpacity style={styles.btn3}>
            <Text style={{fontFamily:'monospace', color:'white'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <RiderCard />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'grey',
  },
  sliderHeading: {
    fontFamily:'monospace',
    fontSize:18,
    fontWeight:'bold',
    marginLeft:25,
  },
  headingContainer: {
    flexDirection:'row',
  },
  btn3:{
    backgroundColor:"black",
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
