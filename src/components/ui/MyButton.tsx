import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  View,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { Colors } from '../../assets/colors';

// Button Variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
// Button Sizes
export type ButtonSize = 'small' | 'medium' | 'large';
// Button Shapes
export type ButtonShape = 'rectangle' | 'rounded' | 'pill' | 'circle';

interface MyButtonProps extends TouchableOpacityProps {
  title?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  customContainerStyle?: ViewStyle;
  customTextStyle?: TextStyle;
  customLoadingColor?: string;
  withScaleAnimation?: boolean;
  withOpacityAnimation?: boolean;
}

const MyButton: React.FC<MyButtonProps> = ({
  title,
  children,
  variant = 'primary',
  size = 'medium',
  shape = 'rounded',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  customContainerStyle,
  customTextStyle,
  customLoadingColor,
  withScaleAnimation = true,
  withOpacityAnimation = true,
  onPress,
  style,
  activeOpacity = 0.8,
  ...rest
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (withScaleAnimation) {
      Animated.spring(scaleValue, { toValue: 0.97, useNativeDriver: true }).start();
    }
    if (withOpacityAnimation) {
      Animated.spring(opacityValue, { toValue: 0.85, useNativeDriver: true }).start();
    }
  };

  const handlePressOut = () => {
    if (withScaleAnimation) {
      Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
    }
    if (withOpacityAnimation) {
      Animated.spring(opacityValue, { toValue: 1, useNativeDriver: true }).start();
    }
  };

  const isDisabled = disabled || loading;

  // --- Styles Calculation ---
  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    };

    const sizeMap: Record<ButtonSize, ViewStyle> = {
      small: { 
        paddingHorizontal: iconOnly ? 12 : 16, 
        paddingVertical: 8,
        height: 36,
        minWidth: iconOnly ? 36 : 64,
      },
      medium: { 
        paddingHorizontal: iconOnly ? 16 : 24, 
        paddingVertical: 12,
        height: 48,
        minWidth: iconOnly ? 48 : 80,
      },
      large: { 
        paddingHorizontal: iconOnly ? 20 : 32, 
        paddingVertical: 16,
        height: 56,
        minWidth: iconOnly ? 56 : 100,
      },
    };

    const shapeMap: Record<ButtonShape, ViewStyle> = {
      rectangle: { borderRadius: 6 },
      rounded: { borderRadius: 12 },
      pill: { borderRadius: 28 },
      circle: { borderRadius: 1000 },
    };

    const variantMap: Record<ButtonVariant, ViewStyle> = {
      primary: { 
        backgroundColor: Colors.primary, 
        borderWidth: 0,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
      secondary: { 
        backgroundColor: Colors.secondary, 
        borderWidth: 0,
      },
      outline: { 
        backgroundColor: 'transparent', 
        borderWidth: 2, 
        borderColor: Colors.primary 
      },
      ghost: { 
        backgroundColor: 'transparent', 
        borderWidth: 0 
      },
      danger: { 
        backgroundColor: Colors.danger, 
        borderWidth: 0 
      },
    };

    const disabledStyle: ViewStyle = isDisabled
      ? {
          opacity: 0.6,
          backgroundColor:
            variant === 'outline' || variant === 'ghost' ? 'transparent' : Colors.disabled,
          borderColor: variant === 'outline' ? Colors.disabled : undefined,
          shadowOpacity: 0,
          elevation: 0,
        }
      : {};

    return [base, sizeMap[size], shapeMap[shape], variantMap[variant], disabledStyle, customContainerStyle];
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle = { 
      // fontWeight: '700', 
      fontFamily:"Poppins-SemiBold",
      textAlign: 'center',
      letterSpacing: 0.5,
    };

    const sizeMap: Record<ButtonSize, TextStyle> = {
      small: { fontSize: 14, lineHeight: 18 },
      medium: { fontSize: 16, lineHeight: 20 },
      large: { fontSize: 18, lineHeight: 22 },
    };

    const variantMap: Record<ButtonVariant, TextStyle> = {
      primary: { color: Colors.textLight },
      secondary: { color: Colors.textLight },
      outline: { color: Colors.primary },
      ghost: { color: Colors.primary },
      danger: { color: Colors.textLight },
    };

    const disabledStyle: TextStyle = isDisabled
      ? {
          color: variant === 'outline' || variant === 'ghost' ? Colors.disabled : Colors.textLight,
        }
      : {};

    return [base, sizeMap[size], variantMap[variant], disabledStyle, customTextStyle];
  };

  const getLoadingColor = (): string => {
    if (customLoadingColor) return customLoadingColor;
    const map: Record<ButtonVariant, string> = {
      primary: Colors.textLight,
      secondary: Colors.textLight,
      outline: Colors.primary,
      ghost: Colors.primary,
      danger: Colors.textLight,
    };
    return map[variant];
  };

  const animatedStyle = { transform: [{ scale: scaleValue }], opacity: opacityValue };

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={activeOpacity}
        style={[getContainerStyle(), style]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator size="small" color={getLoadingColor()} />
        ) : (
          <>
            {leftIcon && !iconOnly && <View style={styles.iconLeft}>{leftIcon}</View>}
            {!iconOnly && (
              <Text style={getTextStyle()} category="s1">
                {title || children}
              </Text>
            )}
            {rightIcon && !iconOnly && <View style={styles.iconRight}>{rightIcon}</View>}
            {iconOnly && children}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconLeft: { 
    marginRight: 8,
  },
  iconRight: { 
    marginLeft: 8,
  },
  fullWidth: {
    width: '100%',
  },
});

export default MyButton;