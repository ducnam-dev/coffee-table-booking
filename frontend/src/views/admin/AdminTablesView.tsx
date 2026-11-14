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
import { TableModel } from '../../models/TableModel';
import { CoffeeTable, TableStatus, TableArea } from '../../types';

export const AdminTablesView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tables, setTables] = useState<CoffeeTable[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [area, setArea] = useState<TableArea>('INDOOR');
  const [hasSocket, setHasSocket] = useState(true);
  const [isWindow, setIsWindow] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await TableModel.getAllTables();
    setTables(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangeStatus = async (table: CoffeeTable, nextStatus: TableStatus) => {
    await TableModel.updateTableStatus(table.id, nextStatus);
    await loadData();
  };

  const handleCreateTable = async () => {
    if (!tableNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số bàn (VD: Bàn 07, B07)!');
      return;
    }
    const cap = parseInt(capacity, 10) || 4;
    setSaving(true);
    try {
      await TableModel.createTable({
        tableNumber: tableNumber.trim(),
        capacity: cap,
        area,
        status: 'AVAILABLE',
        hasPowerOutlet: hasSocket,
        isWindowView: isWindow,
        description: `Bàn ${area} ${cap} chỗ`,
      });
      setModalVisible(false);
      setTableNumber('');
      setCapacity('4');
      await loadData();
      Alert.alert('Thành công', 'Đã thêm bàn mới vào hệ thống!');
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm bàn lúc này.');
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
        <Text style={styles.headerTitle}>Quản Lý Bàn</Text>
        <AnimatedScaleButton
          onPress={() => {
            setTableNumber(`Bàn ${tables.length + 1 < 10 ? '0' : ''}${tables.length + 1}`);
            setModalVisible(true);
          }}
          style={styles.addIconBtn}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </AnimatedScaleButton>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {tables.map((t, i) => (
            <FadeInView key={t.id} delay={i * 25} style={styles.cardWrap}>
              <BentoCard variant="elevated" padding="md">
                <View style={styles.rowBetween}>
                  <View style={styles.leftRow}>
                    <View style={styles.tableNumBox}>
                      <Text style={styles.tableNumText}>{t.tableNumber}</Text>
                    </View>
                    <View>
                      <Text style={styles.tableArea}>Khu vực: {t.area}</Text>
                      <Text style={styles.tableCap}>Sức chứa: {t.capacity} chỗ</Text>
                      {t.hasPowerOutlet && (
                        <Text style={styles.featureText}>⚡ Có ổ cắm điện</Text>
                      )}
                    </View>
                  </View>

                  <Badge
                    label={t.status === 'AVAILABLE' ? 'Trống' : t.status === 'OCCUPIED' ? 'Có khách' : 'Đã đặt'}
                    variant={t.status === 'AVAILABLE' ? 'success' : t.status === 'OCCUPIED' ? 'danger' : 'warning'}
                  />
                </View>

                <View style={styles.statusChangeRow}>
                  <Text style={styles.actionLabel}>Chuyển trạng thái:</Text>
                  <View style={styles.statusBtns}>
                    {(['AVAILABLE', 'OCCUPIED', 'RESERVED'] as const).map((st) => (
                      <AnimatedScaleButton
                        key={st}
                        onPress={() => handleChangeStatus(t, st)}
                        style={[styles.stBtn, t.status === st && styles.stBtnActive]}
                      >
                        <Text style={[styles.stBtnText, t.status === st && styles.stBtnTextActive]}>
                          {st === 'AVAILABLE' ? 'Trống' : st === 'OCCUPIED' ? 'Khách' : 'Đặt'}
                        </Text>
                      </AnimatedScaleButton>
                    ))}
                  </View>
                </View>
              </BentoCard>
            </FadeInView>
          ))}
        </ScrollView>
      )}

      {/* Modal Thêm Bàn Mới */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Bàn Mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Tên / Số bàn (*)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Bàn 07, Bàn Cửa Sổ VIP..."
                placeholderTextColor={colors.textMuted}
                value={tableNumber}
                onChangeText={setTableNumber}
              />

              <Text style={styles.inputLabel}>Sức chứa (Số người)</Text>
              <TextInput
                style={styles.input}
                placeholder="4"
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
                value={capacity}
                onChangeText={setCapacity}
              />

              <Text style={styles.inputLabel}>Khu vực quán</Text>
              <View style={styles.areaRow}>
                {(['INDOOR', 'OUTDOOR', 'BALCONY', 'VIP'] as TableArea[]).map((a) => (
                  <TouchableOpacity
                    key={a}
                    onPress={() => setArea(a)}
                    style={[styles.areaBtn, area === a && styles.areaBtnActive]}
                  >
                    <Text style={[styles.areaBtnText, area === a && styles.areaBtnTextActive]}>
                      {a === 'INDOOR' ? 'Trong nhà' : a === 'OUTDOOR' ? 'Sân vườn' : a === 'BALCONY' ? 'Gác lửng' : 'Phòng VIP'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Tiện ích bổ sung</Text>
              <View style={styles.switchRow}>
                <TouchableOpacity
                  onPress={() => setHasSocket(!hasSocket)}
                  style={[styles.checkBtn, hasSocket && styles.checkBtnActive]}
                >
                  <Ionicons
                    name={hasSocket ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={hasSocket ? colors.primaryDark : colors.textMuted}
                  />
                  <Text style={styles.checkText}>Có ổ cắm điện</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsWindow(!isWindow)}
                  style={[styles.checkBtn, isWindow && styles.checkBtnActive]}
                >
                  <Ionicons
                    name={isWindow ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isWindow ? colors.primaryDark : colors.textMuted}
                  />
                  <Text style={styles.checkText}>Gần cửa sổ kính</Text>
                </TouchableOpacity>
              </View>

              <AnimatedScaleButton
                onPress={handleCreateTable}
                style={styles.submitBtn}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.textInverse} />
                ) : (
                  <Text style={styles.submitBtnText}>Tạo & Đưa Vào Hoạt Động</Text>
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
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tableNumBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  tableNumText: { ...typography.caption, color: colors.textInverse, fontWeight: '800', textAlign: 'center' },
  tableArea: { ...typography.bodyLarge, fontWeight: '700' },
  tableCap: { ...typography.caption, color: colors.textSecondary },
  featureText: { ...typography.caption, color: colors.primaryDark, fontWeight: '600', marginTop: 2 },
  statusChangeRow: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLabel: { ...typography.caption, color: colors.textMuted },
  statusBtns: { flexDirection: 'row', gap: 6 },
  stBtn: {
    paddingHorizontal: spacing.sm,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stBtnActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  stBtnText: { ...typography.caption, fontSize: 11, fontWeight: '600' },
  stBtnTextActive: { color: colors.textInverse, fontWeight: '700' },

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
  areaRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  areaBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  areaBtnText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  areaBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  checkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
  },
  checkBtnActive: {},
  checkText: {
    ...typography.body,
    fontSize: 13,
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

export default AdminTablesView;
