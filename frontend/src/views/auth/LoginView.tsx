import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows, touchTarget } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { AuthPresenter, AuthViewInterface } from '../../presenters/AuthPresenter';
import { useAppDispatch } from '../../store';
import { setUser } from '../../store/slices/authSlice';
import { User } from '../../types';

interface LoginViewProps {
  navigation: any;
}

export const LoginView: React.FC<LoginViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('khachhang');
  const [password, setPassword] = useState('user123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const viewCallbacks: AuthViewInterface = {
    showLoading: (l) => setLoading(l),
    showError: (msg) => Alert.alert('Thông báo', msg),
    onLoginSuccess: (user: User) => {
      dispatch(setUser(user));
      if (user.role === 'ROLE_ADMIN') {
        navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] });
      }
    },
    onRegisterSuccess: () => {},
  };

  const presenter = new AuthPresenter(viewCallbacks);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeInView style={styles.headerBlock}>
          <View style={styles.badgeWrap}>
            <Ionicons name="cafe" size={24} color={colors.primary} />
            <Text style={styles.badgeText}>PAM COFFEE & TEA</Text>
          </View>
          <Text style={styles.mainTitle}>Chào mừng trở lại</Text>
          <Text style={styles.subTitle}>
            Không gian thưởng thức cà phê đặc sản và trà hảo hạng
          </Text>
        </FadeInView>

        <FadeInView delay={100} style={styles.formCard}>
          <Text style={styles.inputLabel}>Tên đăng nhập / Số điện thoại</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập username (vd: khachhang, admin)"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.lg }]}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
            />
            <AnimatedScaleButton
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </AnimatedScaleButton>
          </View>

          <AnimatedScaleButton
            onPress={() => presenter.handleLogin(username, password)}
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <Text style={styles.submitBtnText}>Đăng Nhập Ngay</Text>
            )}
          </AnimatedScaleButton>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC TRẢI NGHIỆM NHANH</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.quickLoginRow}>
            <AnimatedScaleButton
              onPress={() => presenter.quickDemoLogin('customer')}
              style={[styles.quickBtn, styles.quickCustomerBtn]}
            >
              <Ionicons name="person" size={16} color={colors.primaryDark} />
              <Text style={styles.quickBtnCustomerText}>Khách Demo</Text>
            </AnimatedScaleButton>

            <AnimatedScaleButton
              onPress={() => presenter.quickDemoLogin('admin')}
              style={[styles.quickBtn, styles.quickAdminBtn]}
            >
              <Ionicons name="shield-checkmark" size={16} color={colors.textInverse} />
              <Text style={styles.quickBtnAdminText}>Quản Trị Demo</Text>
            </AnimatedScaleButton>
          </View>
        </FadeInView>

        <View style={styles.registerFooter}>
          <Text style={styles.footerText}>Chưa có tài khoản?</Text>
          <AnimatedScaleButton
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>Đăng ký ngay</Text>
          </AnimatedScaleButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.overline,
    marginLeft: spacing.xs,
  },
  mainTitle: {
    ...typography.display,
    textAlign: 'center',
  },
  subTitle: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 280,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...shadows.medium,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: spacing.xs,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    ...shadows.soft,
  },
  submitBtnText: {
    ...typography.bodyLarge,
    color: colors.textInverse,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  quickLoginRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  quickCustomerBtn: {
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.2)',
  },
  quickAdminBtn: {
    backgroundColor: colors.espresso,
  },
  quickBtnCustomerText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  quickBtnAdminText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
  registerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  footerText: {
    ...typography.body,
  },
  registerLink: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  registerLinkText: {
    ...typography.bodyLarge,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});

export default LoginView;

