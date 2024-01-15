import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapSearch from '../components/map-location';
import RideSelection from '../components/ride-selection-message';

export default function Homescreen() {
  const [Change, setChange] = useState(0);
  const [showMaps, setShowMaps] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', marginTop: Platform.OS === 'ios' ? (Change === 0 ? 640 : 470) : (Change === 0 ? 510 : 350), marginLeft: 10, marginRight: 10 }}>
          <TouchableOpacity style={[styles.btn3, Change === 1 ? styles.buttonPressed : null]} onPress={() => { setChange(1) }}>
            <Image
              style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/go.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn3, Change === 2 ? styles.buttonPressed : null]} onPress={() => { setChange(2) }}>
            <Image
              style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/output-onlinegiftools.gif')} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn3, Change === 3 ? styles.buttonPressed : null]} onPress={() => { setChange(3) }}>
            <Image
              style={styles.imgstyle}
              resizeMode="contain"
              source={require('../assets/network.png')} />
          </TouchableOpacity>
        </View>
        {Change === 0 ? (<RideSelection text1={"welcome."} text2={"Select your preference."} state={6} />)
          : Change === 1 ? (showMaps ? (<MapSearch text={"Go"} />) : (<RideSelection text1={"Select Your Ride"} text2={""} Changestate={setShowMaps} />))
            : Change === 2 ? (showMaps ? (<MapSearch text={"Pooling"} />) : <RideSelection text1={"Select Your Ride"} text2={""} Changestate={setShowMaps} />)
              : Change === 3 ? (showMaps ? (<MapSearch text={"Sharing"} />) : <RideSelection text1={"Select Your Ride"} text2={""} Changestate={setShowMaps} />)
                : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    backgroundColor: 'orange',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },
});
