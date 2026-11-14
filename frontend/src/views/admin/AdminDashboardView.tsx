import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
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

const PAD = 16; // horizontal padding toàn màn hình

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

  const refreshData = useCallback(() => {
    makePresenter().loadDashboardData();
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
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

          <AnimatedScaleButton onPress={handleLogout} style={styles.logoutIconBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          </AnimatedScaleButton>
        </View>
      </View>

      {loading && !data ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); refreshData(); }}
              colors={[colors.primaryDark]}
              tintColor={colors.primaryDark}
            />
          }
        >
          {/* ── 2×2 Metric Grid ── */}
          <FadeInView style={styles.metricsGrid}>
            {/* Row 1 */}
            <View style={styles.metricRow}>
              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminBookings')}
                style={styles.metricBtn}
              >
                <BentoCard variant="dark" padding="md" style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Ionicons name="cash-outline" size={20} color={colors.primaryLight} />
                    <Ionicons name="chevron-forward" size={15} color={colors.textInverseMuted} />
                  </View>
                  <Text style={styles.metricLabelDark}>DOANH THU ƯỚC TÍNH</Text>
                  <Text style={styles.metricValueDark}>
                    {(data?.totalRevenue || 0).toLocaleString('vi-VN')} đ
                  </Text>
                  <Text style={styles.metricSubDark}>Bấm để xem chi tiết</Text>
                </BentoCard>
              </AnimatedScaleButton>

              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminTables')}
                style={styles.metricBtn}
              >
                <BentoCard variant="amber" padding="md" style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Ionicons name="time-outline" size={20} color={colors.primaryDark} />
                    <Ionicons name="chevron-forward" size={15} color={colors.espresso} />
                  </View>
                  <Text style={styles.metricLabel}>ĐƠN CHỜ PHÊ DUYỆT</Text>
                  <Text style={styles.metricValue}>{data?.pendingCount || 0} đơn</Text>
                  <Text style={styles.metricSub}>Bấm để duyệt ngay</Text>
                </BentoCard>
              </AnimatedScaleButton>
            </View>

            {/* Row 2 */}
            <View style={styles.metricRow}>
              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminTables')}
                style={styles.metricBtn}
              >
                <BentoCard variant="elevated" padding="md" style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Ionicons name="pie-chart-outline" size={20} color={colors.espresso} />
                    <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
                  </View>
                  <Text style={styles.metricLabel}>TỶ LỆ LẤP ĐẦY</Text>
                  <Text style={styles.metricValue}>{data?.occupancyRate || 0}%</Text>
                  <Text style={styles.metricSub}>
                    Còn {data?.availableTables || 0}/{data?.totalTables || 0} bàn trống
                  </Text>
                </BentoCard>
              </AnimatedScaleButton>

              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminBookings')}
                style={styles.metricBtn}
              >
                <BentoCard variant="elevated" padding="md" style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Ionicons name="calendar-outline" size={20} color={colors.espresso} />
                    <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
                  </View>
                  <Text style={styles.metricLabel}>TỔNG LƯỢT ĐẶT</Text>
                  <Text style={styles.metricValue}>{data?.totalReservations || 0} lượt</Text>
                  <Text style={styles.metricSub}>{data?.confirmedCount || 0} đã xác nhận</Text>
                </BentoCard>
              </AnimatedScaleButton>
            </View>
          </FadeInView>

          {/* ── Phân Hệ Quản Lý ── */}
          <FadeInView delay={100} style={styles.section}>
            <SectionHeader
              title="Phân Hệ Quản Lý"
              subtitle="Chọn khu vực cần xử lý và cập nhật dữ liệu"
            />

            <View style={styles.navGrid}>
              {[
                { screen: 'AdminBookings',    icon: 'clipboard-outline',  label: 'QL Đặt Bàn',    desc: 'Duyệt & hủy vé' },
                { screen: 'AdminTables',      icon: 'grid-outline',       label: 'QL Bàn',         desc: 'Sơ đồ & thêm bàn' },
                { screen: 'AdminMenu',        icon: 'cafe-outline',       label: 'QL Menu',        desc: 'Thêm món & giá' },
                { screen: 'AdminPromotions',  icon: 'pricetag-outline',   label: 'QL Khuyến Mãi', desc: 'Mã giảm & ưu đãi' },
                { screen: 'AdminUsers',       icon: 'people-outline',     label: 'QL Khách Hàng', desc: 'Tài khoản & điểm' },
                { screen: 'AdminUserTracking',icon: 'analytics-outline',  label: 'QL Tracking',   desc: 'Thống kê & gợi ý', amber: true },
              ].map((item) => (
                <AnimatedScaleButton
                  key={item.screen}
                  onPress={() => navigation.navigate(item.screen)}
                  style={styles.navBtn}
                >
                  <BentoCard
                    variant={item.amber ? 'amber' : 'elevated'}
                    padding="md"
                    style={styles.navCard}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={26}
                      color={item.amber ? colors.primaryDark : colors.primary}
                    />
                    <Text style={styles.navTitle}>{item.label}</Text>
                    <Text style={styles.navDesc}>{item.desc}</Text>
                  </BentoCard>
                </AnimatedScaleButton>
              ))}
            </View>
          </FadeInView>

          {/* ── Đơn Đặt Bàn Mới Nhất ── */}
          <FadeInView delay={180} style={styles.section}>
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
                const presenter2 = makePresenter();
                return (
                  <BentoCard key={res.id} variant="elevated" padding="md" style={styles.recentCard}>
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
                          : res.status === 'PENDING' ? 'Chờ duyệt'
                          : 'Đã hủy'
                        }
                        variant={
                          res.status === 'CONFIRMED' ? 'success'
                          : res.status === 'PENDING' ? 'warning'
                          : 'danger'
                        }
                      />
                    </View>

                    {res.status === 'PENDING' && (
                      <View style={styles.actionRow}>
                        <AnimatedScaleButton
                          onPress={async () => { await presenter2.approveReservation(res.id); refreshData(); }}
                          style={styles.approveBtn}
                        >
                          <Ionicons name="checkmark" size={15} color="#fff" />
                          <Text style={styles.approveText}>Duyệt Ngay</Text>
                        </AnimatedScaleButton>
                        <AnimatedScaleButton
                          onPress={async () => { await presenter2.rejectReservation(res.id); refreshData(); }}
                          style={styles.rejectBtn}
                        >
                          <Text style={styles.rejectText}>Từ Chối</Text>
                        </AnimatedScaleButton>
                      </View>
                    )}
                  </BentoCard>
                );
              })
            )}
          </FadeInView>

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // ── Header ──
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
  headerLeft: { gap: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roleTitle: {
    ...typography.overline,
    fontSize: 10,
    color: colors.primaryDark,
  },
  headerTitle: { ...typography.h2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchModeText: { ...typography.caption, fontWeight: '700' },
  logoutIconBtn: {
    width: 34, height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSubtle,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Scroll ──
  scroll: { paddingHorizontal: PAD, paddingTop: spacing.lg, paddingBottom: 48 },
  loader: { marginTop: 60 },

  // ── Metrics ──
  metricsGrid: { gap: spacing.md, marginBottom: spacing.xl },
  metricRow: { flexDirection: 'row', gap: spacing.md },
  metricBtn: { flex: 1 },
  metricCard: { flex: 1 },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: { ...typography.overline, fontSize: 10, color: colors.textMuted },
  metricLabelDark: { ...typography.overline, fontSize: 10, color: colors.textInverseMuted },
  metricValue: { ...typography.h2, color: colors.textPrimary, marginTop: 2 },
  metricValueDark: { ...typography.h2, color: colors.textInverse, marginTop: 2 },
  metricSub: { ...typography.caption, color: colors.textMuted, fontSize: 11, marginTop: 2 },
  metricSubDark: { ...typography.caption, color: colors.primaryLight, fontSize: 11, fontWeight: '600', marginTop: 2 },

  // ── Nav ──
  section: { marginBottom: spacing.xl },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  navBtn: { width: '47%' },          // ~2 cột đều nhau
  navCard: { width: '100%' },
  navTitle: { ...typography.bodyLarge, fontWeight: '700', marginTop: spacing.xs },
  navDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  // ── Recent ──
  recentCard: { marginBottom: spacing.sm },
  recentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recentInfo: { flex: 1, paddingRight: spacing.sm },
  recentName: { ...typography.bodyLarge, fontWeight: '700' },
  recentMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, height: 36, borderRadius: radius.sm, backgroundColor: colors.success,
  },
  approveText: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
  rejectBtn: {
    flex: 1, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.dangerSubtle, alignItems: 'center', justifyContent: 'center',
  },
  rejectText: { ...typography.caption, color: colors.danger, fontWeight: '700' },

  // ── Empty ──
  emptyBox: {
    alignItems: 'center', paddingVertical: spacing.xl,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    gap: spacing.sm,
  },
  emptyText: { ...typography.body, color: colors.textMuted },
});

export default AdminDashboardView;
