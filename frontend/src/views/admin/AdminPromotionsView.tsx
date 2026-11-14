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
import { PromotionModel } from '../../models/PromotionModel';
import { Promotion } from '../../types';

export const AdminPromotionsView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [maxDiscount, setMaxDiscount] = useState('50000');
  const [minOrderValue, setMinOrderValue] = useState('50000');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await PromotionModel.getAllPromotions();
    setPromotions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (promo: Promotion) => {
    await PromotionModel.togglePromotion(promo.id);
    await loadData();
  };

  const handleDelete = (promo: Promotion) => {
    Alert.alert('Xóa Khuyến Mãi', `Bạn có chắc muốn xóa mã ${promo.code}?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await PromotionModel.deletePromotion(promo.id);
          await loadData();
        },
      },
    ]);
  };

  const handleCreate = async () => {
    if (!code.trim() || !title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã khuyến mãi và tiêu đề!');
      return;
    }
    const percent = parseInt(discountPercent, 10) || 10;
    const maxVal = parseInt(maxDiscount.replace(/[^0-9]/g, ''), 10) || 50000;
    const minVal = parseInt(minOrderValue.replace(/[^0-9]/g, ''), 10) || 0;

    setSaving(true);
    try {
      await PromotionModel.createPromotion({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        description: description.trim() || 'Ưu đãi dành cho quý khách',
        discountPercent: percent,
        maxDiscount: maxVal,
        minOrderValue: minVal,
        validUntil: validUntil || '2026-12-31',
        isActive: true,
      });
      setModalVisible(false);
      setCode('');
      setTitle('');
      setDescription('');
      await loadData();
      Alert.alert('Thành công', 'Đã tạo mã khuyến mãi mới!');
    } catch {
      Alert.alert('Lỗi', 'Không thể tạo mã khuyến mãi lúc này.');
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
        <Text style={styles.headerTitle}>Quản Lý Khuyến Mãi</Text>
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
          {promotions.map((p, i) => (
            <FadeInView key={p.id} delay={i * 20} style={styles.cardWrap}>
              <BentoCard variant="elevated" padding="md">
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <View style={styles.codeBadge}>
                      <Ionicons name="pricetag" size={14} color={colors.primaryDark} />
                      <Text style={styles.codeText}>{p.code}</Text>
                    </View>
                    <Text style={styles.title}>{p.title}</Text>
                    <Text style={styles.desc}>{p.description}</Text>
                    <Text style={styles.meta}>
                      Giảm <Text style={{ fontWeight: '800', color: colors.danger }}>{p.discountPercent}%</Text> • Tối đa {(p.maxDiscount || 0).toLocaleString('vi-VN')} đ
                    </Text>
                    <Text style={styles.expiry}>Hạn dùng: {p.validUntil}</Text>
                  </View>

                  <Badge
                    label={p.isActive ? 'Đang áp dụng' : 'Tạm dừng'}
                    variant={p.isActive ? 'success' : 'neutral'}
                  />
                </View>

                <View style={styles.actions}>
                  <AnimatedScaleButton
                    onPress={() => handleToggle(p)}
                    style={[
                      styles.actionBtn,
                      { backgroundColor: p.isActive ? colors.dangerSubtle : colors.successSubtle },
                    ]}
                  >
                    <Text style={[styles.actionBtnText, { color: p.isActive ? colors.danger : colors.success }]}>
                      {p.isActive ? 'Tạm Dừng' : 'Kích Hoạt'}
                    </Text>
                  </AnimatedScaleButton>

                  <AnimatedScaleButton
                    onPress={() => handleDelete(p)}
                    style={[styles.actionBtn, { backgroundColor: colors.dangerSubtle }]}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.danger} />
                    <Text style={[styles.actionBtnText, { color: colors.danger }]}>Xóa</Text>
                  </AnimatedScaleButton>
                </View>
              </BentoCard>
            </FadeInView>
          ))}
        </ScrollView>
      )}

      {/* Modal Thêm Khuyến Mãi Mới */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Mã Khuyến Mãi</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Mã code khuyến mãi (*)</Text>
              <TextInput
                style={[styles.input, { textTransform: 'uppercase', fontWeight: '700' }]}
                placeholder="VD: GIAM20, PAMCOFFEE..."
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                value={code}
                onChangeText={setCode}
              />

              <Text style={styles.inputLabel}>Tiêu đề chương trình (*)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Tri ân khách hàng tháng 11"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Phần trăm giảm (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="20"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                    value={discountPercent}
                    onChangeText={setDiscountPercent}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Giảm tối đa (đ)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="50000"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                    value={maxDiscount}
                    onChangeText={setMaxDiscount}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Mô tả chi tiết</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Áp dụng cho tất cả đồ uống..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <AnimatedScaleButton
                onPress={handleCreate}
                style={styles.submitBtn}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.textInverse} />
                ) : (
                  <Text style={styles.submitBtnText}>Tạo & Phát Hành Mã</Text>
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
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySubtle,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  codeText: { ...typography.caption, fontWeight: '800', color: colors.primaryDark },
  title: { ...typography.bodyLarge, fontWeight: '700' },
  desc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  meta: { ...typography.body, fontSize: 13, marginTop: 4 },
  expiry: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  actions: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.sm,
  },
  actionBtnText: { ...typography.caption, fontWeight: '700' },

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

export default AdminPromotionsView;
