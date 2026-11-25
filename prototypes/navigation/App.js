import React from "react";
import { View, StyleSheet } from "react-native";
import Nav from "./components/Navigation";
import Animation from "./components/animation";
import Route from "./components/polyline";


export default function App() {


  return (
    <View style={styles.container}>
      <Route />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
