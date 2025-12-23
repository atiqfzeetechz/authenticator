// src/components/Header.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "../../assets/colors";
import AppIcon from "../../assets/icons";

interface HeaderProps {
  title?: string;
  onBack?: () => void;       // Back button press
  showBackButton?: boolean;
  backButtonColor?: string;  // Show back button
  backgroundColor?: string;

  HeaderRight?: React.ReactNode; // Optional right component
  HeaderLeft?: React.ReactNode;  // Add HeaderLeft prop
}

const Header: React.FC<HeaderProps> = ({
  title = "",
  onBack,
  showBackButton = false,
  backButtonColor = Colors.textPrimary,
  backgroundColor = Colors.background,
  HeaderRight = null,
  HeaderLeft = null, // Add HeaderLeft with default value
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.left}>
        {/* Show HeaderLeft if provided, otherwise show back button */}
        {HeaderLeft ? (
          HeaderLeft
        ) : (
          showBackButton && onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <AppIcon name="arrow-ios-back-outline"  color={backButtonColor}/>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>{HeaderRight}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: {
    minWidth: 50,
    alignItems: "flex-start",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  right: {
    minWidth: 50,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textLight,
    textAlign: "center",
  },
  backButton: {
    padding: 4,
  },
});