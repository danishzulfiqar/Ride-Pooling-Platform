import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Card,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState } from 'react';

export default function Pickrole({ getvalue, backbutton }) {

  const setrider = () => {
    getvalue('rider');
  };
  const setpassenger = () => {
    getvalue('user');
  };

  const setback = () => {
    backbutton(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backbtn} onPress={setback}>
        <Icon name="arrow-left" size={30} color="grey" />
      </TouchableOpacity>
      <Text style={styles.heading}>SELECT YOUR ROLE</Text>

      <View style={styles.role}>
        <TouchableOpacity style={styles.button} onPress={setrider}>
          <Image
            style={styles.imgstyle}
            resizeMode="contain"
            source={require('../assets/rider.png')}
          />
        </TouchableOpacity>
        <Text style={styles.text}>BECOME A RIDER</Text>
      </View>

      <View style={styles.role}>
        <TouchableOpacity style={styles.button} onPress={setpassenger}>
          <Image
            style={styles.imgstyle}
            resizeMode="contain"
            source={require('../assets/passenger.png')}
          />
        </TouchableOpacity>
        <Text style={styles.text}>BECOME A PASSENGER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  imgstyle: {
    width: 170,
    height: 170,
    margin:20,
  },

  heading: {
    fontFamily: 'CustomB',
    marginTop: 20,
    alignSelf: 'center',
    fontSize: 22,
    color: 'black',
    backgroundColor: '#FF6969',
    padding: 3,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 6,
  },

  role: {
    marginTop: Platform.OS === 'ios' ? 18 : 40,
    alignItems: 'center',
  },

  text: {
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: 'Custom',
    marginTop: 5,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    marginTop: 10,
    // iOS shadow
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    // Android elevation
    elevation: 15,
    borderColor: 'black',
  },

  backbtn: {
    marginLeft: 40,
  },
});
