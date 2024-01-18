<<<<<<< HEAD
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Platform } from 'react-native';

export default function Intropage({ begin }) {
  const handlechange = () => {
    begin(true);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.imgstyle}
        resizeMode="contain"
        source={require('../assets/logo.png')}
      />
      <Text style={styles.heading}>Ride Together | Save Together</Text>
      <View
        style={{
          /**backgroundColor:'lightgrey',padding:12,borderRadius:15,**/ marginTop: 60,
        }}>
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
    marginTop: 100,
    flex: 1,
    margin: 20,
    alignItems: 'center',
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  imgstyle: {
    width: 300,
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
    backgroundColor: 'orange',
  },
});
=======
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Platform } from 'react-native';

export default function Intropage({ begin }) {
  const handlechange = () => {
    begin(true);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.imgstyle}
        resizeMode="contain"
        source={require('../assets/logo.png')}
      />
      <Text style={styles.heading}>Ride Together | Save Together</Text>
      <View
        style={{
          /**backgroundColor:'lightgrey',padding:12,borderRadius:15,**/ marginTop: 60,
        }}>
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
    marginTop: 100,
    flex: 1,
    margin: 20,
    alignItems: 'center',
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  imgstyle: {
    width: 300,
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
    backgroundColor: 'orange',
  },
});
>>>>>>> main
