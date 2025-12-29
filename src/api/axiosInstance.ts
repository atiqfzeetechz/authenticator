
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "https://backend.authenticator.fzeetechz.com/"; 
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response) {
      // Backend responded with status code
      console.log("API Error:", error.response.data);

      if (error.response.status === 401) {
        // 🔐 Token expired / invalid
        await AsyncStorage.removeItem("token");
        // Optional: navigate to login
      }
    } else {
      console.log("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;