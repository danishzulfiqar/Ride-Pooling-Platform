import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';




export default function Mapsearch({text1,text2,Changestate,state}) {


  return (

    <View style={styles.container}>
      <View style={{paddingBottom: state === 6 ? null : 70, backgroundColor:"white", marginLeft:10, marginRight:10, padding:30, marginTop:2, borderRadius:10, }}>
        <Text style={styles.h1}>{text1}</Text>
        <Text style={styles.text}>{text2}</Text>
        {state === 6 ? null : <View style={styles.rideoption}>
        <TouchableOpacity style={styles.btn3} onPress={() => {Changestate(true)}}>
        <Image
        style={styles.imgstyle}
        resizeMode="contain"
        source={require('../assets/motorbike.png')}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn3} onPress={() => {Changestate(true)}}>
        <Image
        style={styles.imgstyle}
        resizeMode="contain"
        source={require('../assets/car.png')}/>
        </TouchableOpacity>
        </View>}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"grey"
  },

  rideoption:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },

  h1:{
    fontFamily:"monospace",
    fontSize:20,
    marginBottom:1,
    alignSelf:'center'
  },

  text:{
    fontFamily:"monospace",
    fontSize:14,
    marginBottom:10,
    alignSelf:'center'
  },

  imgstyle:{
    width:90,
    height:80,
  },

  btn3:{
    backgroundColor:"orange",
    height:100,
    width:155,
    marginTop:20,
    marginLeft:8,
    marginRight:8,
    borderRadius:10,
    borderColor:'black',
    borderWidth:3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
