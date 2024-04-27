import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, app } from "../firebase";

export default function UserRequestCard() {
  const [requests, setRequests] = useState([]);

  const db = getFirestore(app);
  const ridersCollectionRef = getDocs(collection(db, "riders"));
  console.log(ridersCollectionRef);

  

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.leftCardSide}>
            <Text style={styles.cardHeadText}>CARD</Text>
            <Text style={styles.cardText}>Availability:</Text>
            <Text style={styles.cardText}>Latitude:</Text>
            <TouchableOpacity style={styles.btn3}>
              <Text
                style={{
                  fontFamily: "CustomB",
                  color: "white",
                  fontSize: 15,
                }}
              >
                Accept
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightCardSide}>
            <Text style={styles.cardHeadText}>Price</Text>
            <Text style={styles.cardText}>Geohash:</Text>
            <Text style={styles.cardText}>Longitude:</Text>
            <TouchableOpacity style={styles.btn31}>
              <Text
                style={{
                  fontFamily: "CustomB",
                  color: "white",
                  fontSize: 15,
                }}
              >
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  cardContainer: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 7,
    borderColor: "black",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  card: {
    flexDirection: "row",
  },
  rightCardSide: {
    width: "50%",
    alignItems: "flex-end",
    padding: 10,
  },
  leftCardSide: {
    width: "50%",
    alignItems: "flex-start",
    padding: 10,
  },
  cardHeadText: {
    fontFamily: "CustomB",
    fontSize: 18,
  },
  cardText: {
    fontFamily: "Custom",
    fontSize: 14,
  },
  btn3: {
    backgroundColor: "#FF6969",
    height: 35,
    width: 100,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btn31: {
    backgroundColor: "black",
    height: 35,
    width: 100,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
