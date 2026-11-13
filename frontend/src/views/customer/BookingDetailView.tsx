import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge, BadgeVariant } from '../../components/Badge';
import { Reservation, ReservationStatus } from '../../types';

interface BookingDetailViewProps {
  route: { params: { booking: Reservation } };
  navigation: any;
}

export const BookingDetailView: React.FC<BookingDetailViewProps> = ({ route, navigation }) => {
  const { booking } = route.params;
  const insets = useSafeAreaInsets();

  const getStatusBadge = (status: ReservationStatus): { label: string; variant: BadgeVariant } => {
    switch (status) {
      case 'CONFIRMED':
        return { label: 'Đã xác nhận', variant: 'success' };
      case 'PENDING':
        return { label: 'Chờ duyệt', variant: 'warning' };
      case 'CANCELLED':
        return { label: 'Đã hủy', variant: 'danger' };
      case 'COMPLETED':
        return { label: 'Hoàn thành', variant: 'info' };
    }
  };

  const statusBadge = getStatusBadge(booking.status);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) + spacing.xs }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Chi Tiết Vé Đặt Bàn</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 20) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Physical Coffee Ticket Card */}
        <FadeInView style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.ticketTitleCol}>
              <Text style={styles.brandName}>PAM COFFEE & TEA</Text>
              <Text style={styles.ticketSub} numberOfLines={1}>Phiếu Giữ Chỗ</Text>
            </View>
            <View style={styles.statusBadgeWrap}>
              <Badge label={statusBadge.label} variant={statusBadge.variant} style={styles.statusBadge} />
            </View>
          </View>

          {/* Perforated Divider */}
          <View style={styles.perforatedLine}>
            <View style={styles.leftHole} />
            <View style={styles.dashedLine} />
            <View style={styles.rightHole} />
          </View>

          {/* Ticket Body */}
          <View style={styles.ticketBody}>
            <View style={styles.qrBox}>
              <Ionicons name="qr-code" size={140} color={colors.espresso} />
              <Text style={styles.qrCodeText}>{booking.qrCode || `PAM-RES-${booking.id}`}</Text>
              <Text style={styles.qrHint}>Đưa mã này cho thu ngân khi đến quán để check-in</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>BÀN SỐ</Text>
                <Text style={styles.infoValueLarge}>{booking.tableNumber || (booking as any).coffeeTable?.name || 'B01'}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>SỐ KHÁCH</Text>
                <Text style={styles.infoValueLarge}>{booking.guestCount || (booking as any).guestNumber || 2} người</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>NGÀY HẸN</Text>
                <Text style={styles.infoValue}>{booking.reservationDate || 'Hôm nay'}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>GIỜ ĐẾN</Text>
                <Text style={styles.infoValue}>{booking.reservationTime || '09:00'}</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>NGƯỜI ĐẶT</Text>
                <Text style={styles.infoValue}>{booking.customerName || 'Quý khách'}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>SỐ ĐIỆN THOẠI</Text>
                <Text style={styles.infoValue}>{booking.phone || (booking as any).customerPhone || 'Chưa cập nhật'}</Text>
              </View>
            </View>

            {booking.specialRequests ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteLabel}>GHI CHÚ:</Text>
                <Text style={styles.noteText}>{booking.specialRequests}</Text>
              </View>
            ) : null}

            {/* Pre-ordered items summary */}
            {booking.orderItems && booking.orderItems.length > 0 && (
              <View style={styles.itemsBox}>
                <Text style={styles.itemsHeading}>MÓN ĐÃ ĐẶT TRƯỚC</Text>
                {booking.orderItems.map((item, i) => (
                  <View key={i} style={styles.itemRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.depositRow}>
              <Text style={styles.depositLabel}>Tiền cọc giữ bàn đã thanh toán:</Text>
              <Text style={styles.depositValue}>
                {(booking.depositAmount || 50000).toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        </FadeInView>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <AnimatedScaleButton
            onPress={() => navigation.navigate('MyBookings')}
            style={styles.historyBtn}
          >
            <Ionicons name="time-outline" size={16} color={colors.primaryDark} />
            <Text style={styles.historyBtnText} numberOfLines={1}>Lịch Sử Đặt Bàn</Text>
          </AnimatedScaleButton>

          <AnimatedScaleButton
            onPress={() => navigation.navigate('CustomerTabs', { screen: 'Home' })}
            style={styles.homeBtn}
          >
            <Ionicons name="home-outline" size={16} color={colors.textInverse} />
            <Text style={styles.homeBtnText} numberOfLines={1}>Về Trang Chủ</Text>
          </AnimatedScaleButton>
        </View>

        <AnimatedScaleButton
          onPress={() => Alert.alert('Hotline Quán', 'Gọi 0901 234 567 để được hỗ trợ tức thì.')}
          style={styles.contactSecondaryBtn}
        >
          <Ionicons name="call-outline" size={15} color={colors.textMuted} />
          <Text style={styles.contactSecondaryBtnText}>Cần hỗ trợ? Gọi hotline quán 0901 234 567</Text>
        </AnimatedScaleButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  ticketCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.prominent,
    overflow: 'hidden',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceSubtle,
  },
  ticketTitleCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  brandName: {
    ...typography.overline,
    color: colors.primaryDark,
    letterSpacing: 1,
  },
  ticketSub: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.espresso,
    marginTop: 2,
  },
  statusBadgeWrap: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  perforatedLine: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    backgroundColor: colors.surfaceSubtle,
  },
  dashedLine: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.borderMedium,
    marginHorizontal: spacing.xl,
  },
  leftHole: {
    position: 'absolute',
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  rightHole: {
    position: 'absolute',
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  ticketBody: {
    padding: spacing.xl,
  },
  qrBox: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  qrCodeText: {
    ...typography.bodyLarge,
    fontWeight: '800',
    color: colors.espresso,
    letterSpacing: 1.5,
    marginTop: spacing.xs,
  },
  qrHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.bodyLarge,
    fontWeight: '600',
    marginTop: 2,
  },
  infoValueLarge: {
    ...typography.h2,
    color: colors.primaryDark,
    fontWeight: '800',
    marginTop: 2,
  },
  noteBox: {
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  noteLabel: {
    ...typography.overline,
    fontSize: 10,
  },
  noteText: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  itemsBox: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  itemsHeading: {
    ...typography.overline,
    marginBottom: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
    gap: spacing.sm,
  },
  itemName: {
    ...typography.bodySmall,
    flex: 1,
    paddingRight: spacing.xs,
  },
  itemPrice: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
    gap: 6,
  },
  depositLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.espresso,
  },
  depositValue: {
    ...typography.h3,
    color: colors.primaryDark,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  historyBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    gap: 6,
  },
  historyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.2,
  },
  homeBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.espresso,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    gap: 6,
    ...shadows.soft,
  },
  homeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textInverse,
    letterSpacing: 0.2,
  },
  contactSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  contactSecondaryBtnText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});

export default BookingDetailView;

