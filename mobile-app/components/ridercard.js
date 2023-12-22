import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import cardData from './carddata'

export default function RiderCard() {
  return (
    <View style={styles.container}>
      {cardData.map((card, index) => (
        <View style={styles.cardContainer} key={index}>
          <View style={styles.card}>
            <View style={styles.leftCardSide}>
              <Text style={styles.cardHeadText}>{card.name}</Text>
              <Text style={styles.cardText}>Bike: {card.bike}</Text>
              <Text style={styles.cardText}>Rating: {card.rating}</Text>
            </View>
            <View style={styles.rightCardSide}>
              <Text style={styles.cardHeadText}>Price: {card.price}</Text>
              <Text style={styles.cardText}>Passengers: {card.passengers}</Text>
              <Text style={styles.cardText}>Distance: {card.distance}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.btn3}>
            <Text style={{ fontFamily: 'monospace' }}>Request</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"white"
  },
  cardContainer: {
    width: 360,
    backgroundColor: 'white',
    borderRadius: 7,
    borderColor: 'black',
    height: 130,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  card: {
    flexDirection:'row',
  },
  rightCardSide: {
    width:180,
    alignItems:'flex-end',
    padding:5,
  },
  leftCardSide: {
    width:180,
    alignItems:'flex-start',
    padding:5
  },
  cardHeadText: {
    fontFamily:'monospace',
    fontWeight:'bold',
    fontSize:18,
  },
  cardText: {
    fontFamily:'monospace',
    fontSize:14,
  },
  btn3:{
    backgroundColor:"orange",
    height:40,
    width:110,
    marginLeft:5,
    marginRight:5,
    borderRadius:10,
    borderColor:'black',
    borderWidth:2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
