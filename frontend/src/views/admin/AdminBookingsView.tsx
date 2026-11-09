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
import { colors, radius, spacing, typography } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { ReservationModel } from '../../models/ReservationModel';
import { Reservation, ReservationStatus } from '../../types';

export const AdminBookingsView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReservationStatus | 'ALL'>('ALL');

  const loadData = async () => {
    setLoading(true);
    const data = await ReservationModel.getAllReservations();
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: number, status: ReservationStatus) => {
    await ReservationModel.updateStatus(id, status);
    await loadData();
    Alert.alert('Thành công', `Đã chuyển trạng thái sang ${status}`);
  };

  const filtered = reservations.filter((r) => filter === 'ALL' || r.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Quản Lý Đặt Bàn</Text>
        <AnimatedScaleButton onPress={loadData} style={styles.backBtn}>
          <Ionicons name="refresh" size={20} color={colors.textPrimary} />
        </AnimatedScaleButton>
      </View>

      <View style={styles.filterBar}>
        {(['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'] as const).map((s) => (
          <AnimatedScaleButton
            key={s}
            onPress={() => setFilter(s)}
            style={[styles.filterChip, filter === s && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, filter === s && styles.filterChipTextActive]}>
              {s === 'ALL' ? 'Tất cả' : s === 'PENDING' ? 'Chờ duyệt' : s === 'CONFIRMED' ? 'Đã duyệt' : 'Đã hủy'}
            </Text>
          </AnimatedScaleButton>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {filtered.map((r, i) => (
            <FadeInView key={r.id} delay={i * 30} style={styles.cardWrap}>
              <BentoCard variant="elevated" padding="md">
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.custName}>{r.customerName}</Text>
                    <Text style={styles.phone}>SĐT: {r.phone}</Text>
                  </View>
                  <Badge
                    label={r.status}
                    variant={r.status === 'CONFIRMED' ? 'success' : r.status === 'PENDING' ? 'warning' : 'danger'}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    Bàn <Text style={{ fontWeight: '700' }}>{r.tableNumber}</Text> • {r.guestCount} người
                  </Text>
                  <Text style={styles.metaText}>
                    {r.reservationDate} lúc {r.reservationTime}
                  </Text>
                </View>

                {r.specialRequests ? (
                  <Text style={styles.note}>Ghi chú: {r.specialRequests}</Text>
                ) : null}

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Tiền cọc:</Text>
                  <Text style={styles.priceVal}>
                    {(r.depositAmount || 50000).toLocaleString('vi-VN')} đ
                  </Text>
                </View>

                {r.status === 'PENDING' && (
                  <View style={styles.btnRow}>
                    <AnimatedScaleButton
                      onPress={() => handleUpdateStatus(r.id, 'CONFIRMED')}
                      style={styles.approveBtn}
                    >
                      <Text style={styles.approveText}>Phê Duyệt</Text>
                    </AnimatedScaleButton>
                    <AnimatedScaleButton
                      onPress={() => handleUpdateStatus(r.id, 'CANCELLED')}
                      style={styles.rejectBtn}
                    >
                      <Text style={styles.rejectText}>Từ Chối</Text>
                    </AnimatedScaleButton>
                  </View>
                )}
              </BentoCard>
            </FadeInView>
          ))}
        </ScrollView>
      )}
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
  filterBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
  },
  filterChip: {
    flex: 1,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.espresso, borderColor: colors.espresso },
  filterChipText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: colors.textInverse, fontWeight: '700' },
  scroll: { padding: spacing.lg, paddingBottom: 60 },
  cardWrap: { marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  custName: { ...typography.bodyLarge, fontWeight: '700' },
  phone: { ...typography.caption, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  metaText: { ...typography.bodySmall },
  note: { ...typography.caption, color: colors.primaryDark, marginTop: 4, fontStyle: 'italic' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  priceLabel: { ...typography.caption, color: colors.textMuted },
  priceVal: { ...typography.bodyLarge, fontWeight: '700', color: colors.primaryDark },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  approveBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveText: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
  rejectBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectText: { ...typography.caption, color: colors.danger, fontWeight: '700' },
});

export default AdminBookingsView;

