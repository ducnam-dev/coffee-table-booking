import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { useResponsive } from '../../theme/responsive';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { SectionHeader } from '../../components/SectionHeader';
import { TrackingModel } from '../../models/TrackingModel';

interface AdminUserTrackingViewProps {
  navigation: any;
}

interface ProductStat {
  menuItemId: number;
  name: string;
  count: number;
}

interface AnalyticsData {
  mostFavorited: ProductStat[];
  mostViewed: ProductStat[];
  mostOrdered: ProductStat[];
  totalEvents: number;
}

export const AdminUserTrackingView: React.FC<AdminUserTrackingViewProps> = ({
  navigation,
}) => {
  const responsive = useResponsive();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await TrackingModel.getProductAnalytics();
      setAnalytics(data);
    } finally {
      setLoading(false);
    }
  };

  const renderStatList = (
    items: ProductStat[],
    icon: keyof typeof Ionicons.glyphMap,
    iconColor: string
  ) => (
    <View style={styles.statList}>
      {items.map((item, idx) => (
        <View key={item.menuItemId} style={styles.statRow}>
          <View style={styles.statRank}>
            <Text style={styles.statRankText}>#{idx + 1}</Text>
          </View>
          <Ionicons name={icon} size={18} color={iconColor} style={styles.statIcon} />
          <View style={styles.statInfo}>
            <Text style={styles.statName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <Badge
            label={`${item.count}`}
            variant={idx === 0 ? 'amber' : 'neutral'}
          />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: responsive.horizontalPadding }]}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <View style={styles.headerCenter}>
          <View style={styles.badgeRow}>
            <Ionicons name="analytics" size={14} color={colors.primaryDark} />
            <Text style={styles.headerTag}>ANALYTICS</Text>
          </View>
          <Text style={styles.headerTitle}>Tracking Sản Phẩm</Text>
        </View>
        <AnimatedScaleButton onPress={loadAnalytics} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color={colors.textPrimary} />
        </AnimatedScaleButton>
      </View>

      {loading && !analytics ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: responsive.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Events Summary */}
          <FadeInView>
            <BentoCard variant="dark" padding="lg" style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryIconWrap}>
                  <Ionicons name="pulse" size={24} color={colors.primaryLight} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>TỔNG SỰ KIỆN TRACKING</Text>
                  <Text style={styles.summaryValue}>
                    {(analytics?.totalEvents || 0).toLocaleString('vi-VN')}
                  </Text>
                  <Text style={styles.summarySub}>
                    Bao gồm lượt xem, order và yêu thích
                  </Text>
                </View>
              </View>
            </BentoCard>
          </FadeInView>

          {/* Top Favorited Products */}
          <FadeInView delay={100} style={styles.sectionWrap}>
            <SectionHeader
              title="Sản Phẩm Yêu Thích Nhất"
              subtitle="Được thêm vào yêu thích nhiều nhất"
            />
            <BentoCard variant="amber" padding="md">
              {analytics?.mostFavorited && analytics.mostFavorited.length > 0 ? (
                renderStatList(analytics.mostFavorited, 'heart', colors.danger)
              ) : (
                <Text style={styles.noData}>Chưa có dữ liệu</Text>
              )}
            </BentoCard>
          </FadeInView>

          {/* Top Viewed Products */}
          <FadeInView delay={180} style={styles.sectionWrap}>
            <SectionHeader
              title="Sản Phẩm Xem Nhiều Nhất"
              subtitle="Lượt xem chi tiết sản phẩm"
            />
            <BentoCard variant="elevated" padding="md">
              {analytics?.mostViewed && analytics.mostViewed.length > 0 ? (
                renderStatList(analytics.mostViewed, 'eye', colors.info)
              ) : (
                <Text style={styles.noData}>Chưa có dữ liệu</Text>
              )}
            </BentoCard>
          </FadeInView>

          {/* Top Ordered Products */}
          <FadeInView delay={260} style={styles.sectionWrap}>
            <SectionHeader
              title="Sản Phẩm Order Nhiều Nhất"
              subtitle="Được đặt hàng nhiều nhất"
            />
            <BentoCard variant="elevated" padding="md">
              {analytics?.mostOrdered && analytics.mostOrdered.length > 0 ? (
                renderStatList(analytics.mostOrdered, 'cart', colors.success)
              ) : (
                <Text style={styles.noData}>Chưa có dữ liệu</Text>
              )}
            </BentoCard>
          </FadeInView>

          {/* Quick Metrics Row */}
          <FadeInView delay={340} style={styles.sectionWrap}>
            <SectionHeader title="Tổng Quan Nhanh" />
            <View style={styles.quickMetricRow}>
              <BentoCard variant="dark" padding="md" style={styles.quickMetricCard}>
                <Ionicons name="heart" size={22} color={colors.primaryLight} />
                <Text style={styles.quickMetricValue}>
                  {analytics?.mostFavorited?.reduce((s, i) => s + i.count, 0) || 0}
                </Text>
                <Text style={styles.quickMetricLabel}>Tổng Yêu Thích</Text>
              </BentoCard>

              <BentoCard variant="amber" padding="md" style={styles.quickMetricCard}>
                <Ionicons name="eye" size={22} color={colors.primaryDark} />
                <Text style={styles.quickMetricValueDark}>
                  {analytics?.mostViewed?.reduce((s, i) => s + i.count, 0) || 0}
                </Text>
                <Text style={styles.quickMetricLabelDark}>Tổng Lượt Xem</Text>
              </BentoCard>

              <BentoCard variant="elevated" padding="md" style={styles.quickMetricCard}>
                <Ionicons name="cart" size={22} color={colors.success} />
                <Text style={styles.quickMetricValueDark}>
                  {analytics?.mostOrdered?.reduce((s, i) => s + i.count, 0) || 0}
                </Text>
                <Text style={styles.quickMetricLabelDark}>Tổng Order</Text>
              </BentoCard>
            </View>
          </FadeInView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTag: {
    ...typography.overline,
    fontSize: 10,
    color: colors.primaryDark,
  },
  headerTitle: {
    ...typography.h2,
    marginTop: 2,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: spacing.xxxl,
  },
  scroll: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  summaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    ...typography.overline,
    fontSize: 10,
    color: colors.textInverseMuted,
  },
  summaryValue: {
    ...typography.display,
    color: colors.textInverse,
    marginTop: 2,
  },
  summarySub: {
    ...typography.caption,
    color: colors.textInverseMuted,
    marginTop: 2,
  },
  sectionWrap: {
    marginBottom: spacing.xl,
  },
  statList: {
    gap: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  statRankText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statIcon: {
    marginRight: spacing.sm,
  },
  statInfo: {
    flex: 1,
  },
  statName: {
    ...typography.bodyLarge,
    fontWeight: '600',
  },
  noData: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  quickMetricRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickMetricCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.lg,
  },
  quickMetricValue: {
    ...typography.h1,
    color: colors.textInverse,
    marginTop: spacing.xs,
  },
  quickMetricValueDark: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  quickMetricLabel: {
    ...typography.caption,
    color: colors.textInverseMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  quickMetricLabelDark: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default AdminUserTrackingView;
