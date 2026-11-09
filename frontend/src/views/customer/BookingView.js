import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CoffeeContext } from '../../context/CoffeeContext';
import { BookingPresenter } from '../../presenters/BookingPresenter';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../config/api';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:30',
  '14:00', '15:30', '17:00', '18:30',
  '19:30', '20:30', '21:00'
];

const GUEST_OPTIONS = [1, 2, 4, 6, 8, 10];

export default function BookingView({ navigation }) {
  const { user, token } = useContext(AuthContext);
  const {
    tables,
    menu,
    selectedTableForBooking,
    setSelectedTableForBooking,
    preOrder,
    updatePreOrderQty,
    clearPreOrder,
    refreshData
  } = useContext(CoffeeContext);

  const [selectedDate, setSelectedDate] = useState('Hôm nay');
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [guestCount, setGuestCount] = useState(2);
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [note, setNote] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Passive View Contract Implementation
  const viewContract = useMemo(() => ({
    showLoading: (isLoading) => setSubmitting(isLoading),
    showError: (msg) => Alert.alert('Thông báo', msg),
    clearError: () => setErrorMessage(''),
    onBookingSuccess: (reservation) => {
      setCreatedBooking(reservation);
      setSuccessModalVisible(true);
      refreshData();
    }
  }), [refreshData]);

  // MVP Presenter
  const presenter = useMemo(() => new BookingPresenter(viewContract), [viewContract]);

  const preOrderTotal = useMemo(
    () => presenter.calculatePreOrderTotal(preOrder, menu),
    [presenter, preOrder, menu]
  );
  const preOrderCount = Object.values(preOrder).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (selectedTableForBooking) {
      setSelectedTable(selectedTableForBooking);
    }
  }, [selectedTableForBooking]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.fullName || user.username || '');
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  const handleSelectTable = (table) => {
    if (table.status !== 'AVAILABLE') {
      Alert.alert('Bàn không khả dụng', 'Bàn này hiện đã có khách đặt hoặc đang dùng. Vui lòng chọn bàn khác còn trống.');
      return;
    }
    setSelectedTable(table);
    setSelectedTableForBooking(table);
  };

  const handleSubmit = () => {
    presenter.submitBooking({
      customerName,
      customerPhone,
      customerEmail: user?.email,
      selectedTable,
      selectedDate,
      selectedTime,
      guestCount,
      note,
      preOrder,
      menuList: menu,
      token
    });
  };

  const handleFinishSuccess = () => {
    setSuccessModalVisible(false);
    setSelectedTable(null);
    clearPreOrder();
    setNote('');
    navigation.navigate('MyBookingsTab');
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt Bàn Trực Tuyến</Text>
        <Text style={styles.headerSub}>
          [Kiến Trúc MVP] Chọn vị trí và thực đơn pha chế sẵn cho buổi hẹn của bạn
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* 1. Date selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionCardTitle}>1. Chọn ngày đến</Text>
          </View>
          <View style={styles.chipsRow}>
            {['Hôm nay', 'Ngày mai', 'Ngày kia'].map(d => {
              const active = selectedDate === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.dateChip, active && styles.dateChipActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Time selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionCardTitle}>2. Chọn khung giờ</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeSlotsRow}>
            {TIME_SLOTS.map(time => {
              const active = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>{time}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. Guests count */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionCardTitle}>3. Số lượng khách</Text>
          </View>
          <View style={styles.chipsRow}>
            {GUEST_OPTIONS.map(num => {
              const active = guestCount === num;
              return (
                <TouchableOpacity
                  key={num}
                  style={[styles.guestChip, active && styles.guestChipActive]}
                  onPress={() => setGuestCount(num)}
                >
                  <Text style={[styles.guestChipText, active && styles.guestChipTextActive]}>
                    {num} {num >= 10 ? '+' : ''} khách
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Select Table */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionCardTitle}>4. Chọn bàn muốn ngồi</Text>
          </View>
          <Text style={styles.guideText}>
            Chạm vào bàn có viền xanh lá (còn trống) để chọn:
          </Text>

          <View style={styles.tableGrid}>
            {tables.map(table => {
              const isSelected = selectedTable?.id === table.id;
              const isAvailable = table.status === 'AVAILABLE';

              return (
                <TouchableOpacity
                  key={table.id}
                  style={[
                    styles.tableBox,
                    isSelected && styles.tableBoxSelected,
                    !isAvailable && styles.tableBoxDisabled
                  ]}
                  onPress={() => handleSelectTable(table)}
                  activeOpacity={isAvailable ? 0.7 : 1}
                >
                  <View style={styles.tableTop}>
                    <Text style={[styles.tableBoxName, isSelected && { color: colors.primaryDark }]}>
                      {table.name}
                    </Text>
                    <View
                      style={[
                        styles.indicatorDot,
                        { backgroundColor: isAvailable ? colors.success : colors.danger }
                      ]}
                    />
                  </View>
                  <Text style={styles.tableBoxSeats}>👥 {table.seats} ghế • {table.type}</Text>
                  
                  <View style={styles.amenityRow}>
                    {table.isNearWindow && <Text style={styles.tag}>Cửa sổ</Text>}
                    {table.isOutdoor && <Text style={styles.tag}>Sân vườn</Text>}
                    {table.hasSocket && <Text style={styles.tag}>Ổ cắm</Text>}
                  </View>

                  <Text
                    style={[
                      styles.tableStatusText,
                      { color: isAvailable ? colors.success : colors.danger }
                    ]}
                  >
                    {isSelected ? '✓ Đang chọn' : isAvailable ? 'Còn trống' : 'Đã kín'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Pre-order Drinks */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="cafe-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionCardTitle}>5. Đặt trước thức uống (tùy chọn)</Text>
          </View>
          <Text style={styles.guideText}>
            Quán sẽ chuẩn bị sẵn đồ uống nóng/lạnh ngay khi bạn vừa đến:
          </Text>

          <View style={styles.preOrderList}>
            {menu.slice(0, 5).map(item => {
              const qty = preOrder[item.id] || 0;
              return (
                <View key={item.id} style={styles.preOrderItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.preOrderName}>{item.name}</Text>
                    <Text style={styles.preOrderPrice}>{formatCurrency(item.price)}</Text>
                  </View>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updatePreOrderQty(item.id, -1)}
                      disabled={qty === 0}
                    >
                      <Ionicons name="remove" size={16} color={qty === 0 ? colors.textLight : colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{qty}</Text>
                    <TouchableOpacity
                      style={[styles.qtyBtn, styles.qtyBtnAdd]}
                      onPress={() => updatePreOrderQty(item.id, 1)}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {preOrderCount > 0 && (
            <View style={styles.preOrderSummaryBox}>
              <Text style={styles.preOrderSummaryText}>
                Đã chọn <Text style={{ fontWeight: '700' }}>{preOrderCount} món</Text>
              </Text>
              <Text style={styles.preOrderSummaryTotal}>{formatCurrency(preOrderTotal)}</Text>
            </View>
          )}
        </View>

        {/* 6. Contact & Note */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionCardTitle}>6. Thông tin liên hệ & Ghi chú</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ tên người đặt *</Text>
            <TextInput
              style={styles.textInput}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Nguyễn Văn A"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại liên hệ *</Text>
            <TextInput
              style={styles.textInput}
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="0901234567"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ghi chú cho quán (nếu có)</Text>
            <TextInput
              style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
              value={note}
              onChangeText={setNote}
              placeholder="vd: Cần góc yên tĩnh học nhóm, thêm ổ cắm sạc laptop..."
              multiline
            />
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm tắt đặt bàn</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Bàn đã chọn:</Text>
            <Text style={styles.summaryValue}>
              {selectedTable ? selectedTable.name : 'Chưa chọn bàn'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thời gian:</Text>
            <Text style={styles.summaryValue}>{selectedTime} • {selectedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số lượng khách:</Text>
            <Text style={styles.summaryValue}>{guestCount} người</Text>
          </View>
          {preOrderCount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính nước uống:</Text>
              <Text style={[styles.summaryValue, { color: colors.primaryDark }]}>
                {formatCurrency(preOrderTotal)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.confirmBtn, submitting && { opacity: 0.8 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>Xác Nhận Đặt Bàn Ngay</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.successIconBox}>
              <Ionicons name="checkmark" size={38} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Đặt Bàn Thành Công!</Text>
            <Text style={styles.successMsg}>
              Quán Pam Coffee & Tea đã nhận thông tin đặt bàn của bạn ({createdBooking?.coffeeTable?.name}) vào lúc {createdBooking?.timeDisplay}.
            </Text>

            <TouchableOpacity style={styles.modalDoneBtn} onPress={handleFinishSuccess}>
              <Text style={styles.modalDoneText}>Xem Lịch Đặt Bàn Của Tôi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  formContainer: {
    padding: 16,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  guideText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateChipActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dateChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  timeSlotsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  timeChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  guestChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestChipActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  guestChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  guestChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tableBox: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tableBoxSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  tableBoxDisabled: {
    opacity: 0.55,
    backgroundColor: '#f5f5f4',
  },
  tableTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableBoxName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tableBoxSeats: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  tag: {
    fontSize: 9,
    backgroundColor: '#e7e5e4',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tableStatusText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  preOrderList: {
    gap: 10,
  },
  preOrderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  preOrderName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  preOrderPrice: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtnAdd: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
    color: colors.text,
  },
  preOrderSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySubtle,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  preOrderSummaryText: {
    fontSize: 13,
    color: colors.text,
  },
  preOrderSummaryTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  successIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  successMsg: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalDoneBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalDoneText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

