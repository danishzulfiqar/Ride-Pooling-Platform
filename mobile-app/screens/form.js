import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function form({backbutton}) {

  const setback = () => {
    backbutton(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backbtn} onPress={setback}>
        <Icon name="arrow-left" size={30} color="grey" />
      </TouchableOpacity>

      <View style={styles.ddcontainer}>
        <Image
          style={styles.imgstyle}
          resizeMode="contain"
          source={require('../assets/logo.png')}
        />
      </View>
      <View>
        <TextInput style={styles.inputStyles} placeholder="FIRST NAME..." />
        <TextInput style={styles.inputStyles} placeholder="LAST NAME..." />
        <TextInput style={styles.inputStyles} placeholder="USERNAME..." />
        <TextInput style={styles.inputStyles} placeholder="EMAIL..." />
        <TouchableOpacity style={styles.buttonstyle}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 40,
  },

  ddcontainer: {
    alignItems: 'center',
    backgroundColor: 'black',
    marginBottom: 50,
    borderRadius: 50,
    elevation: 20,
    marginTop: 20,
  },

  inputStyles: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  imgstyle: {
    margin: 50,
    width: 250,
  },
  buttonstyle: {
    justifyContent: 'center',
    marginTop: 40,
    alignSelf: 'center',
    height: 40,
    width: 320,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'orange',
  },

  backbtn: {

  },
});
