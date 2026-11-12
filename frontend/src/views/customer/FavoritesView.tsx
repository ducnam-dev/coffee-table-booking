import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
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
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setFavorites,
  removeFavoriteItem,
  setRecommendations,
  setTrackingLoading,
} from '../../store/slices/trackingSlice';
import { TrackingModel } from '../../models/TrackingModel';
import { MenuModel } from '../../models/MenuModel';
import { setMenuItems } from '../../store/slices/menuSlice';
import { MenuItem } from '../../types';

interface FavoritesViewProps {
  navigation: any;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  const user = useAppSelector((state) => state.auth.user);
  const favorites = useAppSelector((state) => state.tracking.favorites);
  const recommendations = useAppSelector((state) => state.tracking.recommendations);
  const menuItems = useAppSelector((state) => state.menu.items);
  const loading = useAppSelector((state) => state.tracking.loading);

  const [localLoading, setLocalLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    dispatch(setTrackingLoading(true));
    try {
      // Load menu items if empty
      if (menuItems.length === 0) {
        const items = await MenuModel.getAllMenuItems();
        dispatch(setMenuItems(items));
      }
      // Load favorites
      const favIds = await TrackingModel.getFavorites(user.id);
      dispatch(setFavorites(favIds));
      // Load recommendations
      const recs = await TrackingModel.getRecommendations(user.id);
      dispatch(setRecommendations(recs));
    } finally {
      dispatch(setTrackingLoading(false));
      setLocalLoading(false);
    }
  }, [user, dispatch, menuItems.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const favoriteItems: MenuItem[] = menuItems.filter((item) =>
    favorites.includes(item.id)
  );

  const handleRemoveFavorite = async (menuItemId: number) => {
    if (!user) return;
    dispatch(removeFavoriteItem(menuItemId));
    await TrackingModel.removeFavorite(user.id, menuItemId);
    TrackingModel.trackEvent(user.id, menuItemId, 'unfavorite');
  };

  if (localLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: responsive.horizontalPadding }]}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Sản Phẩm Yêu Thích</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingHorizontal: responsive.horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Favorites Section */}
        <FadeInView>
          <SectionHeader
            title="Yêu Thích Của Bạn"
            subtitle={`${favoriteItems.length} sản phẩm đã lưu`}
          />

          {favoriteItems.length === 0 ? (
            <BentoCard variant="subtle" padding="xl" style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
                <Text style={styles.emptyDesc}>
                  Hãy thêm sản phẩm vào danh sách yêu thích từ thực đơn để dễ dàng tìm lại sau
                </Text>
                <AnimatedScaleButton
                  onPress={() => navigation.navigate('Menu')}
                  style={styles.exploreBtn}
                >
                  <Ionicons name="cafe-outline" size={16} color={colors.textInverse} />
                  <Text style={styles.exploreBtnText}>Khám Phá Thực Đơn</Text>
                </AnimatedScaleButton>
              </View>
            </BentoCard>
          ) : (
            <View style={styles.favList}>
              {favoriteItems.map((item, index) => (
                <FadeInView key={item.id} delay={index * 50}>
                  <AnimatedScaleButton
                    onPress={() => navigation.navigate('DrinkDetail', { drink: item })}
                  >
                    <BentoCard variant="elevated" padding="md" style={styles.favCard}>
                      <Image source={{ uri: item.image }} style={styles.favImage} />
                      <View style={styles.favInfo}>
                        {item.isSignature && (
                          <Badge label="ĐẶC SẢN" variant="amber" style={styles.favBadge} />
                        )}
                        <Text style={styles.favName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.favDesc} numberOfLines={2}>
                          {item.description}
                        </Text>
                        <Text style={styles.favPrice}>
                          {item.price.toLocaleString('vi-VN')} đ
                        </Text>
                      </View>
                      <AnimatedScaleButton
                        onPress={() => handleRemoveFavorite(item.id)}
                        style={styles.heartBtn}
                      >
                        <Ionicons name="heart" size={22} color={colors.danger} />
                      </AnimatedScaleButton>
                    </BentoCard>
                  </AnimatedScaleButton>
                </FadeInView>
              ))}
            </View>
          )}
        </FadeInView>

        {/* Recommendations Section */}
        {recommendations?.personalRecommendations &&
          recommendations.personalRecommendations.length > 0 && (
            <FadeInView delay={200} style={styles.sectionWrap}>
              <SectionHeader
                title="Gợi Ý Cho Bạn"
                subtitle={recommendations.reason}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {recommendations.personalRecommendations.map((rec: any, idx: number) => {
                  const menuItem = menuItems.find((m) => m.id === rec.id);
                  return (
                    <AnimatedScaleButton
                      key={rec.id || idx}
                      onPress={() => {
                        if (menuItem) {
                          navigation.navigate('DrinkDetail', { drink: menuItem });
                        }
                      }}
                      style={styles.recCardTouchable}
                    >
                      <BentoCard variant="elevated" padding="sm" style={styles.recCard}>
                        {menuItem?.image && (
                          <Image
                            source={{ uri: menuItem.image }}
                            style={styles.recImage}
                          />
                        )}
                        <View style={styles.recBody}>
                          <Text style={styles.recName} numberOfLines={1}>
                            {rec.name}
                          </Text>
                          <Text style={styles.recReason} numberOfLines={2}>
                            {rec.reason || rec.category}
                          </Text>
                          <Text style={styles.recPrice}>
                            {(rec.price || 0).toLocaleString('vi-VN')} đ
                          </Text>
                        </View>
                      </BentoCard>
                    </AnimatedScaleButton>
                  );
                })}
              </ScrollView>
            </FadeInView>
          )}

        {/* Trending Section */}
        {recommendations?.trendingItems &&
          recommendations.trendingItems.length > 0 && (
            <FadeInView delay={300} style={styles.sectionWrap}>
              <SectionHeader
                title="Đang Thịnh Hành"
                subtitle="Được yêu thích nhất trong tuần"
              />
              {recommendations.trendingItems.map((item: any, idx: number) => {
                const menuItem = menuItems.find((m) => m.id === item.id);
                return (
                  <AnimatedScaleButton
                    key={item.id || idx}
                    onPress={() => {
                      if (menuItem) {
                        navigation.navigate('DrinkDetail', { drink: menuItem });
                      }
                    }}
                  >
                    <BentoCard
                      variant="elevated"
                      padding="md"
                      style={styles.trendingCard}
                    >
                      <View style={styles.trendingRank}>
                        <Text style={styles.trendingRankText}>#{idx + 1}</Text>
                      </View>
                      {menuItem?.image && (
                        <Image
                          source={{ uri: menuItem.image }}
                          style={styles.trendingImage}
                        />
                      )}
                      <View style={styles.trendingInfo}>
                        <Text style={styles.trendingName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.trendingMeta}>
                          {item.orderCount
                            ? `${item.orderCount} lượt đặt`
                            : item.category}
                        </Text>
                      </View>
                      <Ionicons name="trending-up" size={20} color={colors.success} />
                    </BentoCard>
                  </AnimatedScaleButton>
                );
              })}
            </FadeInView>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitle: {
    ...typography.h2,
  },
  headerPlaceholder: {
    width: 44,
  },
  scroll: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: spacing.md,
  },
  emptyDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 260,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    height: 44,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    ...shadows.soft,
  },
  exploreBtnText: {
    ...typography.bodyLarge,
    color: colors.textInverse,
    fontWeight: '700',
  },
  favList: {
    gap: spacing.sm,
  },
  favCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favImage: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  favInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  favBadge: {
    marginBottom: 2,
  },
  favName: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  favDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  favPrice: {
    ...typography.bodyLarge,
    color: colors.primaryDark,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  heartBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionWrap: {
    marginTop: spacing.xxl,
  },
  horizontalScroll: {
    paddingRight: spacing.xl,
    gap: spacing.md,
  },
  recCardTouchable: {
    width: 160,
  },
  recCard: {
    padding: 0,
    borderRadius: radius.lg,
  },
  recImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surfaceSubtle,
  },
  recBody: {
    padding: spacing.sm,
  },
  recName: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  recReason: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recPrice: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  trendingRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  trendingRankText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '800',
  },
  trendingImage: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSubtle,
    marginRight: spacing.md,
  },
  trendingInfo: {
    flex: 1,
  },
  trendingName: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  trendingMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default FavoritesView;
