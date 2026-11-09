import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CoffeeContext } from '../../context/CoffeeContext';
import { colors } from '../../theme/colors';

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'];

export default function AdminBookingsView() {
  const { token } = useContext(AuthContext);
  const { reservations, updateReservationStatus } = useContext(CoffeeContext);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      const matchFilter = filter === 'ALL' || r.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !search ||
        (r.customerName && r.customerName.toLowerCase().includes(q)) ||
        (r.customerPhone && r.customerPhone.includes(q)) ||
        (r.coffeeTable?.name && r.coffeeTable.name.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [reservations, filter, search]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return { label: 'Chờ duyệt', bg: colors.warningLight, text: colors.warning };
      case 'CONFIRMED': return { label: 'Đã duyệt', bg: colors.successLight, text: colors.success };
      case 'CANCELLED': return { label: 'Đã hủy', bg: colors.dangerLight, text: colors.danger };
      default: return { label: status, bg: colors.surface, text: colors.textMuted };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên khách, SĐT, số bàn..."
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => {
            const active = filter === f;
            const label = f === 'ALL' ? 'Tất cả' : f === 'PENDING' ? 'Chờ duyệt' : f === 'CONFIRMED' ? 'Đã duyệt' : 'Đã hủy';
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filteredReservations.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Không tìm thấy lượt đặt bàn nào phù hợp</Text>
          </View>
        ) : (
          filteredReservations.map(booking => {
            const badge = getStatusBadge(booking.status);
            return (
              <View key={booking.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.customerName}>{booking.customerName || 'Khách Vãng Lai'}</Text>
                    <Text style={styles.customerPhone}>📞 {booking.customerPhone || 'Chưa có SĐT'}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoItem}>🪑 {booking.coffeeTable?.name || 'Bàn chưa chọn'}</Text>
                  <Text style={styles.infoItem}>👥 {booking.guestNumber} người</Text>
                  <Text style={styles.infoItem}>🕒 {booking.timeDisplay || 'Hôm nay'}</Text>
                </View>

                {booking.note ? (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteText}>Ghi chú: {booking.note}</Text>
                  </View>
                ) : null}

                <View style={styles.actionRow}>
                  {booking.status === 'PENDING' && (
                    <>
                      <TouchableOpacity
                        style={[styles.btn, styles.confirmBtn]}
                        onPress={() => {
                          updateReservationStatus(booking.id, 'CONFIRMED');
                          Alert.alert('Thành công', 'Đã duyệt lịch đặt bàn!');
                        }}
                      >
                        <Ionicons name="checkmark" size={16} color="#fff" />
                        <Text style={styles.btnTextWhite}>Duyệt Ngay</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.btn, styles.cancelBtn]}
                        onPress={() => updateReservationStatus(booking.id, 'CANCELLED')}
                      >
                        <Ionicons name="close" size={16} color={colors.danger} />
                        <Text style={styles.btnTextDanger}>Từ Chối</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {booking.status === 'CONFIRMED' && (
                    <TouchableOpacity
                      style={[styles.btn, styles.cancelBtn]}
                      onPress={() => updateReservationStatus(booking.id, 'CANCELLED')}
                    >
                      <Ionicons name="close" size={16} color={colors.danger} />
                      <Text style={styles.btnTextDanger}>Hủy Lượt Này</Text>
                    </TouchableOpacity>
                  )}

                  {booking.status === 'CANCELLED' && (
                    <TouchableOpacity
                      style={[styles.btn, styles.reopenBtn]}
                      onPress={() => updateReservationStatus(booking.id, 'PENDING')}
                    >
                      <Ionicons name="refresh" size={16} color={colors.primary} />
                      <Text style={styles.reopenBtnText}>Mở Lại Chờ Duyệt</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    backgroundColor: colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  filterRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  customerPhone: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  infoItem: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  noteBox: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
    paddingTop: 10,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  confirmBtn: {
    backgroundColor: colors.success,
  },
  cancelBtn: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  reopenBtn: {
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  btnTextWhite: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  btnTextDanger: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  reopenBtnText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
});

