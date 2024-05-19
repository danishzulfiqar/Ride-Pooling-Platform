import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Homescreen1 from '../homescreen1';
import Go from '../../components-user/Go';
import Pooling from '../../components-user/Pooling';
import Sharing from '../../components-user/Sharing'
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebase';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

export default function drawerNav({setrole, role}) {

    const handleSignOut = async () => {
        setrole(0);
        try {
            await auth.signOut();
            Toast.show({
                type: 'error',
                text1: 'Logged Out',
                text1Style: {
                    fontSize: 18
                },
                text2: `You are Logged Out`,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text1Style: {
                    fontSize: 18
                },
                text2: String(error),
            });
        }
    };

    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => {
                    return (
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <DrawerItemList {...props} />
                                <View>
                                    <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
                                        <MaterialIcons name="logout" size={24} color="#FF6969" />
                                        <Text style={styles.logoutButtonText}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    )
                }}
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#F0ECE5',
                        width: 250
                    },
                    headerStyle: {
                        backgroundColor: 'white'
                    },
                    headerTintColor: 'black',
                    headerTitleStyle: {
                        fontFamily: 'Custom',

                    },
                    drawerActiveTintColor: '#FF6969',
                    drawerLabelStyle: {
                        color: '#111',
                        fontFamily: 'Custom',
                        fontWeight: 'bold',
                        fontSize: 16
                    }
                }}>
                <Drawer.Screen
                    name='Go'
                    options={{
                        drawerLabel: 'Go',
                        title: 'Go',
                    }}
                    initialParams={{ role: role }}
                    component={Go}
                />
                <Drawer.Screen
                    name='Pooling'
                    options={{
                        drawerLabel: 'Pooling',
                        title: 'Pooling',
                    }}
                    component={Pooling}
                />
                <Drawer.Screen
                    name='Sharing'
                    options={{
                        drawerLabel: 'Sharing',
                        title: 'Sharing',
                    }}
                    component={Sharing}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc'
    },
    logoutButtonText: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FF6969',
    },
});
