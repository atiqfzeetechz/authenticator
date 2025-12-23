import { IconProps } from "@ui-kitten/components";
import { ReactNode } from "react";
import { ViewStyle } from "react-native";


// ---------auth context types---------------

export interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User, tokenValue: string, k) => void;
  logout: () => void;
  currentScreen: any;
  setCurrentScreen: Function
}

export interface AuthProviderProps {
  children: ReactNode;
}

// ----------------icons  interface-------------
export interface AppIconProps extends Partial<IconProps> {
  name: string;          // Icon name from Eva Icons
  size?: number;          // Width & Height
  color?: string;         // Fill color
  style?: ViewStyle;      // Additional styles
}

// ------loader context------------

export interface LoaderContextType {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
  loaderMessage: string;
}