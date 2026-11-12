import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/menuSlice';
import { addFavoriteItem, removeFavoriteItem } from '../../store/slices/trackingSlice';
import { TrackingModel } from '../../models/TrackingModel';
import { MenuItem } from '../../types';

interface DrinkDetailViewProps {
  route: { params: { drink: MenuItem } };
  navigation: any;
}

export const DrinkDetailView: React.FC<DrinkDetailViewProps> = ({ route, navigation }) => {
  const { drink } = route.params;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const favorites = useAppSelector((state) => state.tracking.favorites);

  useEffect(() => {
    const userId = user?.id || 2;
    TrackingModel.trackEvent(userId, drink.id, 'view');
  }, [user, drink.id]);

  const isFavorite = favorites.includes(drink.id);

  const handleToggleFavorite = async () => {
    const userId = user?.id || 2;
    if (isFavorite) {
      dispatch(removeFavoriteItem(drink.id));
      await TrackingModel.removeFavorite(userId, drink.id);
      TrackingModel.trackEvent(userId, drink.id, 'unfavorite');
    } else {
      dispatch(addFavoriteItem(drink.id));
      await TrackingModel.addFavorite(userId, drink.id);
      TrackingModel.trackEvent(userId, drink.id, 'favorite');
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<'M' | 'L'>('M');
  const [sugar, setSugar] = useState('50%');
  const [ice, setIce] = useState('Bình thường');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const sugarOptions = drink.sweetnessOptions || ['0%', '30%', '50%', '100%'];
  const iceOptions = drink.iceOptions || ['Không đá', 'Ít đá', 'Bình thường'];
  const toppingList = drink.toppings || [
    { name: 'Kem muối thêm', price: 10000 },
    { name: 'Thạch cà phê', price: 8000 },
    { name: 'Trân châu trắng', price: 10000 },
  ];

  const sizeUpPrice = size === 'L' ? 8000 : 0;
  const toppingTotal = selectedToppings.reduce((sum, name) => {
    const t = toppingList.find((item) => item.name === name);
    return sum + (t ? t.price : 0);
  }, 0);
  const unitPrice = drink.price + sizeUpPrice + toppingTotal;
  const finalPrice = unitPrice * quantity;

  const toggleTopping = (name: string) => {
    if (selectedToppings.includes(name)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== name));
    } else {
      setSelectedToppings([...selectedToppings, name]);
    }
  };

  const handleAddToCart = () => {
    const userId = user?.id || 2;
    TrackingModel.trackEvent(userId, drink.id, 'order');
    dispatch(
      addToCart({
        menuItemId: drink.id,
        name: `${drink.name} (Size ${size})`,
        price: unitPrice,
        quantity,
        size,
        sugar,
        ice,
        toppings: selectedToppings,
      })
    );
    Alert.alert('Thành công', 'Đã thêm món vào giỏ chọn của bạn!', [
      { text: 'Tiếp tục xem menu', onPress: () => navigation.goBack() },
      {
        text: 'Đặt bàn ngay',
        onPress: () => navigation.navigate('CustomerTabs', { screen: 'Booking' }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cover Image & Header Controls */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: drink.image }} style={styles.heroImage} />
          <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </AnimatedScaleButton>
          <AnimatedScaleButton onPress={handleToggleFavorite} style={styles.favTopBtn}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.danger : colors.textPrimary}
            />
          </AnimatedScaleButton>
        </View>

        <View style={styles.contentWrap}>
          <FadeInView>
            <View style={styles.titleRow}>
              <View style={styles.titleCol}>
                {drink.isSignature && <Badge label="ĐẶC SẢN NỔI BẬT" variant="amber" style={styles.badge} />}
                <Text style={styles.drinkName}>{drink.name}</Text>
              </View>
              <Text style={styles.price}>{drink.price.toLocaleString('vi-VN')} đ</Text>
            </View>

            <Text style={styles.description}>{drink.description}</Text>
          </FadeInView>

          {/* Size Selection */}
          <FadeInView delay={60} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Chọn Kích Thước (Size)</Text>
            <View style={styles.optionsRow}>
              {(['M', 'L'] as const).map((s) => (
                <AnimatedScaleButton
                  key={s}
                  onPress={() => setSize(s)}
                  style={[styles.optionBtn, size === s && styles.optionBtnActive]}
                >
                  <Text style={[styles.optionBtnText, size === s && styles.optionBtnTextActive]}>
                    Size {s} {s === 'L' ? '(+8.000 đ)' : ''}
                  </Text>
                </AnimatedScaleButton>
              ))}
            </View>
          </FadeInView>

          {/* Sugar Selection */}
          <FadeInView delay={120} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Độ Ngọt (Lượng Đường)</Text>
            <View style={styles.optionsRow}>
              {sugarOptions.map((s) => (
                <AnimatedScaleButton
                  key={s}
                  onPress={() => setSugar(s)}
                  style={[styles.optionBtnSmall, sugar === s && styles.optionBtnActive]}
                >
                  <Text style={[styles.optionBtnText, sugar === s && styles.optionBtnTextActive]}>
                    {s}
                  </Text>
                </AnimatedScaleButton>
              ))}
            </View>
          </FadeInView>

          {/* Ice Selection */}
          <FadeInView delay={180} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Lượng Đá</Text>
            <View style={styles.optionsRow}>
              {iceOptions.map((i) => (
                <AnimatedScaleButton
                  key={i}
                  onPress={() => setIce(i)}
                  style={[styles.optionBtnSmall, ice === i && styles.optionBtnActive]}
                >
                  <Text style={[styles.optionBtnText, ice === i && styles.optionBtnTextActive]}>
                    {i}
                  </Text>
                </AnimatedScaleButton>
              ))}
            </View>
          </FadeInView>

          {/* Toppings Selection */}
          <FadeInView delay={240} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Topping Thêm</Text>
            <View style={styles.toppingsList}>
              {toppingList.map((top) => {
                const isChecked = selectedToppings.includes(top.name);
                return (
                  <AnimatedScaleButton
                    key={top.name}
                    onPress={() => toggleTopping(top.name)}
                    style={[styles.toppingItem, isChecked && styles.toppingItemActive]}
                  >
                    <View style={styles.toppingLeft}>
                      <Ionicons
                        name={isChecked ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={isChecked ? colors.primaryDark : colors.textMuted}
                      />
                      <Text style={styles.toppingName}>{top.name}</Text>
                    </View>
                    <Text style={styles.toppingPrice}>+{top.price.toLocaleString('vi-VN')} đ</Text>
                  </AnimatedScaleButton>
                );
              })}
            </View>
          </FadeInView>

          {/* Quantity Selector */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Số lượng</Text>
            <View style={styles.qtyControls}>
              <AnimatedScaleButton
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.qtyBtn}
              >
                <Ionicons name="remove" size={18} color={colors.textPrimary} />
              </AnimatedScaleButton>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <AnimatedScaleButton onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                <Ionicons name="add" size={18} color={colors.textPrimary} />
              </AnimatedScaleButton>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomBarTotalLabel}>Tổng số tiền</Text>
          <Text style={styles.bottomBarTotalPrice}>{finalPrice.toLocaleString('vi-VN')} đ</Text>
        </View>
        <AnimatedScaleButton onPress={handleAddToCart} style={styles.orderBtn}>
          <Ionicons name="cart-outline" size={20} color={colors.textInverse} />
          <Text style={styles.orderBtnText}>Thêm Vào Giỏ</Text>
        </AnimatedScaleButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 110,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceSubtle,
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  favTopBtn: {
    position: 'absolute',
    top: 48,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  contentWrap: {
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  badge: {
    marginBottom: spacing.xs,
  },
  drinkName: {
    ...typography.h1,
  },
  price: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  description: {
    ...typography.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.bodyLarge,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  optionBtnSmall: {
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBtnActive: {
    backgroundColor: colors.espresso,
    borderColor: colors.espresso,
  },
  optionBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  optionBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  toppingsList: {
    gap: spacing.xs,
  },
  toppingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  toppingItemActive: {
    backgroundColor: colors.primarySubtle,
  },
  toppingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  toppingName: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  toppingPrice: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
  },
  qtyLabel: {
    ...typography.h3,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    ...typography.bodyLarge,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    ...shadows.medium,
  },
  bottomBarLeft: {
    flex: 1,
  },
  bottomBarTotalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bottomBarTotalPrice: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  orderBtn: {
    backgroundColor: colors.primary,
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.soft,
  },
  orderBtnText: {
    ...typography.bodyLarge,
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export default DrinkDetailView;

