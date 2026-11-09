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
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { AuthPresenter, AuthViewInterface } from '../../presenters/AuthPresenter';
import { useAppDispatch } from '../../store';
import { setUser } from '../../store/slices/authSlice';
import { User } from '../../types';

interface RegisterViewProps {
  navigation: any;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const viewCallbacks: AuthViewInterface = {
    showLoading: (l) => setLoading(l),
    showError: (msg) => Alert.alert('Thông báo', msg),
    onLoginSuccess: () => {},
    onRegisterSuccess: (user: User) => {
      dispatch(setUser(user));
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
        {
          text: 'Bắt đầu',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] }),
        },
      ]);
    },
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
          <Text style={styles.mainTitle}>Tạo tài khoản mới</Text>
          <Text style={styles.subTitle}>
            Gia nhập cộng đồng thành viên Pam Coffee để nhận ưu đãi tích điểm
          </Text>
        </FadeInView>

        <FadeInView delay={100} style={styles.formCard}>
          <Text style={styles.inputLabel}>Họ và tên</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Vd: Nguyễn Văn A"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Tên đăng nhập</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="at-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Vd: nguyenvana"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Vd: a@gmail.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Số điện thoại</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Vd: 0901234567"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Xác nhận mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
          </View>

          <AnimatedScaleButton
            onPress={() =>
              presenter.handleRegister({
                fullName,
                username,
                email,
                phone,
                password,
                confirmPassword,
              })
            }
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <Text style={styles.submitBtnText}>Đăng Ký Tài Khoản</Text>
            )}
          </AnimatedScaleButton>
        </FadeInView>

        <View style={styles.loginFooter}>
          <Text style={styles.footerText}>Đã có tài khoản?</Text>
          <AnimatedScaleButton
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>Đăng nhập</Text>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  mainTitle: {
    ...typography.display,
    textAlign: 'center',
  },
  subTitle: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 290,
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
  loginFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
  },
  loginLink: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  loginLinkText: {
    ...typography.bodyLarge,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});

export default RegisterView;
