import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../assets/colors';
import Icon from '../../assets/icons';

type AlerterProps = {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
};

export default function Alerter({ visible, title, message, type = 'success', onClose }: AlerterProps) {
  const slideAnim = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(onClose, 2500); // auto hide after 2.5s
      return () => clearTimeout(timer);
    } else {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const getColors = () => {
    switch (type) {
      case 'error':
        return { bg: '#fdecea', icon: 'close-circle-outline', color: '#d32f2f' };
      case 'warning':
        return { bg: '#fff4e5', icon: 'alert-circle-outline', color: '#ed6c02' };
      default:
        return { bg: '#e8f5e9', icon: 'checkmark-circle-outline', color: '#2e7d32' };
    }
  };

  const { bg, icon, color } = getColors();

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.alertBox, { backgroundColor: bg, borderLeftColor: color }]}>
        <Icon name={icon} size={24} color={color} style={styles.icon} />
        <View style={{ flex: 1 }}>
          {title ? <Text style={[styles.title, { color }]}>{title}</Text> : null}
          <Text style={[styles.message, { color }]}>{message}</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close-outline" size={22} color={color} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  message: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
});
