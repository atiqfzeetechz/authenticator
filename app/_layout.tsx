import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/src/context/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Camera } from 'expo-camera';
import crashlytics from '@react-native-firebase/crashlytics';
import {checkForInAppUpdate} from '../src/utils/appUpdateFun'

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    RobotoMedium: require('../assets/fonts/RobotoCondensed-Medium.ttf'),
    'RobotoCondensed-Light': require('../assets/fonts/RobotoCondensed-Light.ttf'),
    'RobotoCondensed-SemiBold': require('../assets/fonts/RobotoCondensed-SemiBold.ttf'),
  });

  // Camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        crashlytics().log('Camera permission denied');
      }
      checkForInAppUpdate()
    })();
  }, []);

  // Crashlytics init (SAFE)
  useEffect(() => {
    crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);

    crashlytics().log('🚀 App launched');

    crashlytics().setAttributes({
      platform: 'android',
      env: __DEV__ ? 'development' : 'production',
    });
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
