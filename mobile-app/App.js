import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { auth } from './firebase';
import SignIn from './screens/SignIn';
import Intropage from './screens/intropage';
import Pickrole from './screens/role';
import Form from './screens/form';
import RiderCard from './components/ridercard';
import BottomSheet from './components/BottomSheetCards';
import DrawerNav from './screens/drawer-nav';
import Homescreen1 from './screens/homescreen1';
import GoogleMaps from './googlemaps';
import MapsG  from './maps';
import Go from './components/Go';
import Slider from './components/BottomSheetCards';


export default function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [getstarted, setgetstarted] = useState(false);
  const [role, setrole] = useState(0);
  const [haveaccount, sethaveaccount] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
 

  console.log('currentUser', currentUser?.uid)

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log('User signed out');
      }
    })

  }, [currentUser])

  return (
    <GestureHandlerRootView style={{flex:1}}>
    <View style={styles.container}>
      {getstarted ? (
        role === 0 ? (<Pickrole getvalue={setrole} backbutton={setgetstarted} />) 
        : role === 'rider' ? ( haveaccount ? (currentUser ? (<DrawerNav />) : (<SignIn user={currentUser} setUser={setCurrentUser} backbutton={setrole} role={role} sethaveaccount= {sethaveaccount}/>)) 
        : (<Form backbutton={sethaveaccount} currentUser={currentUser} sethaveaccount= {sethaveaccount}/>)) 
        : role === 'user' ? ( haveaccount ? (currentUser ? (<DrawerNav />) : (<SignIn user={currentUser} setUser={setCurrentUser} backbutton={setrole} role={role} sethaveaccount= {sethaveaccount}/>)) 
        : (<Form backbutton={sethaveaccount} currentUser={currentUser} sethaveaccount= {sethaveaccount}/>)) 
        : null) 
        : (<Intropage begin={setgetstarted} />)}
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
