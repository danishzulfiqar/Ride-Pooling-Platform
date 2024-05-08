import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { auth } from './firebase';
import { useFonts } from 'expo-font';
import SignIn from './screens/user/SignIn';
import SignInRider from './screens/rider/SignInRider';
import Intropage from './screens/intropage';
import Pickrole from './screens/role';
import Form from './screens/user/form';
import FormRider from './screens/rider/formRider';
import RiderCard from './components-user/ridercard';
import BottomSheet from './components-user/BottomSheetCards';
import DrawerNav from './screens/user/drawer-nav';
import Homescreen1 from './screens/homescreen1';
import MapsG from './maps';
import Go from './components-user/Go';
import Slider from './components-user/BottomSheetCards';
import Toast from 'react-native-toast-message';
import RiderOnWay from './components-user/on-way-rider';
import Home from './components-rider/home';
import DrawerNavRider from './screens/rider/drawerNavRider';



export default function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [getstarted, setgetstarted] = useState(false);
  const [role, setrole] = useState(0);
  const [haveaccount, sethaveaccount] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [loaded] = useFonts({
    Mono: require('./assets/fonts/Monospace.ttf'),
    MonoB: require('./assets/fonts/MonospaceBold.ttf'),
    Oswald: require('./assets/fonts/Oswald-Bold.ttf'),
    Custom: require('./assets/fonts/UberMoveMedium.ttf'),
    CustomB: require('./assets/fonts/UberMoveBold.ttf')
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        Toast.show({
          type: 'info',
          text1: 'Logged-In',
          text1Style: {
            fontSize: 18
          },
          text2: `You are logged ${user.phoneNumber}`,
        });
      } else {
        setCurrentUser(null);
        console.log('No User found');
        setgetstarted(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  if (!loaded) {
    return null;
  }

  console.log('currentUser', currentUser?.uid)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {getstarted ? (
          role === 0 ? (<Pickrole getvalue={setrole} backbutton={setgetstarted} />)
            : role === 'rider' ? (haveaccount ? (currentUser ? (<DrawerNavRider setrole={setrole}/>) : (<SignInRider user={currentUser} setUser={setCurrentUser} backbutton={setrole} role={role} sethaveaccount={sethaveaccount} />))
              : (<FormRider backbutton={sethaveaccount} currentUser={currentUser} sethaveaccount={sethaveaccount} />))
              : role === 'user' ? (haveaccount ? (currentUser ? (<DrawerNav setrole={setrole}/>) : (<SignIn user={currentUser} setUser={setCurrentUser} backbutton={setrole} role={role} sethaveaccount={sethaveaccount} />))
                : (<Form backbutton={setrole} currentUser={currentUser} sethaveaccount={sethaveaccount} />))
                : null)
          : (<Intropage begin={setgetstarted} />)}
      </View>
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
