import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CoffeeContext } from '../../context/CoffeeContext';
import { MyBookingsPresenter } from '../../presenters/MyBookingsPresenter';
import { colors } from '../../theme/colors';

const STATUS_FILTERS = ['Tất cả', 'PENDING', 'CONFIRMED', 'CANCELLED'];

export default function MyBookingsView({ navigation }) {
  const { user, token } = useContext(AuthContext);
  const { reservations, updateReservationStatus } = useContext(CoffeeContext);
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');

  // Passive View Contract Implementation
  const viewContract = useMemo(() => ({
    showLoading: () => { },
    showError: (msg) => Alert.alert('Lỗi', msg),
    displayReservations: () => { },
    onCancelSuccess: (id) => {
      updateReservationStatus(id, 'CANCELLED');
      Alert.alert('Thành công', 'Đã hủy lịch đặt bàn');
    }
  }), [updateReservationStatus]);

  const presenter = useMemo(() => new MyBookingsPresenter(viewContract), [viewContract]);

  const myReservations = useMemo(() => {
    let list = reservations;
    if (user?.role === 'CUSTOMER' && user.id) {
      list = list.filter(r => !r.userId || r.userId === user.id);
    }
    return presenter.filterReservations(list, selectedFilter);
  }, [presenter, reservations, user, selectedFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Chờ Quán Duyệt', bg: colors.warningLight, text: colors.warning, dot: colors.warning };
      case 'CONFIRMED':
        return { label: 'Đã Xác Nhận', bg: colors.successLight, text: colors.success, dot: colors.success };
      case 'CANCELLED':
        return { label: 'Đã Hủy Bàn', bg: colors.dangerLight, text: colors.danger, dot: colors.danger };
      default:
        return { label: status, bg: colors.surface, text: colors.textMuted, dot: colors.textMuted };
    }
  };

  const handleCancel = (booking) => {
    Alert.alert(
      'Hủy Đặt Bàn',
      `Bạn có chắc chắn muốn hủy lượt đặt bàn tại ${booking.coffeeTable?.name || 'quán'} không?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Xác Nhận Hủy',
          style: 'destructive',
          onPress: () => presenter.cancelBooking(booking.id, booking.coffeeTable?.id, token)
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch Đặt Bàn Của Tôi</Text>
        <Text style={styles.headerSub}>
          [Kiến Trúc MVP] Quản lý và theo dõi tiến trình phê duyệt đặt bàn
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {STATUS_FILTERS.map(f => {
            const active = selectedFilter === f;
            const label = f === 'Tất cả' ? 'Tất cả' : f === 'PENDING' ? 'Chờ duyệt' : f === 'CONFIRMED' ? 'Đã xác nhận' : 'Đã hủy';
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.listContainer}>
        {myReservations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyTitle}>Chưa có lượt đặt bàn nào</Text>
            <Text style={styles.emptySub}>Hãy chọn bàn ưng ý và đặt ngay hôm nay!</Text>
            <TouchableOpacity
              style={styles.bookNowBtn}
              onPress={() => navigation.navigate('BookingTab')}
            >
              <Text style={styles.bookNowBtnText}>Đặt Bàn Ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myReservations.map(booking => {
            const badge = getStatusBadge(booking.status);
            return (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('BookingDetail', { booking })}
              >
                <View style={styles.cardTop}>
                  <View style={styles.tableTitleBox}>
                    <Text style={styles.tableName}>
                      {booking.coffeeTable?.name || `Bàn #${booking.tableId || '01'}`}
                    </Text>
                    <Text style={styles.bookingTime}>
                      🕒 {booking.timeDisplay || '19:00 - Hôm nay'}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <View style={[styles.badgeDot, { backgroundColor: badge.dot }]} />
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailItem}>👥 {booking.guestNumber || 2} khách</Text>
                  <Text style={styles.detailItem}>📞 {booking.customerPhone || '0901234567'}</Text>
                </View>

                {booking.note ? (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteLabel}>Ghi chú:</Text>
                    <Text style={styles.noteText}>{booking.note}</Text>
                  </View>
                ) : null}

                {booking.orderItems && booking.orderItems.length > 0 && (
                  <View style={styles.orderItemsSection}>
                    <Text style={styles.orderItemsTitle}>Món uống đặt trước:</Text>
                    {booking.orderItems.map((oi, index) => (
                      <View key={index} style={styles.orderItemRow}>
                        <Text style={styles.orderItemName}>
                          • {oi.menuItem?.name || 'Món nước'}
                        </Text>
                        <Text style={styles.orderItemQty}>x{oi.quantity || 1}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {booking.status === 'PENDING' && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancel(booking)}
                    >
                      <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
                      <Text style={styles.cancelBtnText}>Hủy Đặt Bàn Này</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView >
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
  filterRow: {
    gap: 8,
    marginTop: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  bookNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookNowBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  bookingCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tableTitleBox: {
    flex: 1,
  },
  tableName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  bookingTime: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  detailItem: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  noteBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  noteText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
  orderItemsSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
  },
  orderItemsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 4,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  orderItemName: {
    fontSize: 12,
    color: colors.text,
  },
  orderItemQty: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  cardActions: {
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.dangerLight,
  },
  cancelBtnText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '700',
  },
});

