import React, { useState, useContext } from 'react';
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
import { CoffeeContext } from '../../context/CoffeeContext';
import { colors } from '../../theme/colors';

export default function AdminTablesView() {
  const { tables, addTable, updateTableStatus, deleteTable } = useContext(CoffeeContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');
  const [newTableType, setNewTableType] = useState('Phòng lạnh');
  const [isNearWindow, setIsNearWindow] = useState(false);
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [hasSocket, setHasSocket] = useState(true);

  const handleSaveNewTable = () => {
    if (!newTableName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên bàn');
      return;
    }

    addTable({
      name: newTableName.trim(),
      seats: Number(newTableSeats) || 2,
      type: newTableType,
      isNearWindow,
      isOutdoor,
      hasSocket
    });

    setModalVisible(false);
    setNewTableName('');
    setNewTableSeats('4');
    Alert.alert('Thành công', 'Đã thêm bàn mới vào hệ thống');
  };

  const handleDelete = (table) => {
    Alert.alert(
      'Xóa Bàn',
      `Bạn có chắc chắn muốn xóa "${table.name}" khỏi hệ thống?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa Vĩnh Viễn', style: 'destructive', onPress: () => deleteTable(table.id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Quản Lý Bàn Quán</Text>
          <Text style={styles.subtitle}>[MVP] Tổng cộng {tables.length} bàn trong sơ đồ</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Thêm Bàn</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {tables.map(table => (
          <View key={table.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.tableName}>{table.name}</Text>
                <Text style={styles.tableInfo}>
                  👥 {table.seats} chỗ • Loại: {table.type}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(table)}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>

            <Text style={styles.statusLabel}>Trạng thái bàn hiện tại:</Text>
            <View style={styles.statusButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  table.status === 'AVAILABLE' && { backgroundColor: colors.success, borderColor: colors.success }
                ]}
                onPress={() => updateTableStatus(table.id, 'AVAILABLE')}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    table.status === 'AVAILABLE' && { color: '#fff' }
                  ]}
                >
                  🟢 Trống
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  table.status === 'RESERVED' && { backgroundColor: colors.warning, borderColor: colors.warning }
                ]}
                onPress={() => updateTableStatus(table.id, 'RESERVED')}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    table.status === 'RESERVED' && { color: '#fff' }
                  ]}
                >
                  🟡 Đã đặt
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  table.status === 'OCCUPIED' && { backgroundColor: colors.danger, borderColor: colors.danger }
                ]}
                onPress={() => updateTableStatus(table.id, 'OCCUPIED')}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    table.status === 'OCCUPIED' && { color: '#fff' }
                  ]}
                >
                  🔴 Đang dùng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Bàn Mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tên bàn / Ký hiệu *</Text>
              <TextInput
                style={styles.input}
                placeholder="vd: Bàn 07 (Cửa sổ)"
                value={newTableName}
                onChangeText={setNewTableName}
              />

              <Text style={styles.inputLabel}>Số lượng ghế *</Text>
              <TextInput
                style={styles.input}
                placeholder="vd: 4"
                keyboardType="numeric"
                value={newTableSeats}
                onChangeText={setNewTableSeats}
              />

              <Text style={styles.inputLabel}>Khu vực bàn:</Text>
              <View style={styles.typeRow}>
                {['Phòng lạnh', 'Sân vườn', 'Cặp đôi', 'Gác lửng'].map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typePill, newTableType === t && styles.typePillActive]}
                    onPress={() => setNewTableType(t)}
                  >
                    <Text style={[styles.typePillText, newTableType === t && styles.typePillTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setIsNearWindow(!isNearWindow)}
              >
                <Ionicons
                  name={isNearWindow ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.checkLabel}>Bàn đặt gần cửa sổ kính</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setHasSocket(!hasSocket)}
              >
                <Ionicons
                  name={hasSocket ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.checkLabel}>Trang bị ổ cắm điện laptop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveNewTable}
              >
                <Text style={styles.saveBtnText}>Lưu & Thêm Bàn</Text>
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tableName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  tableInfo: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
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
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  typePillText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  typePillTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkLabel: {
    fontSize: 13,
    color: colors.text,
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

