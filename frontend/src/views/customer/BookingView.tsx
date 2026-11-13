import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { setTables } from '../../store/slices/tablesSlice';
import { TableModel } from '../../models/TableModel';
import { CoffeeTable, Reservation } from '../../types';

export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getUpcomingDays = (daysCount = 14) => {
  const dates = [];
  const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = getLocalDateString(d);
    let label = '';
    if (i === 0) label = 'Hôm nay';
    else if (i === 1) label = 'Ngày mai';
    else label = `${dayNames[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`;
    dates.push({ dateStr, label, day: d.getDate(), month: d.getMonth() + 1 });
  }
  return dates;
};

interface BookingViewProps {
  route?: { params?: { preselectedTable?: CoffeeTable } };
  navigation: any;
}

const TIME_SLOTS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

export const BookingView: React.FC<BookingViewProps> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const tables = useAppSelector((state) => state.tables.tables);
  const cart = useAppSelector((state) => state.menu.cart);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(cleaned);
    if (cleaned.length === 10) {
      const vnPhoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
      if (!vnPhoneRegex.test(cleaned)) {
        setPhoneError('Đầu số không hợp lệ (cần bắt đầu bằng 03, 05, 07, 08, 09)');
      } else {
        setPhoneError('');
      }
    } else if (cleaned.length > 0 && !cleaned.startsWith('0')) {
      setPhoneError('Số điện thoại phải bắt đầu bằng chữ số 0');
    } else {
      setPhoneError('');
    }
  };
  const [guestCount, setGuestCount] = useState(2);
  const todayStr = useMemo(() => getLocalDateString(), []);
  const upcomingDays = useMemo(() => getUpcomingDays(14), []);
  const [reservationDate, setReservationDate] = useState(() => getLocalDateString());
  const [dateError, setDateError] = useState('');

  const handleDateSelect = (dateStr: string) => {
    if (dateStr < todayStr) {
      setDateError('Không thể chọn ngày trong quá khứ! Vui lòng chọn từ hôm nay trở đi.');
      return;
    }
    setDateError('');
    setReservationDate(dateStr);
  };

  const handleDateTextChange = (text: string) => {
    setReservationDate(text);
    if (text.length === 10) {
      if (text < todayStr) {
        setDateError('Không thể chọn ngày trong quá khứ! Vui lòng chọn từ hôm nay trở đi.');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  };
  const [reservationTime, setReservationTime] = useState('');
  const [selectedTable, setSelectedTable] = useState<CoffeeTable | null>(
    route?.params?.preselectedTable || null
  );
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tables.length === 0) {
      TableModel.getAllTables().then((data) => {
        dispatch(setTables(data));
        if (route?.params?.preselectedTable) {
          setSelectedTable(route.params.preselectedTable);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (route?.params?.preselectedTable) {
      setSelectedTable(route.params.preselectedTable);
    }
  }, [route?.params?.preselectedTable]);

  const viewCallbacks: BookingViewInterface = {
    showLoading: (l) => setLoading(l),
    showError: (msg) => Alert.alert('Lỗi đặt bàn', msg),
    onBookingSuccess: (reservation: Reservation) => {
      dispatch(addReservation(reservation));
      dispatch(clearCart());
      dispatch(clearCurrentBooking());
      navigation.navigate('BookingDetail', { booking: reservation });
    },
  };

  const presenter = new BookingPresenter(viewCallbacks);

  const drinkTotal = presenter.calculateTotal(cart);
  const depositAmount = presenter.calculateDeposit(drinkTotal);

  const availableTables = tables.filter((t) => t.status === 'AVAILABLE');

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: Math.max(insets.top, 16) + spacing.xs,
            paddingBottom: 170,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
              placeholder="Nhập họ và tên..."
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>Số điện thoại liên hệ *</Text>
            <TextInput
              style={[styles.input, phoneError ? styles.inputError : null]}
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="Ví dụ: 0901234567"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : (
              <Text style={styles.phoneHint}>Quy tắc: 10 chữ số (bắt đầu bằng 03, 05, 07, 08, 09)</Text>
            )}
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

            <View style={styles.dateHeaderRow}>
              <Text style={styles.label}>Ngày đặt bàn: *</Text>
              <View style={styles.selectedDateBadge}>
                <Ionicons name="calendar" size={13} color={colors.primaryDark} />
                <Text style={styles.selectedDateBadgeText}>{reservationDate}</Text>
              </View>
            </View>

            {/* Quick date selector chips (realtime từ hôm nay trở đi) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              contentContainerStyle={styles.dateScroll}
            >
              {upcomingDays.map((item) => {
                const isSelected = reservationDate === item.dateStr;
                return (
                  <AnimatedScaleButton
                    key={item.dateStr}
                    onPress={() => handleDateSelect(item.dateStr)}
                    style={[styles.dateChip, isSelected && styles.dateChipActive]}
                  >
                    <Text style={[styles.dateChipDay, isSelected && styles.dateChipDayActive]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.dateChipDate, isSelected && styles.dateChipDateActive]}>
                      {item.day}/{item.month}
                    </Text>
                  </AnimatedScaleButton>
                );
              })}
            </ScrollView>

            <View style={styles.customDateRow}>
              <Text style={styles.customTimeLabel}>Hoặc nhập ngày khác (YYYY-MM-DD):</Text>
              <TextInput
                style={[styles.customTimeInput, dateError ? styles.inputError : null]}
                value={reservationDate}
                onChangeText={handleDateTextChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                maxLength={10}
              />
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : (
                <Text style={styles.phoneHint}>Chỉ nhận đặt từ hôm nay ({todayStr}) trở đi</Text>
              )}
            </View>

            <View style={styles.timeHeaderRow}>
              <Text style={styles.label}>Khung giờ đến: *</Text>
              {reservationTime ? (
                <View style={styles.selectedTimeBadge}>
                  <Ionicons name="time" size={13} color={colors.primaryDark} />
                  <Text style={styles.selectedTimeBadgeText}>{reservationTime}</Text>
                </View>
              ) : (
                <Text style={styles.unselectedTimeHint}>(Chạm để chọn giờ)</Text>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              {...(Platform.OS === 'web'
                ? {
                    onWheel: (e: any) => {
                      if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                        e.currentTarget.scrollLeft += e.deltaY;
                      }
                    },
                  }
                : {})}
              contentContainerStyle={styles.timeScroll}
            >
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

            <View style={styles.customTimeBox}>
              <Text style={styles.customTimeLabel}>Hoặc tự nhập giờ bạn muốn đến:</Text>
              <TextInput
                style={styles.customTimeInput}
                value={reservationTime}
                onChangeText={(text) => setReservationTime(text.trim())}
                placeholder="Ví dụ: 08:45 hoặc 14:15"
                placeholderTextColor={colors.textMuted}
                maxLength={5}
              />
            </View>
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            {...(Platform.OS === 'web'
              ? {
                  onWheel: (e: any) => {
                    if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                      e.currentTarget.scrollLeft += e.deltaY;
                    }
                  },
                }
              : {})}
            contentContainerStyle={styles.tableScroll}
          >
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
                      {t.tableNumber || `B0${t.id}`}
                    </Text>
                  </View>
                  <Text style={styles.tableChoiceCap}>{t.capacity || (t as any).seats || 4} chỗ</Text>
                  <Text style={styles.tableChoiceArea} numberOfLines={1} ellipsizeMode="tail">
                    {t.name || t.area}
                  </Text>
                </AnimatedScaleButton>
              );
            })}
          </ScrollView>
        </FadeInView>

        {/* 4. Pre-ordered Drinks */}
        <FadeInView delay={240} style={styles.sectionWrap}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionHeading}>4. Món Đặt Trước ({cart.length})</Text>
            <AnimatedScaleButton
              onPress={() =>
                navigation.navigate('CustomerTabs', {
                  screen: 'Menu',
                  params: { fromBooking: true },
                })
              }
            >
              <Text style={styles.viewMapText}>+ Thêm món</Text>
            </AnimatedScaleButton>
          </View>

          <BentoCard variant="elevated" padding="md">
            {cart.length === 0 ? (
              <View style={styles.emptyCartBox}>
                <Ionicons name="cafe-outline" size={32} color={colors.textMuted} />
                <Text style={styles.emptyCartText}>Chưa chọn món nước nào</Text>
                <AnimatedScaleButton
                  onPress={() =>
                    navigation.navigate('CustomerTabs', {
                      screen: 'Menu',
                      params: { fromBooking: true },
                    })
                  }
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
              <Text style={styles.summaryTotalLabel}>Tổng cọc cần thanh toán:</Text>
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
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  phoneHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 11,
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
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  selectedDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedDateBadgeText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  dateScroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xl,
  },
  dateChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  dateChipActive: {
    backgroundColor: colors.espresso,
    borderColor: colors.espresso,
  },
  dateChipDay: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateChipDayActive: {
    color: colors.textInverse,
  },
  dateChipDate: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  dateChipDateActive: {
    color: colors.primaryLight,
  },
  customDateRow: {
    marginTop: spacing.sm,
  },
  timeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  selectedTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedTimeBadgeText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  unselectedTimeHint: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  customTimeBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  customTimeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  customTimeInput: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 40,
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  timeScroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xl,
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
    paddingRight: spacing.xl,
  },
  tableChoiceCard: {
    width: 104,
    minHeight: 106,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tableChoiceCardActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  tableNumberBox: {
    paddingHorizontal: 8,
    height: 28,
    minWidth: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tableNumberBoxActive: {
    backgroundColor: colors.primary,
  },
  tableNumberBoxText: {
    fontSize: 14,
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
    alignItems: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
    gap: 4,
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.espresso,
    flex: 1,
    minWidth: 160,
  },
  summaryTotalVal: {
    fontSize: 18,
    fontWeight: '800',
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
    height: 76,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
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

