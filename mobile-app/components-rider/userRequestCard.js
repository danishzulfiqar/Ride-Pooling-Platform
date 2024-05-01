import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { auth, app } from "../firebase";

export default function UserRequestCard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const db = getFirestore(app);
    let uid = auth.currentUser.uid;
    const RiderRef = doc(db, "riders/" + uid);

    const requestsRef = collection(RiderRef, "requests");

    // Listen for changes to the requests collection
    const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
      let updatedRequests = [];
      snapshot.docs.forEach((doc) => {
        updatedRequests.push({ ...doc.data(), id: doc.id });
      });
      console.log(updatedRequests);
      setRequests(updatedRequests);
    });

    return () => {
      // Unsubscribe from the snapshot listener when component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {requests.map((data) => (
          <View style={styles.card} key={data.id}>
            <View style={styles.leftCardSide}>
              <Text style={styles.cardHeadText}>Card</Text>
              <Text style={styles.cardText}>
                Name: {data.basicInfo.first_name}
              </Text>
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
            <Text style={styles.cardHeadText}>Info</Text>
              <Text style={styles.cardText}>Price: {data.price}</Text>
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
        ))}
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
