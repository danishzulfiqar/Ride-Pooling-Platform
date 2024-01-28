import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, TextInput,Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Homescreen1 from './homescreen1';
import { SafeAreaView } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();

export default function drawerNav() {

  return (
    <NavigationContainer>
        <Drawer.Navigator 
        drawerContent={(props)=>{
            return(
                <SafeAreaView>
                    <View ></View>
                    <DrawerItemList {...props}/>
                </SafeAreaView>
            )
        }}
        screenOptions={{
            drawerStyle:{
                backgroundColor:'#F0ECE5',
                width:250
            },
            headerStyle:{
                backgroundColor:'white'
            },
            headerTintColor:'black',
            headerTitleStyle:{
                fontFamily: 'Custom',

            },
            drawerActiveTintColor:'#FF6969',
            drawerLabelStyle:{
                color:'#111',
                fontFamily: 'Custom',
                fontWeight:'bold',
                fontSize:16
            }
        }}>
        <Drawer.Screen 
            name='Home'
            options={{
                drawerLabel:'Home',
                title:'Home',
            }}
            component={Homescreen1}
        />
        </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
});
