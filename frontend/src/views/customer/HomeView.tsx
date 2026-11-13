import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { useResponsive } from '../../theme/responsive';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { SectionHeader } from '../../components/SectionHeader';
import { useAppDispatch, useAppSelector } from '../../store';
import { setMenuItems } from '../../store/slices/menuSlice';
import { setTables } from '../../store/slices/tablesSlice';
import { MenuModel } from '../../models/MenuModel';
import { TableModel } from '../../models/TableModel';
import { TrackingModel } from '../../models/TrackingModel';
import { setRecommendations } from '../../store/slices/trackingSlice';
import { MenuItem, CoffeeTable } from '../../types';

interface HomeViewProps {
  navigation: any;
}

export const HomeView: React.FC<HomeViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  const user = useAppSelector((state) => state.auth.user);
  const menuItems = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.tables.tables);
  const recommendations = useAppSelector((state) => state.tracking.recommendations);

  useEffect(() => {
    MenuModel.getAllMenuItems().then((data) => dispatch(setMenuItems(data)));
    TableModel.getAllTables().then((data) => dispatch(setTables(data)));
    const userId = user?.id || 2;
    TrackingModel.getRecommendations(userId).then((data) => dispatch(setRecommendations(data)));
  }, [dispatch, user]);

  const insets = useSafeAreaInsets();
  const signatureDrinks = menuItems.filter((i) => i.isSignature).slice(0, 4);
  const availableTablesCount = tables.filter((t) => t.status === 'AVAILABLE').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingHorizontal: responsive.horizontalPadding,
          paddingTop: Math.max(insets.top, 16) + spacing.xs,
          paddingBottom: 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar with Personalized Warm Greeting */}
      <FadeInView style={styles.topBar}>
        <View style={styles.greetingBlock}>
          <Text style={styles.welcomeLabel}>CHÀO BUỔI SÁNG</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.fullName || 'Quý khách Pam Coffee'}
          </Text>
        </View>
        <AnimatedScaleButton
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notificationBtn}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </AnimatedScaleButton>
      </FadeInView>

      {/* Hero Bento Card - Anti AI Slop, Rich Artisanal Heritage */}
      <FadeInView delay={100}>
        <BentoCard variant="dark" padding="xl" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroTextCol}>
              <Badge
                label="BÀN TRỐNG NGAY BÂY GIỜ"
                variant="amber"
                icon={<Ionicons name="radio-button-on" size={12} color={colors.primaryDark} />}
              />
              <Text style={styles.heroTitle}>
                Hương Vị Phin Đậm Đà,{'\n'}Không Gian Kết Nối
              </Text>
              <Text style={styles.heroSubtitle} numberOfLines={2}>
                Hiện có {availableTablesCount} bàn sẵn sàng đón bạn thưởng thức.
              </Text>
              <View style={styles.heroActionRow}>
                <AnimatedScaleButton
                  onPress={() => navigation.navigate('Booking')}
                  style={styles.heroReserveBtn}
                >
                  <Text style={styles.heroReserveBtnText}>Đặt Bàn Ngay</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.textInverse} />
                </AnimatedScaleButton>

                <AnimatedScaleButton
                  onPress={() => navigation.navigate('Tables')}
                  style={styles.heroMapBtn}
                >
                  <Text style={styles.heroMapBtnText}>Xem Sơ Đồ</Text>
                </AnimatedScaleButton>
              </View>
            </View>
          </View>
        </BentoCard>
      </FadeInView>

      {/* Quick Asymmetric Bento Hub */}
      <FadeInView delay={180} style={styles.bentoGrid}>
        {/* Bento 1: Pam AI Coffee Sommelier */}
        <AnimatedScaleButton
          onPress={() => navigation.navigate('AICoffeeAssistant')}
          style={styles.bentoItemWide}
        >
          <BentoCard variant="amber" padding="lg" style={styles.aiBentoCard}>
            <View style={styles.aiBadgeRow}>
              <View style={styles.sparkleCircle}>
                <Ionicons name="sparkles" size={18} color={colors.primaryDark} />
              </View>
              <Badge label="AI SOMMELIER" variant="amber" />
            </View>
            <Text style={styles.aiBentoTitle}>Chưa biết uống gì hôm nay?</Text>
            <Text style={styles.aiBentoDesc} numberOfLines={2}>
              Hỏi Trợ Lý Pam AI để được gợi ý theo tâm trạng & sở thích của riêng bạn.
            </Text>
          </BentoCard>
        </AnimatedScaleButton>

        {/* Bento 2: Sơ đồ bàn & Thực đơn chia 2 cột */}
        <View style={styles.bentoRow}>
          <AnimatedScaleButton
            onPress={() => navigation.navigate('Tables')}
            style={styles.bentoHalf}
          >
            <BentoCard variant="elevated" padding="md" style={styles.halfCard}>
              <View style={styles.iconSquare}>
                <Ionicons name="grid-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.halfTitle}>Sơ Đồ Bàn</Text>
              <Text style={styles.halfSub}>{tables.length} vị trí đa dạng</Text>
            </BentoCard>
          </AnimatedScaleButton>

          <AnimatedScaleButton
            onPress={() => navigation.navigate('Menu')}
            style={styles.bentoHalf}
          >
            <BentoCard variant="elevated" padding="md" style={styles.halfCard}>
              <View style={styles.iconSquare}>
                <Ionicons name="book-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.halfTitle}>Thực Đơn</Text>
              <Text style={styles.halfSub}>{menuItems.length} món đặc sản</Text>
            </BentoCard>
          </AnimatedScaleButton>
        </View>
      </FadeInView>

      {/* Signature Drinks Section */}
      <FadeInView delay={240} style={styles.sectionWrap}>
        <SectionHeader
          title="Món Nước Nổi Bật"
          subtitle="Tuyển chọn từ những hạt Robusta & Arabica thượng hạng"
          actionText="Xem tất cả"
          onActionPress={() => navigation.navigate('Menu')}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {signatureDrinks.map((drink) => (
            <AnimatedScaleButton
              key={drink.id}
              onPress={() => navigation.navigate('DrinkDetail', { drink })}
              style={styles.drinkCardTouchable}
            >
              <BentoCard variant="elevated" padding="sm" style={styles.drinkCard}>
                <Image source={{ uri: drink.image }} style={styles.drinkImage} />
                <View style={styles.drinkBody}>
                  <Badge label="SIGNATURE" variant="amber" style={styles.signatureBadge} />
                  <Text style={styles.drinkName} numberOfLines={1}>
                    {drink.name}
                  </Text>
                  <Text style={styles.drinkPrice}>
                    {drink.price.toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              </BentoCard>
            </AnimatedScaleButton>
          ))}
        </ScrollView>
      </FadeInView>

      {/* Personalized Recommendations Section */}
      {recommendations?.personalRecommendations && recommendations.personalRecommendations.length > 0 && (
        <FadeInView delay={280} style={styles.sectionWrap}>
          <SectionHeader
            title="Gợi Ý Dành Cho Bạn"
            subtitle={recommendations.reason || "Dựa trên thức uống bạn yêu thích & quan tâm"}
            actionText="Xem tất cả"
            onActionPress={() => navigation.navigate('Favorites')}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {recommendations.personalRecommendations.map((rec: any, idx: number) => {
              const matched = menuItems.find((m) => m.id === rec.id) || rec;
              return (
                <AnimatedScaleButton
                  key={rec.id || idx}
                  onPress={() => navigation.navigate('DrinkDetail', { drink: matched })}
                  style={styles.drinkCardTouchable}
                >
                  <BentoCard variant="amber" padding="sm" style={styles.drinkCard}>
                    {matched.image ? (
                      <Image source={{ uri: matched.image }} style={styles.drinkImage} />
                    ) : (
                      <View style={[styles.drinkImage, { alignItems: 'center', justifyContent: 'center' }]}>
                        <Ionicons name="sparkles" size={28} color={colors.primaryDark} />
                      </View>
                    )}
                    <View style={styles.drinkBody}>
                      <Badge label="GỢI Ý GU BẠN" variant="amber" style={styles.signatureBadge} />
                      <Text style={styles.drinkName} numberOfLines={1}>
                        {matched.name}
                      </Text>
                      <Text style={styles.drinkPrice}>
                        {(matched.price || 0).toLocaleString('vi-VN')} đ
                      </Text>
                    </View>
                  </BentoCard>
                </AnimatedScaleButton>
              );
            })}
          </ScrollView>
        </FadeInView>
      )}

      {/* Highlights / Features Banner */}
      <FadeInView delay={300} style={styles.featuresCardWrap}>
        <BentoCard variant="subtle" padding="lg">
          <Text style={styles.featuresHeading}>Tiện Ích Chuẩn Gu Tại Quán</Text>
          <View style={styles.featureItemRow}>
            <View style={styles.featureItem}>
              <Ionicons name="wifi" size={20} color={colors.primaryDark} />
              <Text style={styles.featureItemText}>Wifi 300Mbps</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={20} color={colors.primaryDark} />
              <Text style={styles.featureItemText}>Ổ cắm từng bàn</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="car" size={20} color={colors.primaryDark} />
              <Text style={styles.featureItemText}>Giữ xe miễn phí</Text>
            </View>
          </View>
        </BentoCard>
      </FadeInView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingVertical: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greetingBlock: {
    flex: 1,
  },
  welcomeLabel: {
    ...typography.overline,
    color: colors.primaryDark,
  },
  userName: {
    ...typography.h1,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
  },
  heroTextCol: {
    flex: 1,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.textInverse,
    marginTop: spacing.sm,
    lineHeight: 28,
  },
  heroSubtitle: {
    ...typography.bodySmall,
    color: colors.textInverseMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroReserveBtn: {
    backgroundColor: colors.primary,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  heroReserveBtnText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
  heroMapBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroMapBtnText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
  },
  bentoGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  bentoItemWide: {
    width: '100%',
  },
  aiBentoCard: {
    position: 'relative',
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  sparkleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBentoTitle: {
    ...typography.h3,
    color: colors.espresso,
    marginTop: spacing.xs,
  },
  aiBentoDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bentoHalf: {
    flex: 1,
  },
  halfCard: {
    alignItems: 'flex-start',
  },
  iconSquare: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  halfTitle: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  halfSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionWrap: {
    marginBottom: spacing.xl,
  },
  horizontalScroll: {
    paddingRight: spacing.xl,
    gap: spacing.md,
  },
  drinkCardTouchable: {
    width: 170,
  },
  drinkCard: {
    padding: 0,
    borderRadius: radius.lg,
  },
  drinkImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surfaceSubtle,
  },
  drinkBody: {
    padding: spacing.sm,
  },
  signatureBadge: {
    marginBottom: 4,
    paddingVertical: 2,
  },
  drinkName: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  drinkPrice: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },
  featuresCardWrap: {
    marginBottom: spacing.xxl,
  },
  featuresHeading: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  featureItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureItemText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default HomeView;

