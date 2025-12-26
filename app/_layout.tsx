import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/src/context/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'RobotoCondensed-Regular': require('../assets/fonts/RobotoCondensed-Regular.ttf'),
    'RobotoCondensed-Bold': require('../assets/fonts/RobotoCondensed-Bold.ttf'),
    'RobotoCondensed-SemiBold': require('../assets/fonts/RobotoCondensed-SemiBold.ttf'),
    'RobotoCondensed-Medium': require('../assets/fonts/RobotoCondensed-Medium.ttf'),
  });

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