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
      <Text style={styles.heading}>| SELECT YOUR ROLE</Text>

      <View style={styles.role}>
        <TouchableOpacity style={styles.button} onPress={setrider}>
          <Image
            style={styles.imgstyle}
            resizeMode="contain"
            source={require('../assets/rider.png')}
          />
          <Text style={styles.text}>BECOME A RIDER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.role}>
        <TouchableOpacity style={styles.button} onPress={setpassenger}>
          <Image
            style={styles.imgstyle}
            resizeMode="contain"
            source={require('../assets/passenger.png')}
          />
          <Text style={styles.text}>BECOME A PASSENGER</Text>
        </TouchableOpacity>
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
  },

  heading: {
    fontFamily: 'CustomB',
    marginTop: 20,
    alignSelf: 'flex-start',
    fontSize: 22,
    color: 'black',
    padding: 3,
    paddingLeft: 40,
    paddingRight: 20,
    borderRadius: 6,
    marginBottom: 25,
  },

  role: {
    // // backgroundColor: "#FF6969",
    borderBottomWidth: 15,
    borderBottomColor: "#FF6969",
    borderRadius: 4.84,
    marginTop: Platform.OS === 'ios' ? 18 : 40,
    alignItems: 'center',
    width: 300,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 5,
    marginBottom: 20,
    backgroundColor: "white"
  },

  text: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Custom',
    marginTop: 20,
    marginBottom: 15,
    color: "black",
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  backbtn: {
    marginLeft: 40,
  },
});
