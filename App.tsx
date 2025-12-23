import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthenticatorScreen from './src/screens/AuthenticatorScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Authenticator"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Authenticator" component={AuthenticatorScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

export default App;