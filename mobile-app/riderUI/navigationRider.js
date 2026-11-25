import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Home from './home';
import NavigateToUser from './navigateToUser';

export default function NavigationRider() {
  const currentScreenRider = useSelector(state => state.screen.currentScreenRider);
  console.log(currentScreenRider);

  return (
    <SafeAreaView style={styles.container}>
      { currentScreenRider === 'home' ? (<Home />) 
      : currentScreenRider === 'rideNavigatioState' ? (<NavigateToUser />) 
      : null 
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});