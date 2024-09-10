import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentScreenGo, ResetScreenGo } from '../redux/action';
import Home from './home';
import NavigateToUser from './navigateToUser';

export default function NavigationRider() {
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
            component={Home}
            name='Home'
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: 'white',
              },
              headerTitleAlign: 'center',
              title: 'Home',
            }}
          />
          <Stack.Screen 
            component={NavigateToUser}
            name='NavigateToUser'
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: 'white',
              },
              headerTitleAlign: 'center',
              title: 'NavigateToUser',
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