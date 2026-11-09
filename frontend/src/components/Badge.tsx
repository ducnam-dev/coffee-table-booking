import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/designTokens';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'amber' | 'espresso' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'amber', style, icon }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.successSubtle, text: colors.success };
      case 'warning':
        return { bg: colors.warningSubtle, text: colors.warning };
      case 'danger':
        return { bg: colors.dangerSubtle, text: colors.danger };
      case 'info':
        return { bg: colors.infoSubtle, text: colors.info };
      case 'espresso':
        return { bg: colors.espressoMedium, text: colors.textInverse };
      case 'neutral':
        return { bg: colors.surfaceSubtle, text: colors.textSecondary };
      case 'amber':
      default:
        return { bg: colors.primarySubtle, text: colors.primaryDark };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.text, { color: text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
});

export default Badge;
