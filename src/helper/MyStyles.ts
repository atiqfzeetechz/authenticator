import { ViewStyle } from "react-native";
import { wp } from "./responsive";

type ContainerStyle = ViewStyle & {
  flex: number;
  justifyContent: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  alignItems: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
};

// Define container constant with type
export const container: ContainerStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  maxWidth:wp(100)
};