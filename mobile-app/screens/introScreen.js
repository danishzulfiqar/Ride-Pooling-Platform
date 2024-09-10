import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize
} from "react-native-responsive-dimensions";

export default function IntroScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
      <Image
        style={styles.imgstyle}
        resizeMode="contain"
        source={require('../assets/Hlogo.png')}
      />
      <Text style={styles.paragraph}>
          Introducing Pakistan's first fully self-developed ride booking app!
          Our app offers multiple users the opportunity to share a ride in
          reasonable rates. Our innovative technology connects users going in
          the same direction, reducing costs and offering a sustainable and
          eco-friendly mode of transportation. Join us now and experience the
          convenience, affordability, and efficiency of our app
        </Text>
        <TouchableOpacity style={styles.buttonstyle} onPress={
          ()=> {
            navigation.navigate('RoleScreen')
          }
        }>
          <Text style={styles.btnText}>
            BEGIN YOUR JOURNEY
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
    },

    box: {
      margin:20,
      flexDirection: 'column',
      gap: responsiveHeight(10),
    },

    imgstyle: {
      width: '100%',
      height:responsiveHeight(15),
    },

    paragraph: {
      fontFamily: 'custom',
      fontSize: responsiveFontSize(2),
      textAlign: 'center',
      lineHeight: Platform.OS === 'android' ? responsiveHeight(3) : responsiveHeight(4),
    },

    buttonstyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'android' ? responsiveHeight(5) : responsiveHeight(6),
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#FF6969',
    },

    btnText: {
    fontFamily: 'customb',
    fontSize: responsiveFontSize(2),
    color: 'white',
    }, 

    });