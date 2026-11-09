import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

export default function ProfileView({ navigation }) {
  const { user, isStaff, isAdmin, logout, quickLogin } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Đăng Xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng Xuất', style: 'destructive', onPress: logout }
      ]
    );
  };

  const getRoleLabel = (role) => {
    if (role === 'ADMIN') return 'Quản Trị Viên';
    if (role === 'STAFF') return 'Nhân Viên Quán';
    return 'Khách Hàng Thân Thiết';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.fullName || user?.username || 'KH').substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName || user?.username || 'Khách Hàng'}</Text>
        <Text style={styles.email}>{user?.email || 'customer@gmail.com'}</Text>

        <View style={styles.roleBadge}>
          <Ionicons
            name={isAdmin ? 'shield' : isStaff ? 'briefcase' : 'cafe'}
            size={14}
            color={colors.primaryDark}
          />
          <Text style={styles.roleText}>{getRoleLabel(user?.role)}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Switch to Admin if user has permission */}
        {isStaff && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Chế Độ Quản Trị</Text>
            <TouchableOpacity
              style={styles.adminActionBtn}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <View style={styles.btnLeft}>
                <View style={[styles.iconSquare, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="speedometer" size={20} color="#b45309" />
                </View>
                <View>
                  <Text style={styles.btnLabel}>Bảng Điều Khiển Quản Trị</Text>
                  <Text style={styles.btnSub}>Duyệt đặt bàn, quản lý sơ đồ bàn, menu & user</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Role Switcher for Testing */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Chuyển Tài Khoản Demo (Kiến Trúc MVP)</Text>
          <Text style={styles.sectionSubTitle}>
            Dành cho giảng viên và hội đồng kiểm thử nhanh các phân quyền:
          </Text>

          <View style={styles.quickRolesRow}>
            <TouchableOpacity
              style={[styles.roleSelectBtn, user?.role === 'ADMIN' && styles.roleSelectBtnActive]}
              onPress={() => quickLogin('ADMIN')}
            >
              <Text style={styles.roleSelectBtnText}>👑 Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleSelectBtn, user?.role === 'STAFF' && styles.roleSelectBtnActive]}
              onPress={() => quickLogin('STAFF')}
            >
              <Text style={styles.roleSelectBtnText}>💼 Nhân viên</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleSelectBtn, user?.role === 'CUSTOMER' && styles.roleSelectBtnActive]}
              onPress={() => quickLogin('CUSTOMER')}
            >
              <Text style={styles.roleSelectBtnText}>☕ Khách hàng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Coffee Shop Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Thông Tin Pam Coffee & Tea</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.textMuted} />
            <Text style={styles.infoText}>Địa chỉ: Pam Coffee & Tea, Khuôn viên ĐH KTPM</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={colors.textMuted} />
            <Text style={styles.infoText}>Giờ mở cửa: 07:00 - 22:30 mỗi ngày</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="wifi-outline" size={18} color={colors.textMuted} />
            <Text style={styles.infoText}>Wifi: Pam Coffee 5G (Pass: pamcoffee2026)</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={colors.textMuted} />
            <Text style={styles.infoText}>Hotline hỗ trợ: 0901.234.567</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Đăng Xuất Tài Khoản</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    backgroundColor: colors.card,
    paddingTop: 30,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySubtle,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 6,
    marginTop: 10,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  contentContainer: {
    padding: 16,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  adminActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  btnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  btnSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  quickRolesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleSelectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleSelectBtnActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  roleSelectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#fca5a5',
    gap: 8,
    marginTop: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
});

