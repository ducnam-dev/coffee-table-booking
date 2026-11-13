import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { TableModel } from '../../models/TableModel';
import { CoffeeTable, TableStatus } from '../../types';

export const AdminTablesView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tables, setTables] = useState<CoffeeTable[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Quản Lý Bàn</Text>
        <AnimatedScaleButton
          onPress={() => {
            Alert.alert('Thêm Bàn Mới', 'Tạo bàn tiếp theo trong hệ thống?', [
              { text: 'Hủy' },
              {
                text: 'Tạo Bàn B09',
                onPress: async () => {
                  await TableModel.createTable({
                    tableNumber: `B0${tables.length + 1}`,
                    capacity: 4,
                    area: 'INDOOR',
                    description: 'Bàn mới thêm',
                  });
                  await loadData();
                },
              },
            ]);
          }}
          style={styles.backBtn}
        >
          <Ionicons name="add" size={24} color={colors.primaryDark} />
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
                      <Text style={styles.tableNumText}>{t.tableNumber || `B0${t.id}`}</Text>
                    </View>
                    <View>
                      <Text style={styles.tableArea}>{t.name || `Khu vực: ${t.area}`}</Text>
                      <Text style={styles.tableCap}>Sức chứa: {t.capacity || t.seats || 4} chỗ</Text>
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
  headerTitle: { ...typography.h2 },
  scroll: { padding: spacing.lg, paddingBottom: 60 },
  cardWrap: { marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tableNumBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableNumText: { ...typography.h3, color: colors.textInverse, fontWeight: '800' },
  tableArea: { ...typography.bodyLarge, fontWeight: '700' },
  tableCap: { ...typography.caption, color: colors.textSecondary },
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
});

export default AdminTablesView;

