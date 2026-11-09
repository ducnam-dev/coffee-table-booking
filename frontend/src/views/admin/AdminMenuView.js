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
import { formatCurrency } from '../../config/api';

const CATEGORIES = ['Trà Sữa', 'Ca Cao', 'Sữa Tươi', 'Trà Trái Cây'];

export default function AdminMenuView() {
  const { menu, addMenuItem, toggleMenuAvailable, deleteMenuItem } = useContext(CoffeeContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('20000');
  const [category, setCategory] = useState('Trà Sữa');
  const [description, setDescription] = useState('');

  const handleSaveItem = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món');
      return;
    }

    addMenuItem({
      name: name.trim(),
      price: Number(price) || 15000,
      category,
      description: description.trim()
    });

    setModalVisible(false);
    setName('');
    setDescription('');
    Alert.alert('Thành công', 'Đã thêm món mới vào thực đơn quán');
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Xóa Món',
      `Bạn có chắc muốn xóa "${item.name}" khỏi thực đơn?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa Món', style: 'destructive', onPress: () => deleteMenuItem(item.id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Quản Lý Thực Đơn</Text>
          <Text style={styles.subtitle}>[MVP] Hiện có {menu.length} món trong danh mục</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Thêm Món</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {menu.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>
                  {item.category} • <Text style={{ color: colors.primaryDark, fontWeight: '700' }}>{formatCurrency(item.price)}</Text>
                </Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => toggleMenuAvailable(item.id)}>
                  <View style={[styles.stockPill, item.available !== false ? styles.stockPillIn : styles.stockPillOut]}>
                    <Text style={[styles.stockText, item.available !== false ? styles.stockTextIn : styles.stockTextOut]}>
                      {item.available !== false ? 'Còn hàng' : 'Hết hàng'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item)} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>

            {item.description ? (
              <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
            ) : null}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Món Mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tên món đồ uống *</Text>
              <TextInput
                style={styles.input}
                placeholder="vd: Trà Sữa Oolong Nướng"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Giá bán (VNĐ) *</Text>
              <TextInput
                style={styles.input}
                placeholder="vd: 25000"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />

              <Text style={styles.inputLabel}>Danh mục:</Text>
              <View style={styles.typeRow}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.typePill, category === c && styles.typePillActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.typePillText, category === c && styles.typePillTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Mô tả món:</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Hương vị, thành phần nguyên liệu..."
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveItem}>
                <Text style={styles.saveBtnText}>Lưu Vào Thực Đơn</Text>
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
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockPillIn: {
    backgroundColor: colors.successLight,
  },
  stockPillOut: {
    backgroundColor: colors.dangerLight,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stockTextIn: {
    color: colors.success,
  },
  stockTextOut: {
    color: colors.danger,
  },
  descText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
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

