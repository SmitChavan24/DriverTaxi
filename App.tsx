import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LogBox} from 'react-native';
import Toast from 'react-native-toast-message';
import Mapbox from '@rnmapbox/maps';
import HomeScreen from './screens/Home/HomeScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import OtpScreen from './screens/Auth/OtpScreen';
import StartAuth from './screens/Auth/StartAuth';
import UserDetailsScreen from './screens/Auth/UserDetailsScreen';
import CompleteAuth from './screens/Auth/CompleteAuth';
import UploadDocs from './screens/Auth/UploadDocs';

Mapbox.setAccessToken(
  'pk.eyJ1IjoibWFudml0aDUwNyIsImEiOiJjbHk4YTl1ejEwaDg2MnFxcGN6dnBpYmxjIn0.MYmf_2NaYmcEnQHhQWjhFA',
);
const Stack = createNativeStackNavigator();
const App = () => {
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(['EventEmitter.removeListener']);
  LogBox.ignoreLogs(['Require cycle: node_modules/']);
  useEffect(() => {
    Mapbox.setTelemetryEnabled(false);
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        // iOS: Request location permissions
        return true;
      } catch (err) {
        console.warn(err);
        return false;
      }
    };
    requestLocationPermission();
    return () => {};
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}></Stack.Screen>
        <Stack.Screen name="LoginScreen" component={LoginScreen}></Stack.Screen>
        <Stack.Screen name="OtpScreen" component={OtpScreen}></Stack.Screen>
        <Stack.Screen name="StartAuth" component={StartAuth}></Stack.Screen>
        <Stack.Screen
          name="UserDetailsScreen"
          component={UserDetailsScreen}></Stack.Screen>
        <Stack.Screen
          name="CompleteAuth"
          component={CompleteAuth}></Stack.Screen>
        <Stack.Screen name="UploadDocs" component={UploadDocs}></Stack.Screen>
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
