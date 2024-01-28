import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Go from '../components/Go';
import Pooling from '../components/Pooling';
import Sharing from '../components/Sharing';

const Tab = createBottomTabNavigator();

export default function Homescreen1() {

  return (
    //<NavigationContainer>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Tab.Navigator 
                    screenOptions={{
                        tabBarShowLabel:false,
                        headerShown: false,
                        tabBarStyle:{height:65}
                         }} >
                    <Tab.Screen name="Go" component={Go} options={{
                        tabBarIcon:({focused})=>{
                            return (<View style={styles.navCont}>
                                       <Image
                                       style={styles.navLogo}
                                        resizeMode="contain"
                                        source={require('../assets/go.png')} />
                                       <Text style={[styles.navText, { color: focused ? '#FF6969' : 'black' }]}>GO</Text>
                                    </View>);
                        }}} />
                    <Tab.Screen name="Pooling" component={Pooling} options={{
                        tabBarIcon:({focused})=>{
                            return (<View style={styles.navCont}>
                                       <Image
                                        style={styles.navLogo}
                                        resizeMode="contain"
                                        source={require('../assets/network.png')} />
                                       <Text style={[styles.navText, { color: focused ? '#FF6969' : 'black' }]}>Pooling</Text>
                                    </View>);
                        }}}/>
                    <Tab.Screen name="Sharing" component={Sharing} options={{
                        tabBarIcon:({focused})=>{
                            return (<View style={styles.navCont}>
                                       <Image
                                        style={styles.navLogo}
                                        resizeMode="contain"
                                        source={require('../assets/output-onlinegiftools.gif')} />
                                       <Text style={[styles.navText, {color: focused ? '#FF6969' : 'black' }]}>Sharing</Text>
                                    </View>);
                        }}}/>
                </Tab.Navigator>
            </View>
        </TouchableWithoutFeedback>
    //</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navCont:{
    alignItems:'center',
    justifyContent:'center',
  },
  navLogo:{
    width:35,
    height:35,
  },
  navText:{
    fontSize:14,
    fontFamily: 'Custom',

  },
});
