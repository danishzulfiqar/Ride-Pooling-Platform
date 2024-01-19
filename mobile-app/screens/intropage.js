import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Platform } from 'react-native';

export default function Intropage({ begin }) {
  const handlechange = () => {
    begin(true);
  };

  return (
    <View style={styles.container}>
    <View style={styles.ddcontainer}>
    <Image
        style={styles.imgstyle}
        resizeMode="contain"
        source={require('../assets/Hlogo.png')}
      />
    </View>
      <View>
        <Text style={styles.text}>
          Introducing Pakistan's first fully self-developed ride booking app!
          Our app offers multiple users the opportunity to share a ride in
          reasonable rates. Our innovative technology connects users going in
          the same direction, reducing costs and offering a sustainable and
          eco-friendly mode of transportation. Join us now and experience the
          convenience, affordability, and efficiency of our app
        </Text>
      </View>
      <View style={{ marginTop: 40 }}>
        <TouchableOpacity style={styles.buttonstyle} onPress={handlechange}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            BEGIN YOUR JOURNEY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
    justifyContent:'center',
  },

  ddcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
  },

  imgstyle: {
    width: 450,
    height:200,
  },

  text: {
    fontSize: 15,
    fontFamily: 'monospace',
    textAlign: 'center',
  },

  buttonstyle: {
    justifyContent: 'center',
    marginTop: 40,
    alignSelf: 'center',
    height: 40,
    width: 260,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FF6969',
  },
});
