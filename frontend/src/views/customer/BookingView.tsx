import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { BookingPresenter, BookingViewInterface } from '../../presenters/BookingPresenter';
import { useAppDispatch, useAppSelector } from '../../store';
import { addReservation, clearCurrentBooking } from '../../store/slices/bookingsSlice';
import { clearCart } from '../../store/slices/menuSlice';
import { CoffeeTable, Reservation } from '../../types';

interface BookingViewProps {
  route?: { params?: { preselectedTable?: CoffeeTable } };
  navigation: any;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00',
  '18:30', '19:30', '20:30',
];

export const BookingView: React.FC<BookingViewProps> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const tables = useAppSelector((state) => state.tables.tables);
  const cart = useAppSelector((state) => state.menu.cart);

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [guestCount, setGuestCount] = useState(2);
  const [reservationDate, setReservationDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [reservationTime, setReservationTime] = useState('09:00');
  const [selectedTable, setSelectedTable] = useState<CoffeeTable | null>(
    route?.params?.preselectedTable || null
  );
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.preselectedTable) {
      setSelectedTable(route.params.preselectedTable);
    } else if (!selectedTable && tables.length > 0) {
      const avail = tables.find((t) => t.status === 'AVAILABLE');
      if (avail) setSelectedTable(avail);
    }
  }, [route?.params?.preselectedTable, tables]);

  const viewCallbacks: BookingViewInterface = {
    showLoading: (l) => setLoading(l),
    showError: (msg) => Alert.alert('Lỗi đặt bàn', msg),
    onBookingSuccess: (reservation: Reservation) => {
      dispatch(addReservation(reservation));
      dispatch(clearCart());
      dispatch(clearCurrentBooking());
      Alert.alert(
        'Đặt Bàn Thành Công! 🎉',
        `Mã vé: ${reservation.qrCode}\nBàn: ${reservation.tableNumber}\nNgày: ${reservation.reservationDate} lúc ${reservation.reservationTime}`,
        [
          {
            text: 'Xem Vé Đặt Chỗ',
            onPress: () => navigation.navigate('BookingDetail', { booking: reservation }),
          },
          {
            text: 'Về Trang Chủ',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    },
  };

  const presenter = new BookingPresenter(viewCallbacks);

  const drinkTotal = presenter.calculateTotal(cart);
  const depositAmount = presenter.calculateDeposit(drinkTotal);

  const availableTables = tables.filter((t) => t.status === 'AVAILABLE');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <FadeInView style={styles.header}>
          <Text style={styles.headerTitle}>Đặt Bàn Thưởng Thức</Text>
          <Text style={styles.headerSub}>
            Pam Coffee giữ bàn trước cho bạn 15 phút so với giờ hẹn
          </Text>
        </FadeInView>

        {/* 1. Contact Information */}
        <FadeInView delay={60} style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>1. Thông Tin Khách Hàng</Text>
          <BentoCard variant="elevated" padding="md">
            <Text style={styles.label}>Họ và tên người nhận bàn *</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Nguyễn Văn A"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>Số điện thoại liên hệ *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="0901234567"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
          </BentoCard>
        </FadeInView>

        {/* 2. Date, Time & Guests */}
        <FadeInView delay={120} style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>2. Thời Gian & Số Lượng Khách</Text>
          <BentoCard variant="elevated" padding="md">
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Số người tham gia:</Text>
              <View style={styles.guestCounter}>
                <AnimatedScaleButton
                  onPress={() => setGuestCount(Math.max(1, guestCount - 1))}
                  style={styles.counterBtn}
                >
                  <Ionicons name="remove" size={16} color={colors.textPrimary} />
                </AnimatedScaleButton>
                <Text style={styles.guestValue}>{guestCount} người</Text>
                <AnimatedScaleButton
                  onPress={() => setGuestCount(guestCount + 1)}
                  style={styles.counterBtn}
                >
                  <Ionicons name="add" size={16} color={colors.textPrimary} />
                </AnimatedScaleButton>
              </View>
            </View>

            <Text style={[styles.label, { marginTop: spacing.md }]}>Ngày đặt:</Text>
            <TextInput
              style={styles.input}
              value={reservationDate}
              onChangeText={setReservationDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>Khung giờ đến:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeScroll}>
              {TIME_SLOTS.map((time) => {
                const isSelected = reservationTime === time;
                return (
                  <AnimatedScaleButton
                    key={time}
                    onPress={() => setReservationTime(time)}
                    style={[styles.timeChip, isSelected && styles.timeChipActive]}
                  >
                    <Text style={[styles.timeChipText, isSelected && styles.timeChipTextActive]}>
                      {time}
                    </Text>
                  </AnimatedScaleButton>
                );
              })}
            </ScrollView>
          </BentoCard>
        </FadeInView>

        {/* 3. Table Choice */}
        <FadeInView delay={180} style={styles.sectionWrap}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionHeading}>3. Chọn Bàn Trống</Text>
            <AnimatedScaleButton onPress={() => navigation.navigate('Tables')}>
              <Text style={styles.viewMapText}>Xem sơ đồ</Text>
            </AnimatedScaleButton>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScroll}>
            {availableTables.map((t) => {
              const isSelected = selectedTable?.id === t.id;
              return (
                <AnimatedScaleButton
                  key={t.id}
                  onPress={() => setSelectedTable(t)}
                  style={[styles.tableChoiceCard, isSelected && styles.tableChoiceCardActive]}
                >
                  <View style={[styles.tableNumberBox, isSelected && styles.tableNumberBoxActive]}>
                    <Text style={[styles.tableNumberBoxText, isSelected && styles.tableNumberBoxTextActive]}>
                      {t.tableNumber}
                    </Text>
                  </View>
                  <Text style={styles.tableChoiceCap}>{t.capacity} chỗ</Text>
                  <Text style={styles.tableChoiceArea}>{t.area}</Text>
                </AnimatedScaleButton>
              );
            })}
          </ScrollView>
        </FadeInView>

        {/* 4. Pre-ordered Drinks */}
        <FadeInView delay={240} style={styles.sectionWrap}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionHeading}>4. Món Đã Đặt Trước ({cart.length})</Text>
            <AnimatedScaleButton onPress={() => navigation.navigate('Menu')}>
              <Text style={styles.viewMapText}>+ Thêm món</Text>
            </AnimatedScaleButton>
          </View>

          <BentoCard variant="elevated" padding="md">
            {cart.length === 0 ? (
              <View style={styles.emptyCartBox}>
                <Ionicons name="cafe-outline" size={32} color={colors.textMuted} />
                <Text style={styles.emptyCartText}>Chưa chọn món nước nào</Text>
                <AnimatedScaleButton
                  onPress={() => navigation.navigate('Menu')}
                  style={styles.pickDrinkBtn}
                >
                  <Text style={styles.pickDrinkBtnText}>Chọn món ngay</Text>
                </AnimatedScaleButton>
              </View>
            ) : (
              <View style={styles.cartList}>
                {cart.map((item, idx) => (
                  <View key={idx} style={styles.cartItemRow}>
                    <View style={styles.cartItemLeft}>
                      <Text style={styles.cartItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.cartItemSub}>
                        Số lượng: {item.quantity} x {item.price.toLocaleString('vi-VN')} đ
                      </Text>
                    </View>
                    <Text style={styles.cartItemPrice}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </BentoCard>
        </FadeInView>

        {/* 5. Special Notes */}
        <FadeInView delay={300} style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>5. Ghi Chú Đặc Biệt (Tùy chọn)</Text>
          <BentoCard variant="elevated" padding="md">
            <TextInput
              style={styles.textArea}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Ví dụ: Bàn yên tĩnh để học bài, cần ổ cắm sạc laptop, chuẩn bị bánh sinh nhật..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />
          </BentoCard>
        </FadeInView>

        {/* Deposit Calculation Summary */}
        <FadeInView delay={360} style={styles.sectionWrap}>
          <BentoCard variant="amber" padding="lg">
            <Text style={styles.summaryTitle}>Tóm Tắt Thanh Toán & Tiền Cọc</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền cọc giữ bàn tiêu chuẩn:</Text>
              <Text style={styles.summaryVal}>50.000 đ</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền món đặt trước ({cart.length} món):</Text>
              <Text style={styles.summaryVal}>{drinkTotal.toLocaleString('vi-VN')} đ</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Tổng Tiền Cọc Cần Thanh Toán:</Text>
              <Text style={styles.summaryTotalVal}>{depositAmount.toLocaleString('vi-VN')} đ</Text>
            </View>
            <Text style={styles.summaryNote}>
              * Tiền cọc sẽ được trừ trực tiếp vào hóa đơn tại quầy khi bạn check-in.
            </Text>
          </BentoCard>
        </FadeInView>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomDepositLabel}>Tiền cọc giữ chỗ</Text>
          <Text style={styles.bottomDepositPrice}>{depositAmount.toLocaleString('vi-VN')} đ</Text>
        </View>

        <AnimatedScaleButton
          onPress={() =>
            presenter.submitReservation({
              customerName,
              phone,
              email: user?.email,
              selectedTable,
              reservationDate,
              reservationTime,
              guestCount,
              orderItems: cart,
              specialRequests,
            })
          }
          style={styles.submitBtn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Xác Nhận Đặt Bàn</Text>
              <Ionicons name="checkmark-circle" size={18} color={colors.textInverse} />
            </>
          )}
        </AnimatedScaleButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 110,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
  },
  headerSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionWrap: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    ...typography.bodyLarge,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewMapText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    ...typography.body,
    color: colors.textPrimary,
  },
  textArea: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 80,
    ...typography.body,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  guestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestValue: {
    ...typography.bodyLarge,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
  },
  timeScroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  timeChip: {
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipActive: {
    backgroundColor: colors.espresso,
    borderColor: colors.espresso,
  },
  timeChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  timeChipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  tableScroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tableChoiceCard: {
    width: 90,
    height: 100,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  tableChoiceCardActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  tableNumberBox: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tableNumberBoxActive: {
    backgroundColor: colors.primary,
  },
  tableNumberBoxText: {
    ...typography.bodyLarge,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tableNumberBoxTextActive: {
    color: colors.textInverse,
  },
  tableChoiceCap: {
    ...typography.caption,
    fontWeight: '600',
  },
  tableChoiceArea: {
    fontSize: 10,
    color: colors.textMuted,
  },
  emptyCartBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyCartText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  pickDrinkBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primarySubtle,
    justifyContent: 'center',
  },
  pickDrinkBtnText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  cartList: {
    gap: spacing.sm,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemLeft: {
    flex: 1,
  },
  cartItemName: {
    ...typography.bodyLarge,
    fontWeight: '600',
  },
  cartItemSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
  cartItemPrice: {
    ...typography.bodyLarge,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  summaryTitle: {
    ...typography.bodyLarge,
    fontWeight: '800',
    color: colors.espresso,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  summaryVal: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(217, 119, 6, 0.25)',
    marginVertical: spacing.sm,
  },
  summaryTotalLabel: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.espresso,
  },
  summaryTotalVal: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  summaryNote: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 11,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    ...shadows.medium,
  },
  bottomDepositLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bottomDepositPrice: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.soft,
  },
  submitBtnText: {
    ...typography.bodyLarge,
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export default BookingView;
