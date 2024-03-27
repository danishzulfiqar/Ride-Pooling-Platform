import React from "react";
import { View, StyleSheet } from "react-native";
import Nav from "./components/Navigation";
import Animation from "./components/animation";


export default function App() {


  return (
    <View style={styles.container}>
      <Nav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
