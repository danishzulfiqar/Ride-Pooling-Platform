import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const API_KEY = 'YOUR_GOOGLE_API_KEY';

export default function GoogleMaps() {

  return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
            styles={{
          container: {
            flex: 0,
          },
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)', // Transparent background for the search input
            borderWidth:2,
            borderRadius:5
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(details);
      }}
      query={{
        key: API_KEY,
        language: 'en',
      }}
    />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:400,
  },
});
