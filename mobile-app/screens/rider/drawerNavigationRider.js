import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, BackHandler, Alert } from "react-native";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import { SetRole, SetUid, SetUserLocation, SetUserLocationCoords, SetPickupLocation, 
  SetPickupLocationCoords, SetDropoffLocation, SetDropoffLocationCoords, SetCurrentScreenGo, 
  SetNavigationPhase, SetRidePhaseKey } from '../../redux/action';
import auth from '@react-native-firebase/auth';
import { responsiveWidth, responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import { DrawerActions } from '@react-navigation/native';
import NavigationRider from "../../riderUI/navigationRider";

const Drawer = createDrawerNavigator();

export default function DrawerNavigationRider({navigation}) {
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      dispatch(SetUid(""));
      dispatch(SetRole(""));
      dispatch(SetUserLocation(null));
      dispatch(SetUserLocationCoords(null));
      dispatch(SetPickupLocation('Enter Pickup Location'));
      dispatch(SetPickupLocationCoords(null));
      dispatch(SetDropoffLocation('Enter Dropoff Location'));
      dispatch(SetDropoffLocationCoords(null));
      dispatch(SetCurrentScreenGo(null));
      dispatch(SetRidePhaseKey(null));
      dispatch(SetNavigationPhase(false));
      navigation.dispatch(DrawerActions.closeDrawer());
      Toast.show({
        type: "error",
        text1: "Logged Out",
        text1Style: {
          fontSize: 18,
          fontFamily:'custom'
        },
        text2: `You are Logged Out`,
      });
      navigation.replace("RoleScreen");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text1Style: {
          fontFamily:'custom',
          fontSize: 18,
        },
        text2: error.message,
      });
    }
  };


useEffect(() => {
  // Disable back button behavior
  const onBackPress = () => {
    Alert.alert('Exit', 'Are you sure you want to exit the app?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(), // Exit the app if needed
      },
    ]);
    return true; // Return true to stop the back action
  };

  BackHandler.addEventListener('hardwareBackPress', onBackPress);

  return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
}, []);


  return (
      <Drawer.Navigator
        drawerContent={(props) => {
          return (
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <DrawerItemList {...props} />
                <View style={{flex:1, justifyContent:'flex-end', marginBottom: responsiveHeight(1.5)}}>
                  <TouchableOpacity
                    onPress={handleSignOut}
                    style={styles.logoutButton}
                  >
                    <MaterialIcons name="logout" size={24} color="#FF6969" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          );
        }}
        screenOptions={{
          drawerStyle: {
            backgroundColor: "white",
            width: responsiveWidth(60),
          },
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "black",
          headerTitleStyle: {
            fontFamily: "custom",
          },
          drawerActiveTintColor: "#FF6969",
          drawerLabelStyle: {
            color: "#111",
            fontFamily: "customb",
            fontSize: responsiveFontSize(2.1),
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: "Home",
            headerStyle: {
                backgroundColor: 'white',},
            headerTitleStyle: {
                fontFamily: "customb",},
            headerTitleAlign: 'center',
          }}
          component={NavigationRider}
        />
      </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: responsiveHeight(2),
  },
  logoutButtonText: {
    marginLeft: responsiveWidth(1.2),
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.2),
    color: "#FF6969",
  },
});
