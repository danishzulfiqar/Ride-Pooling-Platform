import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import NavigationScreen from './screens/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default function App() {
  
  const [fontsLoaded] = useFonts({
    'custom': require('./assets/fonts/UberMoveMedium.ttf'),
    'customb': require('./assets/fonts/UberMoveBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationScreen />
        <StatusBar style='auto' backgroundColor='lightgrey'/>
        <Toast />
      </PersistGate>
    </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});