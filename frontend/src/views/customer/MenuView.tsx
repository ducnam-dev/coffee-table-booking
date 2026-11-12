import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { useResponsive } from '../../theme/responsive';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { useAppDispatch, useAppSelector } from '../../store';
import { setMenuItems, addToCart } from '../../store/slices/menuSlice';
import { addFavoriteItem, removeFavoriteItem, setFavorites } from '../../store/slices/trackingSlice';
import { MenuModel } from '../../models/MenuModel';
import { TrackingModel } from '../../models/TrackingModel';
import { MenuItem, MenuCategory } from '../../types';

interface MenuViewProps {
  navigation: any;
}

const CATEGORIES: { key: MenuCategory | 'ALL'; label: string; icon: any }[] = [
  { key: 'ALL', label: 'Tất cả', icon: 'apps-outline' },
  { key: 'COFFEE', label: 'Cà phê', icon: 'cafe-outline' },
  { key: 'TEA', label: 'Trà trái cây', icon: 'leaf-outline' },
  { key: 'FREEZE', label: 'Đá xay', icon: 'snow-outline' },
  { key: 'PASTRY', label: 'Bánh ngọt', icon: 'restaurant-outline' },
];

export const MenuView: React.FC<MenuViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  const user = useAppSelector((state) => state.auth.user);
  const menuItems = useAppSelector((state) => state.menu.items);
  const cart = useAppSelector((state) => state.menu.cart);
  const favorites = useAppSelector((state) => state.tracking.favorites);

  const [selectedCat, setSelectedCat] = useState<MenuCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (menuItems.length === 0) {
      MenuModel.getAllMenuItems().then((data) => dispatch(setMenuItems(data)));
    }
    const userId = user?.id || 2;
    TrackingModel.getFavorites(userId).then((favs) => dispatch(setFavorites(favs)));
  }, [dispatch, menuItems.length, user]);

  const handleToggleFavorite = async (item: MenuItem) => {
    const userId = user?.id || 2;
    const isFav = favorites.includes(item.id);
    if (isFav) {
      dispatch(removeFavoriteItem(item.id));
      await TrackingModel.removeFavorite(userId, item.id);
      TrackingModel.trackEvent(userId, item.id, 'unfavorite');
    } else {
      dispatch(addFavoriteItem(item.id));
      await TrackingModel.addFavorite(userId, item.id);
      TrackingModel.trackEvent(userId, item.id, 'favorite');
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchCat = selectedCat === 'ALL' || item.category === selectedCat;
    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Header with Search Input */}
      <View style={[styles.header, { paddingHorizontal: responsive.horizontalPadding }]}>
        <Text style={styles.headerTitle}>Thực Đơn Quán</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm cà phê, trà sen, bánh ngọt..."
            placeholderTextColor={colors.textMuted}
          />
          {searchQuery ? (
            <AnimatedScaleButton onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </AnimatedScaleButton>
          ) : null}
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.key;
            return (
              <AnimatedScaleButton
                key={cat.key}
                onPress={() => setSelectedCat(cat.key)}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isSelected ? colors.textInverse : colors.textSecondary}
                />
                <Text
                  style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}
                >
                  {cat.label}
                </Text>
              </AnimatedScaleButton>
            );
          })}
        </ScrollView>
      </View>

      {/* Menu Item Grid */}
      <ScrollView
        contentContainerStyle={[
          styles.listContainer,
          { paddingHorizontal: responsive.horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.gridWrap,
            responsive.columns > 1 && { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
          ]}
        >
          {filteredItems.map((item, index) => {
            const itemWidth =
              responsive.columns > 1
                ? (responsive.width - responsive.horizontalPadding * 2 - (responsive.columns - 1) * spacing.md) /
                  responsive.columns
                : '100%';

            return (
              <FadeInView
                key={item.id}
                delay={index * 40}
                style={[styles.itemCardWrap, { width: itemWidth as any }]}
              >
                <AnimatedScaleButton
                  onPress={() => navigation.navigate('DrinkDetail', { drink: item })}
                >
                  <BentoCard variant="elevated" padding="md" style={styles.cardContent}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      {item.isSignature && (
                        <Badge label="ĐẶC SẢN" variant="amber" style={styles.badge} />
                      )}
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemDesc} numberOfLines={2}>
                        {item.description}
                      </Text>
                      <View style={styles.cardFooter}>
                        <Text style={styles.itemPrice}>
                          {item.price.toLocaleString('vi-VN')} đ
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <AnimatedScaleButton
                            onPress={() => handleToggleFavorite(item)}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: radius.sm,
                              backgroundColor: favorites.includes(item.id) ? 'rgba(239, 68, 68, 0.12)' : colors.surfaceSubtle,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Ionicons
                              name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                              size={18}
                              color={favorites.includes(item.id) ? colors.danger : colors.textMuted}
                            />
                          </AnimatedScaleButton>
                          <AnimatedScaleButton
                            onPress={() => {
                              const userId = user?.id || 2;
                              TrackingModel.trackEvent(userId, item.id, 'order');
                              dispatch(
                                addToCart({
                                  menuItemId: item.id,
                                  name: item.name,
                                  price: item.price,
                                  quantity: 1,
                                })
                              );
                            }}
                            style={styles.addBtn}
                          >
                            <Ionicons name="add" size={18} color={colors.textInverse} />
                          </AnimatedScaleButton>
                        </View>
                      </View>
                    </View>
                  </BentoCard>
                </AnimatedScaleButton>
              </FadeInView>
            );
          })}
        </View>

        {filteredItems.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="cafe-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Không tìm thấy món phù hợp</Text>
            <Text style={styles.emptyDesc}>Vui lòng thử tìm từ khóa khác hoặc đổi danh mục</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Cart Button */}
      {cartTotalItems > 0 && (
        <FadeInView style={styles.cartBarWrap}>
          <AnimatedScaleButton
            onPress={() => navigation.navigate('Booking')}
            style={styles.cartBarBtn}
          >
            <View style={styles.cartBarLeft}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartTotalItems}</Text>
              </View>
              <Text style={styles.cartBarLabel}>Món đã chọn sẵn sàng đặt bàn</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />
          </AnimatedScaleButton>
        </FadeInView>
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
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  categoryScroll: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.espresso,
    borderColor: colors.espresso,
  },
  categoryChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  listContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: 90,
  },
  gridWrap: {
    gap: spacing.md,
  },
  itemCardWrap: {
    marginBottom: spacing.xs,
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  badge: {
    marginBottom: 4,
  },
  itemName: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  itemDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  itemPrice: {
    ...typography.bodyLarge,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: spacing.md,
  },
  emptyDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 4,
  },
  cartBarWrap: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  cartBarBtn: {
    backgroundColor: colors.espresso,
    height: 52,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    ...shadows.medium,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartBadge: {
    backgroundColor: colors.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '800',
  },
  cartBarLabel: {
    ...typography.bodyLarge,
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export default MenuView;

