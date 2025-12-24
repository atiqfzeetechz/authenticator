import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAf-xKjNCO8wczej_GHxARLIcPq2aCaet4",
  authDomain: "authenticator-9efd6.firebaseapp.com",
  projectId: "authenticator-9efd6",
  storageBucket: "authenticator-9efd6.firebasestorage.app",
  messagingSenderId: "986130014906",
  appId: "1:986130014906:android:0881a66277e9be4ff99883",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
