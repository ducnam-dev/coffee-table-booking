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
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { useResponsive } from '../../theme/responsive';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge, BadgeVariant } from '../../components/Badge';
import { MyBookingsPresenter, MyBookingsViewInterface } from '../../presenters/MyBookingsPresenter';
import { useAppDispatch, useAppSelector } from '../../store';
import { setReservations } from '../../store/slices/bookingsSlice';
import { Reservation, ReservationStatus } from '../../types';

interface MyBookingsViewProps {
  navigation: any;
}

const TABS: { key: ReservationStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'PENDING', label: 'Đang chờ' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  const reservations = useAppSelector((state) => state.bookings.reservations);

  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | 'ALL'>('ALL');

  const viewCallbacks: MyBookingsViewInterface = {
    showLoading: (l) => setLoading(l),
    showError: (msg) => Alert.alert('Lỗi', msg),
    renderBookings: (data) => dispatch(setReservations(data)),
  };

  const presenter = new MyBookingsPresenter(viewCallbacks);

  useEffect(() => {
    presenter.loadMyBookings();
  }, []);

  const filtered = presenter.filterByStatus(selectedStatus);

  const getStatusBadge = (status: ReservationStatus): { label: string; variant: BadgeVariant } => {
    switch (status) {
      case 'CONFIRMED':
        return { label: 'Đã Xác Nhận', variant: 'success' };
      case 'PENDING':
        return { label: 'Chờ Quán Duyệt', variant: 'warning' };
      case 'CANCELLED':
        return { label: 'Đã Hủy', variant: 'danger' };
      case 'COMPLETED':
        return { label: 'Đã Hoàn Thành', variant: 'info' };
    }
  };

  const handleCancel = (booking: Reservation) => {
    Alert.alert(
      'Hủy Đặt Bàn',
      `Bạn có chắc chắn muốn hủy đặt bàn ${booking.tableNumber} ngày ${booking.reservationDate}?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy Bàn',
          style: 'destructive',
          onPress: () => presenter.cancelBooking(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={[styles.header, { paddingHorizontal: responsive.horizontalPadding }]}>
        <Text style={styles.title}>Lịch Sử Đặt Bàn</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TABS.map((tab) => {
            const isActive = selectedStatus === tab.key;
            return (
              <AnimatedScaleButton
                key={tab.key}
                onPress={() => setSelectedStatus(tab.key)}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
              >
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {tab.label}
                </Text>
              </AnimatedScaleButton>
            );
          })}
        </ScrollView>
      </View>

      {/* Bookings List */}
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContainer,
            { paddingHorizontal: responsive.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((booking, idx) => {
            const badge = getStatusBadge(booking.status);
            return (
              <FadeInView key={booking.id} delay={idx * 40} style={styles.bookingCardWrap}>
                <BentoCard variant="elevated" padding="md">
                  <View style={styles.cardHeader}>
                    <View style={styles.tableBadge}>
                      <Ionicons name="restaurant" size={16} color={colors.primaryDark} />
                      <Text style={styles.tableBadgeText}>Bàn {booking.tableNumber}</Text>
                    </View>
                    <Badge label={badge.label} variant={badge.variant} />
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>NGÀY & GIỜ</Text>
                      <Text style={styles.detailVal}>
                        {booking.reservationDate} lúc {booking.reservationTime}
                      </Text>
                    </View>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>SỐ KHÁCH</Text>
                      <Text style={styles.detailVal}>{booking.guestCount} người</Text>
                    </View>
                  </View>

                  {booking.orderItems && booking.orderItems.length > 0 && (
                    <View style={styles.itemsSummary}>
                      <Text style={styles.itemsSummaryText} numberOfLines={1}>
                        Đã đặt trước {booking.orderItems.length} món nước (
                        {booking.orderItems.map((i) => i.name).join(', ')})
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.footerLabel}>Tiền cọc giữ bàn:</Text>
                      <Text style={styles.footerPrice}>
                        {(booking.depositAmount || 50000).toLocaleString('vi-VN')} đ
                      </Text>
                    </View>

                    <View style={styles.actionBtns}>
                      {booking.status === 'PENDING' && (
                        <AnimatedScaleButton
                          onPress={() => handleCancel(booking)}
                          style={styles.cancelBtn}
                        >
                          <Text style={styles.cancelBtnText}>Hủy Bàn</Text>
                        </AnimatedScaleButton>
                      )}

                      <AnimatedScaleButton
                        onPress={() => navigation.navigate('BookingDetail', { booking })}
                        style={styles.ticketBtn}
                      >
                        <Ionicons name="qr-code-outline" size={16} color={colors.textInverse} />
                        <Text style={styles.ticketBtnText}>Xem Vé</Text>
                      </AnimatedScaleButton>
                    </View>
                  </View>
                </BentoCard>
              </FadeInView>
            );
          })}

          {filtered.length === 0 && (
            <View style={styles.emptyWrap}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Chưa có lịch đặt bàn nào</Text>
              <Text style={styles.emptyDesc}>Các lượt đặt bàn của bạn sẽ hiển thị tại đây.</Text>
              <AnimatedScaleButton
                onPress={() => navigation.navigate('Booking')}
                style={styles.reserveNowBtn}
              >
                <Text style={styles.reserveNowBtnText}>Đặt Bàn Ngay</Text>
              </AnimatedScaleButton>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  tabsRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tabChip: {
    paddingHorizontal: spacing.md,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabChipActive: {
    backgroundColor: colors.espresso,
    borderColor: colors.espresso,
  },
  tabChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  loader: {
    marginTop: spacing.xxxl,
  },
  listContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: 40,
  },
  bookingCardWrap: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  tableBadgeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  detailsRow: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textMuted,
  },
  detailVal: {
    ...typography.bodyLarge,
    fontWeight: '600',
    marginTop: 2,
  },
  itemsSummary: {
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.xs,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  itemsSummaryText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footerPrice: {
    ...typography.h3,
    color: colors.primaryDark,
    fontWeight: '800',
  },
  actionBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelBtn: {
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
  },
  ticketBtn: {
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.espresso,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ticketBtnText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: spacing.md,
  },
  emptyDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 4,
  },
  reserveNowBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    height: 44,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveNowBtnText: {
    ...typography.bodyLarge,
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export default MyBookingsView;

