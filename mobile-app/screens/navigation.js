import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentScreen, ResetScreen } from '../redux/action';
import IntroScreen from './introScreen';
import RoleScreen from './roleScreen';
import SignInUser from './User/signInUser';
import SignInRider from './rider/signInRider';
import EmailLoginUser from './User/emailLoginUser';
import EmailLoginRider from './rider/emailLoginRider';
import DrawerNavigationRider from './rider/drawerNavigationRider';
import DrawerNavigationUser from './User/drawerNavigationUser';
import FormUser from './User/formUser';
import FormRider from './rider/formRider';

export default function NavigationScreen() {
  const stack = createNativeStackNavigator();
  const currentScreen = useSelector(state=> state.screen.currentScreen);
  const dispatch = useDispatch();
  

  return (
      <NavigationContainer
      onStateChange={(state) => {
        const currentRouteName = state.routes[state.index].name;
        dispatch(ResetScreen());
        dispatch(SetCurrentScreen(currentRouteName));
      }}>
        <stack.Navigator initialRouteName={currentScreen}>
        <stack.Screen 
          component={IntroScreen}
          name='IntroScreen'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'IntroScreen',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={RoleScreen}
          name='RoleScreen'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'RoleScreen',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={SignInRider}
          name='SignInRider'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'SignInRider',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={SignInUser}
          name='SignInUser'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'SignInUser',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={EmailLoginUser}
          name='EmailLoginUser'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'EmailLoginUser',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={EmailLoginRider}
          name='EmailLoginRider'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'EmailLoginRider',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={DrawerNavigationRider}
          name='DrawerNavigationRider'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'DrawerNavigationRider',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={DrawerNavigationUser}
          name='DrawerNavigationUser'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'DrawerNavigationUser',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={FormRider}
          name='FormRider'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'FormRider',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        <stack.Screen 
          component={FormUser}
          name='FormUser'
            options={{
              headerShown: false,
              headerStyle: {
                title: 'FormUser',
                backgroundColor: 'lightgrey',},
              headerTitleAlign: 'center',
            }}/>
        </stack.Navigator>
      </NavigationContainer>
  );
}
 const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  box: {
    paddingTop:25,
    gap:10
  },
});
