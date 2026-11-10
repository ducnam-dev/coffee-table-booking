import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { useResponsive } from '../../theme/responsive';
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

export const AdminDashboardView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const viewCallbacks: AdminDashboardViewInterface = {
    showLoading: (l) => setLoading(l),
    showError: (msg) => Alert.alert('Lỗi', msg),
    renderDashboard: (d) => setData(d),
  };

  const presenter = new AdminDashboardPresenter(viewCallbacks);

  useEffect(() => {
    presenter.loadDashboardData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Đăng Xuất', 'Bạn muốn đăng xuất quyền Quản trị?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => {
          await UserModel.logout();
          dispatch(logout());
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.header, { paddingHorizontal: responsive.horizontalPadding }]}>
        <View>
          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primaryDark} />
            <Text style={styles.roleTitle}>TRUNG TÂM QUẢN LÝ (MANAGER)</Text>
          </View>
          <Text style={styles.headerTitle}>Pam Coffee & Tea</Text>
        </View>

        <View style={styles.headerRight}>
          <AnimatedScaleButton
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] })}
            style={styles.switchModeBtn}
          >
            <Ionicons name="swap-horizontal" size={16} color={colors.textPrimary} />
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
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: responsive.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Executive Metrics Bento Grid */}
          <FadeInView style={styles.metricsGrid}>
            <View style={styles.metricRow}>
              {/* Metric 1: Doanh thu */}
              <BentoCard variant="dark" padding="md" style={styles.metricCard}>
                <View style={styles.metricIconWrap}>
                  <Ionicons name="cash-outline" size={20} color={colors.primaryLight} />
                </View>
                <Text style={styles.metricLabelDark}>DOANH THU ƯỚC TÍNH</Text>
                <Text style={styles.metricValueDark}>
                  {(data?.totalRevenue || 0).toLocaleString('vi-VN')} đ
                </Text>
              </BentoCard>

              {/* Metric 2: Đơn chờ duyệt */}
              <BentoCard variant="amber" padding="md" style={styles.metricCard}>
                <View style={styles.metricIconWrap}>
                  <Ionicons name="time-outline" size={20} color={colors.primaryDark} />
                </View>
                <Text style={styles.metricLabel}>ĐƠN CHỜ PHÊ DUYỆT</Text>
                <Text style={styles.metricValue}>{data?.pendingCount || 0} đơn</Text>
              </BentoCard>
            </View>

            <View style={styles.metricRow}>
              {/* Metric 3: Tỷ lệ lấp đầy */}
              <BentoCard variant="elevated" padding="md" style={styles.metricCard}>
                <View style={styles.metricIconWrap}>
                  <Ionicons name="pie-chart-outline" size={20} color={colors.espresso} />
                </View>
                <Text style={styles.metricLabel}>TỶ LỆ LẤP ĐẦY</Text>
                <Text style={styles.metricValue}>{data?.occupancyRate || 0}%</Text>
                <Text style={styles.metricSub}>
                  Còn {data?.availableTables || 0}/{data?.totalTables || 0} bàn trống
                </Text>
              </BentoCard>

              {/* Metric 4: Tổng lượt đặt */}
              <BentoCard variant="elevated" padding="md" style={styles.metricCard}>
                <View style={styles.metricIconWrap}>
                  <Ionicons name="calendar-outline" size={20} color={colors.espresso} />
                </View>
                <Text style={styles.metricLabel}>TỔNG LƯỢT ĐẶT</Text>
                <Text style={styles.metricValue}>{data?.totalReservations || 0} lượt</Text>
                <Text style={styles.metricSub}>{data?.confirmedCount || 0} đã xác nhận</Text>
              </BentoCard>
            </View>
          </FadeInView>

          {/* Quick Management Navigation Buttons */}
          <FadeInView delay={100} style={styles.navSection}>
            <SectionHeader title="Phân Hệ Quản Lý" subtitle="Chọn khu vực cần xử lý và cập nhật dữ liệu" />
            <View style={styles.navRow}>
              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminBookings')}
                style={styles.navBtn}
              >
                <BentoCard variant="elevated" padding="md" style={styles.navCard}>
                  <Ionicons name="clipboard-outline" size={26} color={colors.primary} />
                  <Text style={styles.navTitle}>QL Đặt Bàn</Text>
                  <Text style={styles.navDesc}>Duyệt & hủy vé</Text>
                </BentoCard>
              </AnimatedScaleButton>

              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminTables')}
                style={styles.navBtn}
              >
                <BentoCard variant="elevated" padding="md" style={styles.navCard}>
                  <Ionicons name="grid-outline" size={26} color={colors.primary} />
                  <Text style={styles.navTitle}>QL Bàn</Text>
                  <Text style={styles.navDesc}>Sơ đồ & tình trạng</Text>
                </BentoCard>
              </AnimatedScaleButton>
            </View>

            <View style={[styles.navRow, { marginTop: spacing.md }]}>
              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminMenu')}
                style={styles.navBtn}
              >
                <BentoCard variant="elevated" padding="md" style={styles.navCard}>
                  <Ionicons name="cafe-outline" size={26} color={colors.primary} />
                  <Text style={styles.navTitle}>QL Menu</Text>
                  <Text style={styles.navDesc}>Thêm món & giá</Text>
                </BentoCard>
              </AnimatedScaleButton>

              <AnimatedScaleButton
                onPress={() => navigation.navigate('AdminUsers')}
                style={styles.navBtn}
              >
                <BentoCard variant="elevated" padding="md" style={styles.navCard}>
                  <Ionicons name="people-outline" size={26} color={colors.primary} />
                  <Text style={styles.navTitle}>QL Khách Hàng</Text>
                  <Text style={styles.navDesc}>Tài khoản & điểm</Text>
                </BentoCard>
              </AnimatedScaleButton>
            </View>
          </FadeInView>

          {/* Recent Bookings Queue */}
          <FadeInView delay={180} style={styles.recentSection}>
            <SectionHeader
              title="Đơn Đặt Bàn Mới Nhất"
              actionText="Xem tất cả"
              onActionPress={() => navigation.navigate('AdminBookings')}
            />

            {(data?.recentReservations || []).map((res) => (
              <BentoCard key={res.id} variant="elevated" padding="md" style={styles.recentItem}>
                <View style={styles.recentHeader}>
                  <View>
                    <Text style={styles.recentCustName}>{res.customerName}</Text>
                    <Text style={styles.recentTime}>
                      Bàn {res.tableNumber} • {res.reservationDate} lúc {res.reservationTime}
                    </Text>
                  </View>
                  <Badge
                    label={res.status === 'CONFIRMED' ? 'Đã duyệt' : res.status === 'PENDING' ? 'Chờ duyệt' : 'Đã hủy'}
                    variant={res.status === 'CONFIRMED' ? 'success' : res.status === 'PENDING' ? 'warning' : 'danger'}
                  />
                </View>

                {res.status === 'PENDING' && (
                  <View style={styles.quickActionRow}>
                    <AnimatedScaleButton
                      onPress={() => presenter.approveReservation(res.id)}
                      style={styles.approveBtn}
                    >
                      <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                      <Text style={styles.approveText}>Duyệt Ngay</Text>
                    </AnimatedScaleButton>

                    <AnimatedScaleButton
                      onPress={() => presenter.rejectReservation(res.id)}
                      style={styles.rejectBtn}
                    >
                      <Text style={styles.rejectText}>Từ Chối</Text>
                    </AnimatedScaleButton>
                  </View>
                )}
              </BentoCard>
            ))}
          </FadeInView>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleTitle: {
    ...typography.overline,
    color: colors.primaryDark,
    fontSize: 10,
  },
  headerTitle: {
    ...typography.h2,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchModeText: {
    ...typography.caption,
    fontWeight: '700',
  },
  logoutIconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  loader: {
    marginTop: spacing.xxxl,
  },
  metricsGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    borderRadius: radius.lg,
  },
  metricIconWrap: {
    marginBottom: spacing.xs,
  },
  metricLabel: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textMuted,
  },
  metricLabelDark: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textInverseMuted,
  },
  metricValue: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 2,
  },
  metricValueDark: {
    ...typography.h2,
    color: colors.textInverse,
    marginTop: 2,
  },
  metricSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  navSection: {
    marginBottom: spacing.xl,
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navBtn: {
    flex: 1,
  },
  navCard: {
    alignItems: 'flex-start',
    borderRadius: radius.lg,
  },
  navTitle: {
    ...typography.bodyLarge,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  navDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  recentSection: {
    marginBottom: spacing.xl,
  },
  recentItem: {
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recentCustName: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  recentTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  approveBtn: {
    flex: 1,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  approveText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
  },
});

export default AdminDashboardView;

