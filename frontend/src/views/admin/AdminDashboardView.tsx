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
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { Badge } from '../../components/Badge';
import { SectionHeader } from '../../components/SectionHeader';
import {
  AdminDashboardPresenter,
  AdminDashboardViewInterface,
  AdminDashboardData,
} from '../../presenters/AdminDashboardPresenter';
import { useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { UserModel } from '../../models/UserModel';

const { width } = Dimensions.get('window');
const PAD = 16;
const GAP = 12;

const NAV_ITEMS = [
  { screen: 'AdminBookings',     icon: 'clipboard-outline',  label: 'QL Đặt Bàn',    desc: 'Duyệt & hủy vé' },
  { screen: 'AdminTables',       icon: 'grid-outline',       label: 'QL Bàn',         desc: 'Sơ đồ & thêm bàn' },
  { screen: 'AdminMenu',         icon: 'cafe-outline',       label: 'QL Menu',        desc: 'Thêm món & giá' },
  { screen: 'AdminPromotions',   icon: 'pricetag-outline',   label: 'QL Khuyến Mãi', desc: 'Mã giảm & ưu đãi' },
  { screen: 'AdminUsers',        icon: 'people-outline',     label: 'QL Khách Hàng', desc: 'Tài khoản & điểm' },
  { screen: 'AdminUserTracking', icon: 'analytics-outline',  label: 'QL Tracking',   desc: 'Thống kê & gợi ý' },
];

export const AdminDashboardView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const makePresenter = () =>
    new AdminDashboardPresenter({
      showLoading: (l) => { if (!refreshing) setLoading(l); },
      showError: (msg) => Alert.alert('Lỗi', msg),
      renderDashboard: (d) => { setData(d); setLoading(false); setRefreshing(false); },
    });

  const refreshData = useCallback(() => { makePresenter().loadDashboardData(); }, []);

  useFocusEffect(useCallback(() => { refreshData(); }, [refreshData]));

  const handleLogout = () => {
    Alert.alert('Đăng Xuất', 'Bạn muốn đăng xuất quyền Quản trị?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => { await UserModel.logout(); dispatch(logout()); },
      },
    ]);
  };

  const occupancyRate = data?.occupancyRate || 0;

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primaryDark} />
            <Text style={styles.roleTitle}>TRUNG TÂM QUẢN LÝ (MANAGER)</Text>
          </View>
          <Text style={styles.headerTitle}>Pam Coffee & Tea</Text>
        </View>
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primaryDark} />
            <Text style={styles.roleTitle}>TRUNG TÂM QUẢN LÝ (MANAGER)</Text>
          </View>
          <Text style={styles.headerTitle}>Pam Coffee & Tea</Text>
        </View>
        <View style={styles.headerRight}>
          <AnimatedScaleButton
            onPress={() => navigation.navigate('CustomerTabs')}
            style={styles.switchModeBtn}
          >
            <Ionicons name="swap-horizontal" size={15} color={colors.textPrimary} />
            <Text style={styles.switchModeText}>Giao diện Khách</Text>
          </AnimatedScaleButton>
          <AnimatedScaleButton onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          </AnimatedScaleButton>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); refreshData(); }}
            colors={[colors.primaryDark]}
            tintColor={colors.primaryDark}
          />
        }
      >
        {/* ── Banner Doanh Thu ── */}
        <FadeInView>
          <AnimatedScaleButton
            onPress={() => navigation.navigate('AdminBookings')}
            style={styles.revenueBanner}
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
                <Text style={styles.revenueSub}>
                  {data?.confirmedCount || 0} đơn đã xác nhận • Bấm để xem chi tiết
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textInverseMuted} />
          </AnimatedScaleButton>

          {/* ── 3 Metrics nhỏ ── */}
          <View style={styles.metricsRow}>
            {/* Chờ duyệt */}
            <AnimatedScaleButton
              onPress={() => navigation.navigate('AdminTables')}
              style={styles.metricCard}
            >
              <View style={[styles.metricIconBox, { backgroundColor: colors.primarySubtle }]}>
                <Ionicons name="time-outline" size={18} color={colors.primaryDark} />
              </View>
              <Text style={[styles.metricValue, { color: colors.primaryDark }]}>
                {data?.pendingCount || 0}
              </Text>
              <Text style={styles.metricLabel}>Chờ duyệt</Text>
            </AnimatedScaleButton>

            {/* Lấp đầy */}
            <AnimatedScaleButton
              onPress={() => navigation.navigate('AdminTables')}
              style={styles.metricCard}
            >
              <View style={[styles.metricIconBox, { backgroundColor: colors.successSubtle }]}>
                <Ionicons name="pie-chart-outline" size={18} color={colors.success} />
              </View>
              <Text style={[styles.metricValue, { color: colors.success }]}>
                {occupancyRate}%
              </Text>
              <Text style={styles.metricLabel}>Lấp đầy</Text>
            </AnimatedScaleButton>

            {/* Tổng đặt */}
            <AnimatedScaleButton
              onPress={() => navigation.navigate('AdminBookings')}
              style={styles.metricCard}
            >
              <View style={[styles.metricIconBox, { backgroundColor: colors.infoSubtle }]}>
                <Ionicons name="calendar-outline" size={18} color={colors.info} />
              </View>
              <Text style={[styles.metricValue, { color: colors.info }]}>
                {data?.totalReservations || 0}
              </Text>
              <Text style={styles.metricLabel}>Tổng đặt</Text>
            </AnimatedScaleButton>
          </View>

          {/* Thanh bàn trống */}
          <View style={styles.availRow}>
            <View style={styles.availLeft}>
              <Ionicons name="grid-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.availText}>
                Bàn trống:{' '}
                <Text style={{ color: colors.success, fontWeight: '800' }}>
                  {data?.availableTables || 0}
                </Text>
                /{data?.totalTables || 0}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${100 - occupancyRate}%` as any },
                ]}
              />
            </View>
          </View>
        </FadeInView>

        {/* ── Phân Hệ Quản Lý ── */}
        <FadeInView delay={80} style={styles.section}>
          <SectionHeader
            title="Phân Hệ Quản Lý"
            subtitle="Chọn khu vực cần xử lý và cập nhật dữ liệu"
          />
          <View style={styles.navGrid}>
            {NAV_ITEMS.map((item) => (
              <AnimatedScaleButton
                key={item.screen}
                onPress={() => navigation.navigate(item.screen)}
                style={styles.navBtn}
              >
                <View style={styles.navCard}>
                  <View style={styles.navIconBox}>
                    <Ionicons name={item.icon as any} size={26} color={colors.primary} />
                  </View>
                  <Text style={styles.navTitle}>{item.label}</Text>
                  <Text style={styles.navDesc}>{item.desc}</Text>
                </View>
              </AnimatedScaleButton>
            ))}
          </View>
        </FadeInView>

        {/* ── Đơn Đặt Bàn Mới Nhất ── */}
        <FadeInView delay={160} style={styles.section}>
          <SectionHeader
            title="Đơn Đặt Bàn Mới Nhất"
            actionText="Xem tất cả"
            onActionPress={() => navigation.navigate('AdminTables')}
          />

          {!data?.recentReservations?.length ? (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>Chưa có đơn đặt bàn</Text>
            </View>
          ) : (
            data.recentReservations.map((res) => {
              const p = makePresenter();
              return (
                <View key={res.id} style={styles.recentCard}>
                  <View style={styles.recentTop}>
                    <View style={styles.recentInfo}>
                      <Text style={styles.recentName}>{res.customerName}</Text>
                      <Text style={styles.recentMeta}>
                        Bàn {res.tableNumber} • {res.reservationDate} lúc {res.reservationTime}
                      </Text>
                    </View>
                    <Badge
                      label={
                        res.status === 'CONFIRMED' ? 'Đã duyệt'
                        : res.status === 'PENDING'   ? 'Chờ duyệt'
                        : 'Đã hủy'
                      }
                      variant={
                        res.status === 'CONFIRMED' ? 'success'
                        : res.status === 'PENDING'   ? 'warning'
                        : 'danger'
                      }
                    />
                  </View>

                  {res.status === 'PENDING' && (
                    <View style={styles.actionRow}>
                      <AnimatedScaleButton
                        onPress={async () => { await p.approveReservation(res.id); refreshData(); }}
                        style={styles.approveBtn}
                      >
                        <Ionicons name="checkmark" size={15} color={colors.textInverse} />
                        <Text style={styles.approveTxt}>Duyệt Ngay</Text>
                      </AnimatedScaleButton>
                      <AnimatedScaleButton
                        onPress={async () => { await p.rejectReservation(res.id); refreshData(); }}
                        style={styles.rejectBtn}
                      >
                        <Text style={styles.rejectTxt}>Từ Chối</Text>
                      </AnimatedScaleButton>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </FadeInView>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const NAV_CARD_W = (width - PAD * 2 - GAP) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PAD,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  roleTitle: { ...typography.overline, fontSize: 10, color: colors.primaryDark },
  headerTitle: { ...typography.h2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  switchModeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm, height: 34,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
  },
  switchModeText: { ...typography.caption, fontWeight: '700' },
  logoutBtn: {
    width: 34, height: 34, borderRadius: radius.md,
    backgroundColor: colors.dangerSubtle,
    alignItems: 'center', justifyContent: 'center',
  },

  loader: { marginTop: 60 },
  scroll: { paddingHorizontal: PAD, paddingTop: spacing.lg },

  // Revenue banner
  revenueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.espresso,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: GAP,
    ...shadows.medium,
  },
  revenueLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  revenueIconBox: {
    width: 46, height: 46, borderRadius: radius.lg,
    backgroundColor: colors.espressoMedium,
    alignItems: 'center', justifyContent: 'center',
  },
  revenueLabel: { ...typography.overline, fontSize: 10, color: colors.textInverseMuted },
  revenueValue: { fontSize: 20, fontWeight: '900', color: colors.textInverse, marginTop: 2 },
  revenueSub: { fontSize: 11, color: colors.textInverseMuted, marginTop: 2 },

  // 3 small metrics
  metricsRow: { flexDirection: 'row', gap: GAP, marginBottom: GAP },
  metricCard: {
    flex: 1, backgroundColor: colors.surface,
    borderRadius: radius.xl, padding: spacing.md,
    alignItems: 'flex-start', gap: 3,
    borderWidth: 1, borderColor: colors.border,
    ...shadows.soft,
  },
  metricIconBox: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  metricValue: { fontSize: 22, fontWeight: '900', lineHeight: 26 },
  metricLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  // Availability bar
  availRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1, borderColor: colors.border,
    ...shadows.soft,
  },
  availLeft: { flexDirection: 'row', alignItems: 'center', gap: 5, minWidth: 110 },
  availText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  progressTrack: {
    flex: 1, height: 7,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 4, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  progressFill: { height: 7, borderRadius: 4, backgroundColor: colors.success },

  // Nav
  section: { marginBottom: spacing.xl },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  navBtn: { width: NAV_CARD_W },
  navCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    ...shadows.soft,
  },
  navIconBox: {
    width: 44, height: 44, borderRadius: radius.lg,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  navTitle: { ...typography.bodyLarge, fontWeight: '700', marginTop: spacing.xs },
  navDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  // Recent bookings
  recentCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl, padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    ...shadows.soft,
  },
  recentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recentInfo: { flex: 1, paddingRight: spacing.sm },
  recentName: { ...typography.bodyLarge, fontWeight: '700' },
  recentMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  actionRow: {
    flexDirection: 'row', gap: spacing.sm,
    marginTop: spacing.sm, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, height: 36, borderRadius: radius.sm, backgroundColor: colors.success,
  },
  approveTxt: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
  rejectBtn: {
    flex: 1, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.dangerSubtle, alignItems: 'center', justifyContent: 'center',
  },
  rejectTxt: { ...typography.caption, color: colors.danger, fontWeight: '700' },

  // Empty
  emptyBox: {
    alignItems: 'center', paddingVertical: spacing.xl,
    backgroundColor: colors.surface, borderRadius: radius.xl, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  emptyText: { ...typography.body, color: colors.textMuted },
});

export default AdminDashboardView;
