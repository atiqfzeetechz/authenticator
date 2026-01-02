


import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/src/context/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Camera } from 'expo-camera';
import crashlytics from '@react-native-firebase/crashlytics';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    'RobotoMedium': require('../assets/fonts/RobotoCondensed-Medium.ttf'),
    'RobotoCondensed-Light': require('../assets/fonts/RobotoCondensed-Light.ttf'),
    'RobotoCondensed-SemiBold': require('../assets/fonts/RobotoCondensed-SemiBold.ttf'),
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.log('Camera permission denied');
      }
    })();
  }, []);


  useEffect(() => {
  crashlytics().log('App mounted - test crash hiii');

  setTimeout(() => {
    crashlytics().crash();
  }, 3000);
}, []);


  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
