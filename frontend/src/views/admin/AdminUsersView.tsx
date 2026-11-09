import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { User } from '../../types';

const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@pamcoffee.vn',
    fullName: 'Quản Trị Viên Pam',
    phone: '0901234567',
    role: 'ROLE_ADMIN',
    isActive: true,
  },
  {
    id: 2,
    username: 'khachhang',
    email: 'customer@pamcoffee.vn',
    fullName: 'Nguyễn Văn Khách',
    phone: '0987654321',
    role: 'ROLE_USER',
    isActive: true,
  },
  {
    id: 3,
    username: 'hoangnam',
    email: 'nam@gmail.com',
    fullName: 'Trần Hoàng Nam',
    phone: '0912345678',
    role: 'ROLE_USER',
    isActive: true,
  },
  {
    id: 4,
    username: 'thuhuong',
    email: 'huong@gmail.com',
    fullName: 'Lê Thu Hương',
    phone: '0933221100',
    role: 'ROLE_USER',
    isActive: false,
  },
];

export const AdminUsersView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const nextState = !u.isActive;
          Alert.alert(
            'Cập nhật tài khoản',
            `Tài khoản @${u.username} đã được ${nextState ? 'KÍCH HOẠT' : 'KHÓA TẠM THỜI'}`
          );
          return { ...u, isActive: nextState };
        }
        return u;
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Quản Lý Khách Hàng</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {users.map((u, i) => (
          <FadeInView key={u.id} delay={i * 30} style={styles.cardWrap}>
            <BentoCard variant="elevated" padding="md">
              <View style={styles.rowBetween}>
                <View style={styles.userRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{u.fullName.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.name}>{u.fullName}</Text>
                    <Text style={styles.username}>@{u.username} • {u.phone}</Text>
                  </View>
                </View>

                <Badge
                  label={u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'KHÁCH'}
                  variant={u.role === 'ROLE_ADMIN' ? 'espresso' : 'amber'}
                />
              </View>

              <View style={styles.actions}>
                <Badge
                  label={u.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                  variant={u.isActive ? 'success' : 'danger'}
                />

                {u.role !== 'ROLE_ADMIN' && (
                  <AnimatedScaleButton
                    onPress={() => toggleUserStatus(u.id)}
                    style={[
                      styles.actionBtn,
                      { backgroundColor: u.isActive ? colors.dangerSubtle : colors.successSubtle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        { color: u.isActive ? colors.danger : colors.success },
                      ]}
                    >
                      {u.isActive ? 'Khóa Tài Khoản' : 'Mở Khóa'}
                    </Text>
                  </AnimatedScaleButton>
                )}
              </View>
            </BentoCard>
          </FadeInView>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h2 },
  scroll: { padding: spacing.lg, paddingBottom: 60 },
  cardWrap: { marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.h3, color: colors.primaryDark, fontWeight: '800' },
  name: { ...typography.bodyLarge, fontWeight: '700' },
  username: { ...typography.caption, color: colors.textMuted },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { ...typography.caption, fontWeight: '700' },
});

export default AdminUsersView;

