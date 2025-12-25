import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import api from "../api/axiosInstance";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "986130014906-avkmj0at29rm00kmdltpskmh2t58k36d.apps.googleusercontent.com",
    androidClientId: "986130014906-t3bu0m7iepiheokemsarcalcvv4j3dtl.apps.googleusercontent.com",
    selectAccount: true,
    redirectUri: "https://authenticator-9efd6.firebaseapp.com",
  });




  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (!id_token) {
        console.log("No id_token received");
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithFirebase(credential);
    }
  }, [response]);

  const signInWithFirebase = async (credential: any) => {
    try {
      const userCred = await signInWithCredential(auth, credential);
      const firebaseToken = await userCred.user.getIdToken();
      
      const userData = {
        // uid: userCred.user.uid,
        // email: userCred.user.email,
        // name: userCred.user.displayName,
        // photo: userCred.user.photoURL,
        token: firebaseToken
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Send to backend
      await saveToBackend(userData);
      
      Alert.alert("Login Success", `Welcome ${userCred.user.displayName}`);
      
      // Navigate to home screen
      router.replace('/');
    } catch (err) {
      console.error("Firebase Google Login Error", err);
      Alert.alert("Login Failed", "Please try again");
    }
  };

  const saveToBackend = async (userData: any) => {
    try {
      const response = await api.post('/api/auth/login/google', {
        // uid: userData.uid,
        // email: userData.email,
        // name: userData.name,
        // photo: userData.photo,
        firebase_token: userData.token
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        }
      });
      
      console.log('Backend response:', response.data);
      
      // Save backend token if provided
      if (response.data.access_token) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
      }
    } catch (error) {
      console.error('Backend save error:', error);
      // Continue even if backend fails
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      disabled={!request}
      onPress={() => promptAsync()}
    >
      <View style={styles.buttonContent}>
        <Ionicons name="logo-google" size={20} color="#fff" />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1a73e8",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
});