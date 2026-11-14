import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { useResponsive } from '../../theme/responsive';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { UserModel } from '../../models/UserModel';

interface ProfileViewProps {
  navigation: any;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    Alert.alert('Đăng Xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => {
          await UserModel.logout();
          dispatch(logout());
          // Navigator sẽ tự động chuyển về Login khi isAuthenticated = false
        },
      },
    ]);
  };

  const handleSwitchToManager = () => {
    const isManager = user?.role === 'ROLE_MANAGER' || user?.role === 'ROLE_ADMIN';
    if (isManager) {
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert(
        'Quyền Truy Cập',
        'Tài khoản hiện tại là Khách Hàng (Customer). Bạn có muốn chuyển sang giao diện Quản Lý (Manager Demo) không?',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Chuyển Sang Quản Lý',
            onPress: async () => {
              const managerUser = await UserModel.login('manager', 'manager');
              dispatch({ type: 'auth/setUser', payload: managerUser });
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scroll,
        {
          paddingHorizontal: responsive.horizontalPadding,
          paddingTop: Math.max(insets.top, 16) + spacing.xs,
          paddingBottom: 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header Card */}
      <FadeInView>
        <BentoCard variant="dark" padding="xl" style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'P'}
              </Text>
            </View>
            <View style={styles.nameCol}>
              <Text style={styles.fullName}>{user?.fullName || 'Khách Hàng'}</Text>
              <Text style={styles.username}>@{user?.username || 'khachhang'}</Text>
              <Badge
                label={user?.role === 'ROLE_MANAGER' || user?.role === 'ROLE_ADMIN' ? 'Quản Lý Quán' : 'Khách Thân Thiết'}
                variant="amber"
                style={styles.roleBadge}
              />
            </View>
          </View>
        </BentoCard>
      </FadeInView>

      {/* Account Info Group */}
      <FadeInView delay={100} style={styles.sectionWrap}>
        <Text style={styles.sectionTitle}>Thông Tin Tài Khoản</Text>
        <BentoCard variant="elevated" padding="md">
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
              {user?.email || 'customer@pamcoffee.vn'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Điện thoại:</Text>
            <Text style={styles.infoValue}>{user?.phone || '0987 654 321'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="ribbon-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Điểm tích lũy:</Text>
            <Text style={[styles.infoValue, { color: colors.primaryDark, fontWeight: '800' }]}>
              450 điểm
            </Text>
          </View>
        </BentoCard>
      </FadeInView>

      {/* App Quick Links */}
      <FadeInView delay={180} style={styles.sectionWrap}>
        <Text style={styles.sectionTitle}>Quản Lý & Tiện Ích</Text>
        <BentoCard variant="elevated" padding="sm">
          <AnimatedScaleButton
            onPress={() => navigation.navigate('MyBookings')}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Lịch sử đặt bàn của tôi</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </AnimatedScaleButton>

          <View style={styles.divider} />

          <AnimatedScaleButton
            onPress={() => navigation.navigate('Notifications')}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Thông báo & Khuyến mãi</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </AnimatedScaleButton>

          <View style={styles.divider} />

          <AnimatedScaleButton
            onPress={() => navigation.navigate('Favorites')}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="heart-outline" size={20} color={colors.danger} />
              <Text style={styles.menuItemText}>Sản phẩm yêu thích & Gợi ý</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </AnimatedScaleButton>

          <View style={styles.divider} />

          <AnimatedScaleButton
            onPress={() => navigation.navigate('AICoffeeAssistant')}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Trợ lý Pam AI tư vấn món</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </AnimatedScaleButton>

          <View style={styles.divider} />

          {/* Switch to Manager Mode */}
          <AnimatedScaleButton onPress={handleSwitchToManager} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.espresso} />
              <Text style={[styles.menuItemText, { fontWeight: '700' }]}>
                {user?.role === 'ROLE_MANAGER' || user?.role === 'ROLE_ADMIN' ? 'Mở Dashboard Quản Lý' : 'Chế Độ Quản Lý (Manager)'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </AnimatedScaleButton>
        </BentoCard>
      </FadeInView>

      {/* Logout Button */}
      <FadeInView delay={240}>
        <AnimatedScaleButton onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutBtnText}>Đăng Xuất Tài Khoản</Text>
        </AnimatedScaleButton>
      </FadeInView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  profileCard: {
    marginBottom: spacing.xl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.display,
    color: colors.textInverse,
    fontWeight: '800',
  },
  nameCol: {
    flex: 1,
  },
  fullName: {
    ...typography.h2,
    color: colors.textInverse,
  },
  username: {
    ...typography.bodySmall,
    color: colors.textInverseMuted,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: spacing.xs,
  },
  sectionWrap: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    width: 80,
  },
  infoValue: {
    ...typography.body,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuItemText: {
    ...typography.bodyLarge,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSubtle,
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  logoutBtnText: {
    ...typography.bodyLarge,
    color: colors.danger,
    fontWeight: '700',
  },
});

export default ProfileView;

