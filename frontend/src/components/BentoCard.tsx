import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme/designTokens';

interface BentoCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'subtle' | 'dark' | 'amber';
  padding?: keyof typeof spacing;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  style,
  variant = 'elevated',
  padding = 'lg',
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding: spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    ...shadows.soft,
  },
  subtle: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
  },
  dark: {
    backgroundColor: colors.espressoDark,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...shadows.medium,
  },
  amber: {
    backgroundColor: colors.primarySubtle,
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
});

export default BentoCard;

