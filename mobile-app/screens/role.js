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
      getvalue(1);
    };
    const setpassenger = () => {
      getvalue(2);
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
      width: 200,
      height: 200,
    },
  
    heading: {
      fontFamily: 'monospace',
      marginTop: 25,
      alignSelf: 'center',
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: 'black',
      padding: 3,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 6,
    },
  
    role: {
      marginTop: 40,
      alignItems: 'center',
    },
  
    text: {
      fontSize: 16,
      alignSelf: 'center',
      fontFamily: 'monospace',
      fontWeight: '900',
      textDecorationLine: 'underline',
      marginTop: 2,
    },
  
    button: {
      backgroundColor: 'orange',
      padding: 10,
      borderRadius: 20,
      borderColor: 'black',
      borderWidth: 6,
    },
  
    backbtn: {
      marginLeft: 40,
    },
  });
  