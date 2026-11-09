import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { API_BASE_URL } from '../../config/api';

const INITIAL_USERS = [
  { id: 1, username: 'admin', fullName: 'Quản Trị Pam Coffee', email: 'admin@pamcoffeetea.com', role: 'ROLE_ADMIN', phone: '0901234567', locked: false },
  { id: 2, username: 'customer', fullName: 'Nguyễn Khách Hàng', email: 'khachhang@gmail.com', role: 'ROLE_CUSTOMER', phone: '0988776655', locked: false },
  { id: 3, username: 'staff', fullName: 'Nhân Viên Pam Coffee', email: 'nhanvien@pamcoffeetea.com', role: 'ROLE_STAFF', phone: '0911223344', locked: false },
  { id: 4, username: 'vip_user', fullName: 'Lê Hoàng Khách VIP', email: 'vip@pamcoffeetea.com', role: 'ROLE_CUSTOMER', phone: '0933445566', locked: false }
];

export default function AdminUsersView() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Form
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('ROLE_STAFF');

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        }
      }
    } catch (e) {}
  };

  const handleToggleLock = async (userItem) => {
    const updatedLocked = !userItem.locked;
    setUsers(prev => prev.map(u => u.id === userItem.id ? { ...u, locked: updatedLocked } : u));

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/users/${userItem.id}/lock?lock=${updatedLocked}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {}
    }

    Alert.alert('Thành công', updatedLocked ? `Đã khóa tài khoản ${userItem.username}` : `Đã mở khóa tài khoản ${userItem.username}`);
  };

  const handleAddUser = async () => {
    if (!newUsername.trim() || !newEmail.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và email');
      return;
    }

    const newUser = {
      id: Date.now(),
      username: newUsername.trim(),
      fullName: newFullName.trim() || newUsername.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole,
      locked: false
    };

    setUsers(prev => [newUser, ...prev]);
    setModalVisible(false);
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newUser)
        });
      } catch (e) {}
    }

    Alert.alert('Thành công', 'Đã thêm tài khoản mới vào hệ thống');
  };

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return !search ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q));
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Quản Lý Tài Khoản</Text>
          <Text style={styles.subtitle}>[MVP] Tổng cộng {users.length} tài khoản trong hệ thống</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="person-add" size={16} color="#fff" />
          <Text style={styles.addBtnText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên, email, tên đăng nhập..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filteredUsers.map(userItem => {
          const roleClean = (userItem.role || '').replace('ROLE_', '');
          return (
            <View key={userItem.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.userMain}>
                  <Text style={styles.userName}>{userItem.fullName || userItem.username}</Text>
                  <Text style={styles.userEmail}>{userItem.email} • {userItem.phone || 'Chưa có SĐT'}</Text>
                </View>

                <View style={[styles.roleBadge, roleClean === 'ADMIN' ? styles.adminBadge : roleClean === 'STAFF' ? styles.staffBadge : styles.customerBadge]}>
                  <Text style={styles.roleText}>{roleClean}</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <Text style={styles.statusText}>
                  Trạng thái: <Text style={{ color: userItem.locked ? colors.danger : colors.success, fontWeight: '700' }}>
                    {userItem.locked ? '🔒 Đã bị khóa' : '🟢 Đang hoạt động'}
                  </Text>
                </Text>

                <TouchableOpacity
                  style={[styles.lockBtn, userItem.locked ? styles.unlockBtn : styles.lockBtnDanger]}
                  onPress={() => handleToggleLock(userItem)}
                >
                  <Ionicons name={userItem.locked ? 'lock-open-outline' : 'lock-closed-outline'} size={14} color="#fff" />
                  <Text style={styles.lockBtnText}>{userItem.locked ? 'Mở Khóa' : 'Khóa Nick'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add User Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Tài Khoản Mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tên đăng nhập *</Text>
              <TextInput
                style={styles.input}
                placeholder="vd: nhanvien_thu_ngan"
                value={newUsername}
                onChangeText={setNewUsername}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                placeholder="vd: Trần Thu Ngân"
                value={newFullName}
                onChangeText={setNewFullName}
              />

              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="vd: thungan@pamcoffeetea.com"
                value={newEmail}
                onChangeText={setNewEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                placeholder="0912345678"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Phân quyền vai trò:</Text>
              <View style={styles.rolePickerRow}>
                {[
                  { key: 'ROLE_STAFF', label: 'Nhân viên (STAFF)' },
                  { key: 'ROLE_ADMIN', label: 'Quản trị (ADMIN)' },
                  { key: 'ROLE_CUSTOMER', label: 'Khách hàng' }
                ].map(r => (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.rolePill, newRole === r.key && styles.rolePillActive]}
                    onPress={() => setNewRole(r.key)}
                  >
                    <Text style={[styles.rolePillText, newRole === r.key && styles.rolePillTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleAddUser}>
                <Text style={styles.saveBtnText}>Tạo Tài Khoản</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  searchSection: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userMain: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  adminBadge: {
    backgroundColor: '#fef3c7',
  },
  staffBadge: {
    backgroundColor: '#e0f2fe',
  },
  customerBadge: {
    backgroundColor: '#f5f5f4',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
    paddingTop: 10,
  },
  statusText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  lockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  lockBtnDanger: {
    backgroundColor: colors.danger,
  },
  unlockBtn: {
    backgroundColor: colors.success,
  },
  lockBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  modalBody: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  rolePickerRow: {
    gap: 6,
  },
  rolePill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rolePillActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  rolePillTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

