import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentScreenGo, ResetScreenGo } from '../../redux/action';
import WaitingForRider from './waitingForRider';
import Go from './go';

export default function NavigationGo() {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const currentScreen = useSelector(state => state.screen.currentScreenGo);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer independent={true}
      onStateChange={(state) => {
        const currentRouteName = state.routes[state.index].name;
        dispatch(ResetScreenGo());
        dispatch(SetCurrentScreenGo(currentRouteName));
      }}>
        <Stack.Navigator initialRouteName={currentScreen}>
          <Stack.Screen 
            component={Go}
            name='Go'
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: 'white',
              },
              headerTitleAlign: 'center',
              title: 'Search For Rider',
            }}
          />
          <Stack.Screen 
            component={WaitingForRider}
            name='WaitingForRider'
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: 'whhite',
              },
              headerTitleAlign: 'center',
              title: 'WaitingForRider',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});