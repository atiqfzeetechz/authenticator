import React from "react";
import { Icon, IconProps } from "@ui-kitten/components";
import { StyleSheet, ViewStyle } from "react-native";
import { AppIconProps } from "../../helper/types";



const AppIcon: React.FC<AppIconProps> = ({ name, size = 32, color = "#8F9BB3", style, ...props }) => {
  return (
    <Icon
      {...props}
      style={[styles.icon, { width: size, height: size }, style]}
      fill={color}
      name={name}
    />
  );
};

export default AppIcon;

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
