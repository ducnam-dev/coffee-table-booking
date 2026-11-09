import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { AuthPresenter } from '../../presenters/AuthPresenter';
import { colors } from '../../theme/colors';

export default function LoginView({ navigation }) {
  const { onAuthSuccess } = useContext(AuthContext);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Passive View Contract Implementation
  const viewContract = useMemo(() => ({
    showLoading: (isLoading) => setLoading(isLoading),
    showError: (msg) => setErrorMessage(msg),
    clearError: () => setErrorMessage(''),
    onLoginSuccess: (user, token) => {
      onAuthSuccess(user, token);
    }
  }), [onAuthSuccess]);

  // MVP Presenter Instance
  const presenter = useMemo(() => new AuthPresenter(viewContract), [viewContract]);

  const handleLogin = () => {
    presenter.login(usernameOrEmail, password);
  };

  const handleQuickLogin = (role) => {
    presenter.quickLogin(role);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.brandTitle}>
            Pam Coffee <Text style={{ color: colors.primary }}>& Tea</Text>
          </Text>
          <Text style={styles.welcomeTitle}>Chào Mừng Trở Lại</Text>
          <Text style={styles.subtitle}>
            [Kiến Trúc MVP] Đăng nhập tài khoản để đặt trước chỗ ngồi ưng ý
          </Text>
        </View>

        <View style={styles.card}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Input Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên đăng nhập hoặc Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="ten_dang_nhap hoặc email@gmail.com"
                placeholderTextColor={colors.textLight}
                value={usernameOrEmail}
                onChangeText={setUsernameOrEmail}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Input Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.8 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Đăng Nhập Ngay</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.noAccountText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Quick Logins */}
        <View style={styles.quickLoginSection}>
          <Text style={styles.quickLoginTitle}>— ĐĂNG NHẬP NHANH THỬ NGHIỆM —</Text>
          <View style={styles.quickBtnGroup}>
            <TouchableOpacity
              style={[styles.quickBtn, { borderColor: '#d97706', backgroundColor: '#fef3c7' }]}
              onPress={() => handleQuickLogin('ADMIN')}
            >
              <Text style={[styles.quickBtnText, { color: '#b45309' }]}>👑 Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, { borderColor: '#0284c7', backgroundColor: '#e0f2fe' }]}
              onPress={() => handleQuickLogin('STAFF')}
            >
              <Text style={[styles.quickBtnText, { color: '#0369a1' }]}>💼 Nhân viên</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, { borderColor: '#10b981', backgroundColor: '#ecfdf5' }]}
              onPress={() => handleQuickLogin('CUSTOMER')}
            >
              <Text style={[styles.quickBtnText, { color: '#047857' }]}>☕ Khách hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  noAccountText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  quickLoginSection: {
    marginTop: 32,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  quickLoginTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  quickBtnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

