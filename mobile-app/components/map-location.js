import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';




export default function Mapsearch({text}) {

  return (

    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View style={styles.inputcontainer}>
        <Text style={styles.h1}>{text}</Text>
        <TextInput 
        style={styles.input} 
        placeholder=" Enter pick-up point" 
        selectionColor="black" 
        underlineColorAndroid="transparent"/>
        <TextInput 
        style={styles.input} 
        placeholder="Enter your destination" 
        selectionColor="orange"
        underlineColorAndroid="transparent"/>
        <TouchableOpacity style={styles.btn}><Text style={{alignSelf:"center"}}>Choose from Map</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn2}><Text style={{alignSelf:"center"}}>Find Rider</Text></TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"grey"
  },

  inputcontainer:{
    backgroundColor:"white",
    marginLeft:10,
    marginRight:10,
    padding:10,
    marginTop:2,
    borderRadius:10

  },

  h1:{
    fontFamily:"monospace",
    fontSize:20,
    padding:10,
    backgroundColor:'grey',
    width:120,
    marginBottom:5,
    textAlign:'center',
    borderRadius:10
  },

  input:{
    height:40,
    marginTop:10,
    borderRadius:10,
    backgroundColor:"#ECECEC"
  },

  btn:{
    marginTop:10,
    backgroundColor:"#ECECEC",
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn2:{
    marginTop:20,
    backgroundColor:"orange",
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
  },

});
