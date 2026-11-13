import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import { touchTarget } from '../theme/designTokens';

interface AnimatedScaleButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  disabled?: boolean;
}

export const AnimatedScaleButton: React.FC<AnimatedScaleButtonProps> = ({
  onPress,
  children,
  style,
  scaleTo = 0.96,
  disabled = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: Platform.OS !== 'web',
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 25,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [styles.touchable, { opacity: disabled ? 0.5 : pressed ? 0.95 : 1 }]}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchable: {
    minHeight: touchTarget.minHeight,
    minWidth: touchTarget.minWidth,
    justifyContent: 'center',
  },
});

export default AnimatedScaleButton;

