import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { FadeInView } from '../../components/FadeInView';
import {
  AdminDashboardPresenter,
  AdminDashboardViewInterface,
  AdminDashboardData,
} from '../../presenters/AdminDashboardPresenter';
import { useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { UserModel } from '../../models/UserModel';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  { key: 'AdminBookings', icon: 'calendar', label: 'Đặt Bàn',    desc: 'Duyệt & hủy vé',     color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'AdminTables',   icon: 'grid',     label: 'Quản Lý Bàn', desc: 'Sơ đồ & trạng thái', color: '#10B981', bg: '#ECFDF5' },
  { key: 'AdminMenu',     icon: 'cafe',     label: 'Thực Đơn',    desc: 'Món & giá tiền',      color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'AdminPromotions', icon: 'pricetag', label: 'Khuyến Mãi', desc: 'Mã giảm & ưu đãi', color: '#8B5CF6', bg: '#F5F3FF' },
  { key: 'AdminUsers',    icon: 'people',   label: 'Khách Hàng',  desc: 'Tài khoản & điểm',   color: '#EC4899', bg: '#FDF2F8' },
  { key: 'AdminUserTracking', icon: 'analytics', label: 'Phân Tích', desc: 'Thống kê & gợi ý', color: '#D97706', bg: '#FFFBEB' },
];

export const AdminDashboardView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const viewCallbacks: AdminDashboardViewInterface = {
    showLoading: (l) => { if (!refreshing) setLoading(l); },
    showError: (msg) => Alert.alert('Lỗi', msg),
    renderDashboard: (d) => { setData(d); setLoading(false); setRefreshing(false); },
  };

  const presenter = new AdminDashboardPresenter(viewCallbacks);

  const refreshData = useCallback(() => {
    presenter.loadDashboardData();
  }, []);

  useFocusEffect(useCallback(() => { refreshData(); }, [refreshData]));

  const handleLogout = () => {
    Alert.alert('Đăng Xuất', 'Bạn muốn đăng xuất quyền Quản trị?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => {
          await UserModel.logout();
          dispatch(logout());
        },
      },
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    refreshData();
  };

  const occupancyRate = data?.occupancyRate || 0;
  const occupancyColor = occupancyRate >= 80 ? '#DC2626' : occupancyRate >= 50 ? '#D97706' : '#16A34A';

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingHeader}>
          <Text style={styles.loadingBrand}>Pam Coffee & Tea</Text>
          <Text style={styles.loadingRole}>Trung tâm quản lý</Text>
        </View>
        <View style={styles.loadingBody}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.brandBadge}>
            <Ionicons name="shield-checkmark" size={12} color={colors.primaryDark} />
            <Text style={styles.brandBadgeText}>QUẢN LÝ</Text>
          </View>
          <Text style={styles.brandName}>Pam Coffee & Tea ☕</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => navigation.navigate('CustomerTabs')}
          >
            <Ionicons name="swap-horizontal-outline" size={15} color={colors.primaryDark} />
            <Text style={styles.switchBtnText}>Khách</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryDark]} tintColor={colors.primaryDark} />}
      >
        {/* ── Metrics Grid ── */}
        <FadeInView>
          {/* Row 1: Revenue (full width) */}
          <TouchableOpacity
            style={styles.revenueCard}
            onPress={() => navigation.navigate('AdminBookings')}
            activeOpacity={0.85}
          >
            <View style={styles.revenueLeft}>
              <View style={styles.revenueIconBox}>
                <Ionicons name="cash-outline" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.revenueLabel}>DOANH THU ƯỚC TÍNH</Text>
                <Text style={styles.revenueValue}>
                  {(data?.totalRevenue || 0).toLocaleString('vi-VN')}đ
                </Text>
                <Text style={styles.revenueSub}>Từ {data?.confirmedCount || 0} đơn đã xác nhận</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>

          {/* Row 2: 3 small metric cards */}
          <View style={styles.metricsRow}>
            {/* Pending orders */}
            <TouchableOpacity
              style={[styles.metricCard, { backgroundColor: '#FFF7ED' }]}
              onPress={() => navigation.navigate('AdminTables')}
              activeOpacity={0.85}
            >
              <View style={[styles.metricIcon, { backgroundColor: '#FED7AA' }]}>
                <Ionicons name="time-outline" size={18} color="#C2410C" />
              </View>
              <Text style={[styles.metricValue, { color: '#C2410C' }]}>
                {data?.pendingCount || 0}
              </Text>
              <Text style={styles.metricLabel}>Chờ duyệt</Text>
            </TouchableOpacity>

            {/* Occupancy */}
            <TouchableOpacity
              style={[styles.metricCard, { backgroundColor: '#F0FDF4' }]}
              onPress={() => navigation.navigate('AdminTables')}
              activeOpacity={0.85}
            >
              <View style={[styles.metricIcon, { backgroundColor: '#BBF7D0' }]}>
                <Ionicons name="pie-chart-outline" size={18} color={occupancyColor} />
              </View>
              <Text style={[styles.metricValue, { color: occupancyColor }]}>
                {occupancyRate}%
              </Text>
              <Text style={styles.metricLabel}>Lấp đầy</Text>
            </TouchableOpacity>

            {/* Total bookings */}
            <TouchableOpacity
              style={[styles.metricCard, { backgroundColor: '#EFF6FF' }]}
              onPress={() => navigation.navigate('AdminBookings')}
              activeOpacity={0.85}
            >
              <View style={[styles.metricIcon, { backgroundColor: '#BFDBFE' }]}>
                <Ionicons name="calendar-outline" size={18} color="#1D4ED8" />
              </View>
              <Text style={[styles.metricValue, { color: '#1D4ED8' }]}>
                {data?.totalReservations || 0}
              </Text>
              <Text style={styles.metricLabel}>Tổng đặt</Text>
            </TouchableOpacity>
          </View>

          {/* Table availability bar */}
          <View style={styles.availBar}>
            <View style={styles.availBarLeft}>
              <Ionicons name="grid-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.availBarText}>
                Bàn trống: <Text style={{ color: '#16A34A', fontWeight: '800' }}>{data?.availableTables || 0}</Text>/{data?.totalTables || 0}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${100 - occupancyRate}%` as any,
                    backgroundColor: '#16A34A',
                  },
                ]}
              />
            </View>
          </View>
        </FadeInView>

        {/* ── Management Grid ── */}
        <FadeInView delay={80} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phân Hệ Quản Lý</Text>
            <Text style={styles.sectionSub}>Chọn khu vực cần xử lý</Text>
          </View>
          <View style={styles.navGrid}>
            {NAV_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.navCard, { backgroundColor: item.bg }]}
                onPress={() => navigation.navigate(item.key)}
                activeOpacity={0.8}
              >
                <View style={[styles.navIconBox, { backgroundColor: item.color + '25' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={[styles.navLabel, { color: item.color }]}>{item.label}</Text>
                <Text style={styles.navDesc}>{item.desc}</Text>
                <View style={styles.navArrow}>
                  <Ionicons name="chevron-forward" size={12} color={item.color + '99'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </FadeInView>

        {/* ── Recent Reservations ── */}
        <FadeInView delay={160} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn Đặt Bàn Mới Nhất</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminTables')}>
              <Text style={styles.seeAllText}>Xem tất cả →</Text>
            </TouchableOpacity>
          </View>

          {!data?.recentReservations || data.recentReservations.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>Chưa có đơn đặt bàn nào</Text>
            </View>
          ) : (
            data.recentReservations.map((res, i) => {
              const statusMap: Record<string, { label: string; color: string; bg: string }> = {
                CONFIRMED: { label: 'Đã duyệt', color: '#16A34A', bg: '#DCFCE7' },
                PENDING:   { label: 'Chờ duyệt', color: '#D97706', bg: '#FEF3C7' },
                CANCELLED: { label: 'Đã hủy',   color: '#DC2626', bg: '#FEE2E2' },
              };
              const sc = statusMap[res.status] || statusMap.PENDING;

              return (
                <View key={res.id} style={styles.resCard}>
                  <View style={styles.resCardTop}>
                    <View style={styles.resAvatar}>
                      <Text style={styles.resAvatarText}>
                        {(res.customerName || 'K').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.resInfo}>
                      <Text style={styles.resCustName}>{res.customerName || 'Khách hàng'}</Text>
                      <Text style={styles.resMeta}>
                        Bàn {res.tableNumber} • {res.reservationDate} lúc {res.reservationTime}
                      </Text>
                    </View>
                    <View style={[styles.resBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.resBadgeText, { color: sc.color }]}>{sc.label}</Text>
                    </View>
                  </View>

                  {res.status === 'PENDING' && (
                    <View style={styles.resActions}>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={async () => {
                          await presenter.approveReservation(res.id);
                          refreshData();
                        }}
                      >
                        <Ionicons name="checkmark-circle-outline" size={15} color="#fff" />
                        <Text style={styles.approveBtnText}>Duyệt Ngay</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={async () => {
                          await presenter.rejectReservation(res.id);
                          refreshData();
                        }}
                      >
                        <Text style={styles.rejectBtnText}>Từ Chối</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </FadeInView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const CARD_GAP = 10;
const CARD_WIDTH = (width - spacing.lg * 2 - CARD_GAP * 2) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F0' },

  // Loading
  loadingHeader: { padding: spacing.xl, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  loadingBrand: { ...typography.h1 },
  loadingRole: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  loadingBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { ...typography.body, color: colors.textMuted },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.soft,
  },
  headerLeft: { gap: 3 },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  brandBadgeText: { fontSize: 10, fontWeight: '800', color: colors.primaryDark, letterSpacing: 0.5 },
  brandName: { ...typography.h2, fontSize: 20 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchBtnText: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  logoutBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.dangerSubtle,
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { padding: spacing.lg },

  // Revenue card
  revenueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.espresso,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  revenueLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  revenueIconBox: {
    width: 48, height: 48, borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  revenueLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.8 },
  revenueValue: { fontSize: 22, fontWeight: '900', color: '#fff', marginTop: 2 },
  revenueSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  // Metrics row
  metricsRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'flex-start',
    gap: 4,
    ...shadows.soft,
  },
  metricIcon: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  metricValue: { fontSize: 22, fontWeight: '900', lineHeight: 26 },
  metricLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  // Availability bar
  availBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  availBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 110 },
  availBarText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  progressTrack: {
    flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 4 },

  // Section
  section: { marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, fontSize: 17, fontWeight: '800' },
  sectionSub: { ...typography.caption, color: colors.textMuted },
  seeAllText: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },

  // Nav grid
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  navCard: {
    width: (width - spacing.lg * 2 - CARD_GAP) / 2,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 2,
    position: 'relative',
    ...shadows.soft,
  },
  navIconBox: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  navLabel: { fontSize: 15, fontWeight: '800' },
  navDesc: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  navArrow: { position: 'absolute', top: spacing.md, right: spacing.md },

  // Recent reservations
  resCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  resCardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  resAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.espresso,
    alignItems: 'center', justifyContent: 'center',
  },
  resAvatarText: { color: '#fff', fontWeight: '900', fontSize: 17 },
  resInfo: { flex: 1 },
  resCustName: { ...typography.bodyLarge, fontWeight: '800' },
  resMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  resBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  resBadgeText: { fontSize: 11, fontWeight: '800' },
  resActions: {
    flexDirection: 'row', gap: spacing.sm,
    marginTop: spacing.sm, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, height: 38, borderRadius: radius.lg, backgroundColor: '#16A34A',
  },
  approveBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  rejectBtn: {
    flex: 1, height: 38, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEE2E2', borderWidth: 1.5, borderColor: '#DC2626',
  },
  rejectBtnText: { color: '#DC2626', fontWeight: '800', fontSize: 13 },

  // Empty
  emptyBox: {
    alignItems: 'center', paddingVertical: spacing.xl,
    backgroundColor: '#fff', borderRadius: radius.xl, gap: spacing.sm,
  },
  emptyText: { ...typography.body, color: colors.textMuted },
});

export default AdminDashboardView;
