import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, TextInput,Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Homescreen1 from './homescreen1';
import Go from '../components/Go';
import Pooling from '../components/Pooling';
import Sharing from '../components/Sharing'
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
            name='Go'
            options={{
                drawerLabel:'Go',
                title:'Go',
            }}
            component={Go}
        />
        <Drawer.Screen 
            name='Pooling'
            options={{
                drawerLabel:'Pooling',
                title:'Pooling',
            }}
            component={Pooling}
        />
        <Drawer.Screen 
            name='Sharing'
            options={{
                drawerLabel:'Sharing',
                title:'Sharing',
            }}
            component={Sharing}
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
