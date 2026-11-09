import React, { useMemo, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CoffeeContext } from '../../context/CoffeeContext';
import { AdminDashboardPresenter } from '../../presenters/AdminDashboardPresenter';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../config/api';

const { width } = Dimensions.get('window');

export default function AdminDashboardView({ navigation }) {
  const { user, token } = useContext(AuthContext);
  const { tables, reservations, refreshData } = useContext(CoffeeContext);

  // Passive View Contract
  const viewContract = useMemo(() => ({
    showLoading: () => {},
    showError: (msg) => Alert.alert('Lỗi', msg),
    onActionSuccess: (msg) => {
      refreshData();
      Alert.alert('Thành công', msg);
    }
  }), [refreshData]);

  const presenter = useMemo(() => new AdminDashboardPresenter(viewContract), [viewContract]);

  const metrics = useMemo(
    () => presenter.calculateMetrics(reservations, tables),
    [presenter, reservations, tables]
  );

  const handleApprove = (booking) => {
    presenter.approveBooking(booking.id, booking.coffeeTable?.id, token);
  };

  const handleReject = (booking) => {
    Alert.alert(
      'Hủy Đặt Bàn',
      'Bạn có chắc chắn muốn từ chối lượt đặt bàn này?',
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Từ Chối',
          style: 'destructive',
          onPress: () => presenter.rejectBooking(booking.id, booking.coffeeTable?.id, token)
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Bảng Quản Trị Quán</Text>
            <Text style={styles.headerSub}>
              [Kiến Trúc MVP] {user?.fullName || 'Admin'} ({user?.role})
            </Text>
          </View>
          <TouchableOpacity
            style={styles.customerViewBtn}
            onPress={() => navigation.navigate('CustomerTabs')}
          >
            <Ionicons name="cafe-outline" size={16} color={colors.primary} />
            <Text style={styles.customerViewText}>Giao diện Khách</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Metric Cards Grid */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
            <View style={styles.metricIconBox}>
              <Ionicons name="cash-outline" size={20} color="#b45309" />
            </View>
            <Text style={styles.metricLabel}>Doanh thu hôm nay</Text>
            <Text style={[styles.metricValue, { color: '#b45309' }]}>
              {formatCurrency(metrics.totalRevenue)}
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
            <View style={styles.metricIconBox}>
              <Ionicons name="calendar-outline" size={20} color="#15803d" />
            </View>
            <Text style={styles.metricLabel}>Lượt đặt bàn</Text>
            <Text style={[styles.metricValue, { color: '#15803d' }]}>
              {reservations.length} lượt
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
            <View style={styles.metricIconBox}>
              <Ionicons name="people-outline" size={20} color="#b91c1c" />
            </View>
            <Text style={styles.metricLabel}>Bàn đang có khách</Text>
            <Text style={[styles.metricValue, { color: '#b91c1c' }]}>
              {metrics.occupiedCount} bàn
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }]}>
            <View style={styles.metricIconBox}>
              <Ionicons name="checkbox-outline" size={20} color="#0369a1" />
            </View>
            <Text style={styles.metricLabel}>Bàn còn trống</Text>
            <Text style={[styles.metricValue, { color: '#0369a1' }]}>
              {metrics.availableCount} / {metrics.totalTables}
            </Text>
          </View>
        </View>

        {/* Shortcuts */}
        <Text style={styles.sectionTitle}>Chức năng quản trị</Text>
        <View style={styles.shortcutList}>
          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('AdminBookings')}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="calendar" size={22} color="#b45309" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shortcutName}>Quản lý Đặt bàn</Text>
              <Text style={styles.shortcutDesc}>Duyệt và kiểm tra các lượt đặt bàn</Text>
            </View>
            {metrics.pendingCount > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{metrics.pendingCount} mới</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('AdminTables')}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="restaurant" size={22} color="#15803d" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shortcutName}>Quản lý Sơ đồ bàn</Text>
              <Text style={styles.shortcutDesc}>Thêm bàn, sửa trạng thái, thuộc tính bàn</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('AdminMenu')}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="cafe" size={22} color="#0369a1" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shortcutName}>Quản lý Thực đơn</Text>
              <Text style={styles.shortcutDesc}>Cập nhật món nước, giá tiền & tình trạng còn hàng</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="people" size={22} color="#be185d" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shortcutName}>Quản lý Tài khoản</Text>
              <Text style={styles.shortcutDesc}>Khóa / mở khóa tài khoản, phân quyền nhân viên</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Pending Approvals */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Đặt bàn cần xử lý ngay ({metrics.pendingCount})</Text>
        </View>

        {metrics.pendingCount === 0 ? (
          <View style={styles.noPendingBox}>
            <Ionicons name="checkmark-done-circle-outline" size={36} color={colors.success} />
            <Text style={styles.noPendingText}>Không có yêu cầu đặt bàn nào đang chờ duyệt</Text>
          </View>
        ) : (
          metrics.pendingList.map(booking => (
            <View key={booking.id} style={styles.pendingCard}>
              <View style={styles.pendingTop}>
                <View>
                  <Text style={styles.pendingCustomer}>{booking.customerName || 'Khách đặt'}</Text>
                  <Text style={styles.pendingPhone}>📞 {booking.customerPhone} • {booking.guestNumber} người</Text>
                </View>
                <View style={styles.pendingTableBadge}>
                  <Text style={styles.pendingTableText}>{booking.coffeeTable?.name}</Text>
                </View>
              </View>

              <Text style={styles.pendingTime}>🕒 Giờ hẹn: {booking.timeDisplay}</Text>
              {booking.note ? <Text style={styles.pendingNote}>Note: {booking.note}</Text> : null}

              <View style={styles.actionBtnRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleApprove(booking)}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.approveBtnText}>Duyệt Bàn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleReject(booking)}
                >
                  <Ionicons name="close" size={16} color={colors.danger} />
                  <Text style={styles.rejectBtnText}>Từ Chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  customerViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  customerViewText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: (width - 42) / 2,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  shortcutList: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  shortcutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  shortcutIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  shortcutDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  pendingBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 4,
  },
  pendingBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  noPendingBox: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  noPendingText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  pendingCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  pendingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pendingCustomer: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  pendingPhone: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  pendingTableBadge: {
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pendingTableText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  pendingTime: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  pendingNote: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
  },
  approveBtn: {
    backgroundColor: colors.success,
  },
  approveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  rejectBtn: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  rejectBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});

