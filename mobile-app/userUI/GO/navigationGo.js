import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import WaitingForRider from './waitingForRider';
import Go from './go';

export default function NavigationGo() {
  const currentScreen = useSelector(state => state.screen.currentScreenGo);
  console.log('currentScreenGo', currentScreen);

  return (
    <SafeAreaView style={styles.container}>
      { currentScreen === 'home' ? (<Go />) 
      : currentScreen === 'rideNavigatioStateGo' ? (<WaitingForRider />) 
      :  null }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});