import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import { useDispatch } from 'react-redux';
import { SetRole } from '../redux/action';

export default function RoleScreen({navigation}) {
  const dispatch = useDispatch();

  function setRole(role){
    dispatch(SetRole(role));
    if(role == 'rider'){
      console.log('Role: rider');
      navigation.navigate('SignInRider');
    }
    else{
      console.log('Role: user');
      navigation.navigate('SignInUser');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <TouchableOpacity style={styles.backButton} onPress={
            ()=>{
                navigation.navigate('IntroScreen')
            }
        }>
            <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
        </TouchableOpacity>

        <View style={styles.btnContainer}>
        <Text style={styles.headingText}>| SELECT YOUR ROLE</Text>
        <TouchableOpacity style={styles.button} onPress={
          ()=>{setRole('rider')}
        }>
          <Image
            style={styles.btnImg}
            resizeMode="contain"
            source={require('../assets/rider.png')}
          />
          <Text style={styles.btnText}>RIDER</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={
          ()=>{setRole('user')}
        }>
          <Image
            style={styles.btnImg}
            resizeMode="contain"
            source={require('../assets/passenger.png')}
          />
          <Text style={styles.btnText}>PASSENGER</Text>
        </TouchableOpacity>
        </View>
      
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  box: {
    paddingVertical: responsiveHeight(5),
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
  },

  headingText :{
    fontSize: responsiveFontSize(3),
    fontFamily: 'customb',
    color: "black",
    alignSelf: 'flex-start'
  },

  btnContainer :{
    marginTop: responsiveHeight(10),
    flexDirection: 'column',
    gap: responsiveHeight(4),
  },

  button: {
    padding:10,
    borderBottomWidth: 12,
    borderBottomColor: "#FF6969",
    borderRadius: 5,
    width: responsiveWidth(80),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 5,
    backgroundColor: "white"
  },

  btnText: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'customb',
    color: "black",
  },

  btnImg: {
    width: '100%',
    height: responsiveHeight(20),
  },

});