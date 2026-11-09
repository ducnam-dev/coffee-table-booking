import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoffeeContext } from '../../context/CoffeeContext';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../config/api';

const SIZES = [
  { label: 'Size M (Vừa)', priceAdd: 0 },
  { label: 'Size L (Lớn)', priceAdd: 6000 }
];

const ICE_LEVELS = ['100% Đá', '70% Đá', '50% Đá', 'Không đá'];
const SUGAR_LEVELS = ['100% Đường', '70% Đường', '50% Đường', 'Ít ngọt (30%)'];

export default function DrinkDetailView({ route, navigation }) {
  const { item } = route.params || {
    item: { id: 1, name: 'Trà Sữa Gạo Rang', category: 'Trà Sữa', price: 18000, description: 'Trà sữa thơm bùi đặc trưng.' }
  };

  const { updatePreOrderQty } = useContext(CoffeeContext);

  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [selectedIce, setSelectedIce] = useState(ICE_LEVELS[0]);
  const [selectedSugar, setSelectedSugar] = useState(SUGAR_LEVELS[0]);
  const [quantity, setQuantity] = useState(1);

  const unitPrice = item.price + selectedSize.priceAdd;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    updatePreOrderQty(item.id, quantity);
    Alert.alert(
      'Đã thêm vào giỏ',
      `Đã thêm ${quantity}x ${item.name} (${selectedSize.label}) vào danh sách đặt trước!`,
      [
        { text: 'Tiếp tục xem menu', onPress: () => navigation.goBack() },
        { text: 'Đến trang Đặt Bàn', onPress: () => navigation.navigate('BookingTab') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Visual Header */}
      <View style={styles.heroBanner}>
        <Ionicons name="cafe" size={80} color={colors.primary} />
        <View style={styles.catBadge}>
          <Text style={styles.catText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.drinkName}>{item.name}</Text>
          <Text style={styles.drinkPrice}>{formatCurrency(unitPrice)}</Text>
        </View>
        <Text style={styles.descText}>{item.description}</Text>

        {/* Size Selection */}
        <View style={styles.optionSection}>
          <Text style={styles.sectionLabel}>Chọn kích cỡ (Size):</Text>
          <View style={styles.pillsRow}>
            {SIZES.map(s => {
              const active = selectedSize.label === s.label;
              return (
                <TouchableOpacity
                  key={s.label}
                  style={[styles.optionPill, active && styles.optionPillActive]}
                  onPress={() => setSelectedSize(s)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {s.label} {s.priceAdd > 0 ? `(+${formatCurrency(s.priceAdd)})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sugar Level */}
        <View style={styles.optionSection}>
          <Text style={styles.sectionLabel}>Mức độ ngọt (Đường):</Text>
          <View style={styles.pillsRow}>
            {SUGAR_LEVELS.map(s => {
              const active = selectedSugar === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.optionPill, active && styles.optionPillActive]}
                  onPress={() => setSelectedSugar(s)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Ice Level */}
        <View style={styles.optionSection}>
          <Text style={styles.sectionLabel}>Lượng đá:</Text>
          <View style={styles.pillsRow}>
            {ICE_LEVELS.map(i => {
              const active = selectedIce === i;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.optionPill, active && styles.optionPillActive]}
                  onPress={() => setSelectedIce(i)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{i}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quantity Stepper */}
        <View style={styles.qtyRow}>
          <Text style={styles.sectionLabel}>Số lượng đặt trước:</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.qtyNumber}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: colors.primary }]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Ionicons name="cart" size={18} color="#fff" />
          <Text style={styles.addBtnText}>
            Thêm Vào Đặt Trước • {formatCurrency(totalPrice)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBanner: {
    height: 180,
    backgroundColor: colors.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  catBadge: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drinkName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  drinkPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  descText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  optionSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionPillActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  pillTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 20,
    textAlign: 'center',
    color: colors.text,
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 50,
    gap: 8,
    marginTop: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

