import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    responseType: "id_token",
    scopes: ["profile", "email"],
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

      console.log("Firebase Token:", firebaseToken);
      console.log("User Email:", userCred.user.email);

      Alert.alert("Login Success", `Welcome ${userCred.user.displayName}`);
    } catch (err) {
      console.error("Firebase Google Login Error", err);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      disabled={!request}
      onPress={() => promptAsync({ useProxy: true })}
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
