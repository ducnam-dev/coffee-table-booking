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

// Tone màu ấm cà phê đồng bộ giao diện gốc của ứng dụng (espresso, amber, white)
const NAV_ITEMS = [
  { key: 'AdminBookings',    icon: 'clipboard-outline',  label: 'QL Đặt Bàn',    desc: 'Duyệt & hủy vé' },
  { key: 'AdminTables',      icon: 'grid-outline',       label: 'QL Bàn',         desc: 'Sơ đồ & thêm bàn' },
  { key: 'AdminMenu',        icon: 'cafe-outline',       label: 'QL Menu',        desc: 'Thêm món & giá' },
  { key: 'AdminPromotions',  icon: 'pricetag-outline',   label: 'QL Khuyến Mãi', desc: 'Mã giảm & ưu đãi' },
  { key: 'AdminUsers',       icon: 'people-outline',     label: 'QL Khách Hàng', desc: 'Tài khoản & điểm' },
  { key: 'AdminUserTracking',icon: 'analytics-outline',  label: 'QL Tracking',   desc: 'Thống kê & gợi ý', isHighlight: true },
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

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pam Coffee & Tea</Text>
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
          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primaryDark} />
            <Text style={styles.roleTitle}>TRUNG TÂM QUẢN LÝ (MANAGER)</Text>
          </View>
          <Text style={styles.headerTitle}>Pam Coffee & Tea</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => navigation.navigate('CustomerTabs')}
          >
            <Ionicons name="swap-horizontal" size={15} color={colors.textPrimary} />
            <Text style={styles.switchBtnText}>Giao diện Khách</Text>
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
        {/* ── BENTO METRICS ── */}
        <FadeInView>
          {/* Row 1: Doanh thu (Dark Bento) */}
          <TouchableOpacity
            style={styles.revenueCard}
            onPress={() => navigation.navigate('AdminBookings')}
            activeOpacity={0.85}
          >
            <View style={styles.revenueLeft}>
              <View style={styles.revenueIconBox}>
                <Ionicons name="cash-outline" size={22} color={colors.primaryLight} />
              </View>
              <View>
                <Text style={styles.revenueLabel}>DOANH THU ƯỚC TÍNH</Text>
                <Text style={styles.revenueValue}>
                  {(data?.totalRevenue || 0).toLocaleString('vi-VN')} đ
                </Text>
                <Text style={styles.revenueSub}>Bấm để xem chi tiết</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textInverseMuted} />
          </TouchableOpacity>

          {/* Row 2: 3 ô metric tone màu ấm gốc (Chờ duyệt: Amber, Lấp đầy & Tổng đặt: SurfaceElevated trắng kem) */}
          <View style={styles.metricsRow}>
            {/* 1. Đơn chờ duyệt (Amber card) */}
            <TouchableOpacity
              style={[styles.metricCard, styles.metricCardAmber]}
              onPress={() => navigation.navigate('AdminTables')}
              activeOpacity={0.85}
            >
              <View style={styles.metricCardHeader}>
                <View style={styles.metricIconWrap}>
                  <Ionicons name="time-outline" size={18} color={colors.primaryDark} />
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.espresso} />
              </View>
              <Text style={styles.metricValAmber}>{data?.pendingCount || 0} đơn</Text>
              <Text style={styles.metricLblAmber}>Đơn chờ duyệt</Text>
            </TouchableOpacity>

            {/* 2. Tỷ lệ lấp đầy */}
            <TouchableOpacity
              style={styles.metricCard}
              onPress={() => navigation.navigate('AdminTables')}
              activeOpacity={0.85}
            >
              <View style={styles.metricCardHeader}>
                <View style={styles.metricIconWrap}>
                  <Ionicons name="pie-chart-outline" size={18} color={colors.espresso} />
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </View>
              <Text style={styles.metricValNormal}>{occupancyRate}%</Text>
              <Text style={styles.metricLblNormal}>Tỷ lệ lấp đầy</Text>
            </TouchableOpacity>

            {/* 3. Tổng lượt đặt */}
            <TouchableOpacity
              style={styles.metricCard}
              onPress={() => navigation.navigate('AdminBookings')}
              activeOpacity={0.85}
            >
              <View style={styles.metricCardHeader}>
                <View style={styles.metricIconWrap}>
                  <Ionicons name="calendar-outline" size={18} color={colors.espresso} />
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
              </View>
              <Text style={styles.metricValNormal}>{data?.totalReservations || 0} lượt</Text>
              <Text style={styles.metricLblNormal}>Tổng lượt đặt</Text>
            </TouchableOpacity>
          </View>

          {/* Thanh trạng thái bàn trống tinh gọn */}
          <View style={styles.availBar}>
            <View style={styles.availBarLeft}>
              <Ionicons name="grid-outline" size={15} color={colors.textSecondary} />
              <Text style={styles.availBarText}>
                Bàn trống: <Text style={styles.availBarHighlight}>{data?.availableTables || 0}</Text>/{data?.totalTables || 0} bàn
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, Math.max(0, 100 - occupancyRate))}%` as any },
                ]}
              />
            </View>
          </View>
        </FadeInView>

        {/* ── Phân Hệ Quản Lý (Lưới thẻ hiện đại, tone màu cà phê chuẩn) ── */}
        <FadeInView delay={80} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phân Hệ Quản Lý</Text>
            <Text style={styles.sectionSub}>Chọn khu vực cần xử lý và cập nhật dữ liệu</Text>
          </View>

          <View style={styles.navGrid}>
            {NAV_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.navCard,
                  item.isHighlight && styles.navCardHighlight,
                ]}
                onPress={() => navigation.navigate(item.key)}
                activeOpacity={0.8}
              >
                <View style={[styles.navIconBox, item.isHighlight && styles.navIconBoxHighlight]}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.isHighlight ? colors.primaryDark : colors.primary}
                  />
                </View>
                <Text style={styles.navLabel}>{item.label}</Text>
                <Text style={styles.navDesc}>{item.desc}</Text>
                <View style={styles.navArrow}>
                  <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </FadeInView>

        {/* ── Đơn Đặt Bàn Mới Nhất ── */}
        <FadeInView delay={160} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn Đặt Bàn Mới Nhất</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminTables')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {!data?.recentReservations || data.recentReservations.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>Chưa có đơn đặt bàn nào</Text>
            </View>
          ) : (
            data.recentReservations.map((res) => {
              const isConfirmed = res.status === 'CONFIRMED';
              const isPending = res.status === 'PENDING';

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
                    <View
                      style={[
                        styles.resBadge,
                        isConfirmed
                          ? styles.badgeSuccess
                          : isPending
                          ? styles.badgeWarning
                          : styles.badgeDanger,
                      ]}
                    >
                      <Text
                        style={[
                          styles.resBadgeText,
                          isConfirmed
                            ? styles.badgeTextSuccess
                            : isPending
                            ? styles.badgeTextWarning
                            : styles.badgeTextDanger,
                        ]}
                      >
                        {isConfirmed ? 'Đã duyệt' : isPending ? 'Chờ duyệt' : 'Đã hủy'}
                      </Text>
                    </View>
                  </View>

                  {isPending && (
                    <View style={styles.resActions}>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={async () => {
                          await presenter.approveReservation(res.id);
                          refreshData();
                        }}
                      >
                        <Ionicons name="checkmark" size={15} color={colors.textInverse} />
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

const CARD_GAP = 12;
const CARD_WIDTH = (width - spacing.lg * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Nền kem ấm tự nhiên
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.soft,
  },
  headerLeft: { gap: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roleTitle: {
    ...typography.overline,
    fontSize: 10,
    color: colors.primaryDark,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 48,
  },
  loadingBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { ...typography.body, color: colors.textMuted },

  // ── Bento Revenue Card (Espresso tối sang trọng gốc) ──
  revenueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.espresso,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  revenueLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  revenueIconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueLabel: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textInverseMuted,
    letterSpacing: 0.8,
  },
  revenueValue: {
    ...typography.h2,
    fontSize: 22,
    color: colors.textInverse,
    marginTop: 2,
  },
  revenueSub: {
    ...typography.caption,
    color: colors.primaryLight,
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Metrics Row ──
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  metricCardAmber: {
    backgroundColor: colors.warningSubtle, // #FEF3C7
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValAmber: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '800',
    color: colors.espresso,
    marginTop: 2,
  },
  metricLblAmber: {
    ...typography.caption,
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },
  metricValNormal: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  metricLblNormal: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ── Availability Bar ──
  availBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  availBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 140 },
  availBarText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  availBarHighlight: { color: colors.success, fontWeight: '800' },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryDark,
  },

  // ── Section ──
  section: { marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, fontSize: 17, fontWeight: '800' },
  sectionSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  seeAllText: { ...typography.caption, fontWeight: '700', color: colors.primaryDark },

  // ── Nav Grid (2 Cột căn lề chuẩn chuẩn responsive) ──
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  navCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.soft,
  },
  navCardHighlight: {
    backgroundColor: colors.warningSubtle,
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  navIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  navIconBoxHighlight: {
    backgroundColor: '#FDE68A',
  },
  navLabel: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  navDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    fontSize: 11,
  },
  navArrow: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },

  // ── Recent Reservations Card ──
  resCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  resCardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  resAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resAvatarText: { color: colors.textInverse, fontWeight: '800', fontSize: 16 },
  resInfo: { flex: 1 },
  resCustName: { ...typography.bodyLarge, fontWeight: '700' },
  resMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  resBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  badgeSuccess: { backgroundColor: colors.successSubtle },
  badgeWarning: { backgroundColor: colors.warningSubtle },
  badgeDanger: { backgroundColor: colors.dangerSubtle },
  resBadgeText: { ...typography.caption, fontSize: 11, fontWeight: '700' },
  badgeTextSuccess: { color: colors.success },
  badgeTextWarning: { color: colors.warning },
  badgeTextDanger: { color: colors.danger },

  resActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.success,
  },
  approveBtnText: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
  rejectBtn: {
    flex: 1,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSubtle,
  },
  rejectBtnText: { ...typography.caption, color: colors.danger, fontWeight: '700' },

  // Empty
  emptyBox: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { ...typography.body, color: colors.textMuted },
});

export default AdminDashboardView;
