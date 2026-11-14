import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { MenuModel } from '../../models/MenuModel';
import { MenuItem, MenuCategory } from '../../types';

export const AdminMenuView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('COFFEE');
  const [price, setPrice] = useState('45000');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await MenuModel.getAllMenuItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailable = (item: MenuItem) => {
    item.isAvailable = !item.isAvailable;
    setItems([...items]);
    Alert.alert(
      'Cập nhật món',
      `${item.name} hiện ${item.isAvailable ? 'CÒN HÀNG' : 'HẾT HÀNG'}`
    );
  };

  const handleCreateMenuItem = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món nước!');
      return;
    }
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''), 10) || 30000;
    setSaving(true);
    try {
      await MenuModel.createMenuItem({
        name: name.trim(),
        category,
        price: numPrice,
        description: description.trim() || 'Thức uống thơm ngon hảo hạng',
        isAvailable: true,
      });
      setModalVisible(false);
      setName('');
      setDescription('');
      setPrice('45000');
      await loadData();
      Alert.alert('Thành công', 'Đã thêm món mới vào thực đơn!');
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm món lúc này.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Quản Lý Thực Đơn</Text>
        <AnimatedScaleButton
          onPress={() => setModalVisible(true)}
          style={styles.addIconBtn}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </AnimatedScaleButton>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {items.map((item, i) => (
            <FadeInView key={item.id} delay={i * 20} style={styles.cardWrap}>
              <BentoCard variant="elevated" padding="md">
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.cat}>Danh mục: {item.category}</Text>
                    <Text style={styles.price}>{(item.price || 0).toLocaleString('vi-VN')} đ</Text>
                    {item.description ? (
                      <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                    ) : null}
                  </View>

                  <Badge
                    label={item.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                    variant={item.isAvailable ? 'success' : 'danger'}
                  />
                </View>

                <View style={styles.actions}>
                  <AnimatedScaleButton
                    onPress={() => handleToggleAvailable(item)}
                    style={[
                      styles.toggleBtn,
                      { backgroundColor: item.isAvailable ? colors.dangerSubtle : colors.successSubtle },
                    ]}
                  >
                    <Ionicons
                      name={item.isAvailable ? 'eye-off-outline' : 'checkmark-circle-outline'}
                      size={18}
                      color={item.isAvailable ? colors.danger : colors.success}
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        { color: item.isAvailable ? colors.danger : colors.success },
                      ]}
                    >
                      {item.isAvailable ? 'Đánh dấu Hết Hàng' : 'Mở bán lại'}
                    </Text>
                  </AnimatedScaleButton>
                </View>
              </BentoCard>
            </FadeInView>
          ))}
        </ScrollView>
      )}

      {/* Modal Thêm Món Mới */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Món Mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Tên món nước (*)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Cà Phê Trứng Muối, Trà Lài Sữa..."
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Giá bán (VNĐ)</Text>
              <TextInput
                style={styles.input}
                placeholder="45000"
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
                value={price}
                onChangeText={setPrice}
              />

              <Text style={styles.inputLabel}>Danh mục</Text>
              <View style={styles.catRow}>
                {(['COFFEE', 'TEA', 'FREEZE', 'PASTRY'] as MenuCategory[]).map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.catBtn, category === c && styles.catBtnActive]}
                  >
                    <Text style={[styles.catBtnText, category === c && styles.catBtnTextActive]}>
                      {c === 'COFFEE' ? 'Cà phê' : c === 'TEA' ? 'Trà' : c === 'FREEZE' ? 'Đá xay' : 'Bánh'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Mô tả món</Text>
              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                placeholder="Hương vị đậm đà, kem béo ngậy..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <AnimatedScaleButton
                onPress={handleCreateMenuItem}
                style={styles.submitBtn}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.textInverse} />
                ) : (
                  <Text style={styles.submitBtnText}>Lưu & Thêm Vào Menu</Text>
                )}
              </AnimatedScaleButton>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.h2 },
  scroll: { padding: spacing.lg, paddingBottom: 60 },
  cardWrap: { marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { ...typography.bodyLarge, fontWeight: '700' },
  cat: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  price: { ...typography.bodyLarge, color: colors.primaryDark, fontWeight: '800', marginTop: 4 },
  desc: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  actions: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    height: 36,
    borderRadius: radius.md,
  },
  toggleText: { ...typography.caption, fontWeight: '700' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: { ...typography.h2 },
  inputLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    ...typography.body,
    color: colors.textPrimary,
  },
  catRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  catBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  catBtnText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  submitBtnText: {
    ...typography.bodyLarge,
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export default AdminMenuView;
