import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoffeeContext } from '../../context/CoffeeContext';
import { MenuPresenter } from '../../presenters/MenuPresenter';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../config/api';

const CATEGORIES = ['Tất cả', 'Trà Sữa', 'Ca Cao', 'Sữa Tươi', 'Trà Trái Cây'];

export default function MenuView({ navigation }) {
  const { menu, preOrder, updatePreOrderQty, preOrderTotal, preOrderCount } = useContext(CoffeeContext);

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Passive View Contract Implementation
  const viewContract = useMemo(() => ({
    showLoading: () => { },
    showError: (msg) => console.warn(msg),
    displayMenu: () => { }
  }), []);

  const presenter = useMemo(() => new MenuPresenter(viewContract), [viewContract]);

  const filteredMenu = useMemo(
    () => presenter.filterMenu(menu, selectedCategory, searchQuery),
    [presenter, menu, selectedCategory, searchQuery]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thực Đơn Đồ Uống</Text>
        <Text style={styles.headerSub}>
          [Kiến Trúc MVP] Danh mục món nước tự nhiên, pha chế tươi mới
        </Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm trà sữa, cacao, trà trái cây..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, active && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Items List */}
      <ScrollView
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredMenu.map(item => {
          const qty = preOrder[item.id] || 0;
          return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('DrinkDetail', { item })}
              >
                <View style={styles.itemIconBox}>
                  <Ionicons name="cafe" size={28} color={colors.primary} />
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.catBadge}>
                      <Text style={styles.catBadgeText}>{item.category}</Text>
                    </View>
                  </View>

                  <Text style={styles.itemDesc} numberOfLines={2}>
                    {item.description || 'Thức uống thơm ngon được yêu thích tại quán.'}
                  </Text>

                  <View style={styles.bottomRow}>
                    <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>

                    <View style={styles.stepper}>
                      {qty > 0 && (
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            updatePreOrderQty(item.id, -1);
                          }}
                        >
                          <Ionicons name="remove" size={16} color={colors.text} />
                        </TouchableOpacity>
                      )}
                      {qty > 0 && <Text style={styles.stepQty}>{qty}</Text>}
                      <TouchableOpacity
                        style={[styles.stepBtn, styles.stepBtnAdd]}
                        onPress={(e) => {
                          e.stopPropagation();
                          updatePreOrderQty(item.id, 1);
                        }}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
            </TouchableOpacity>
      );
        })}
      <View style={{ height: 100 }} />
    </ScrollView>

      {/* Floating Bottom Bar */ }
  {
    preOrderCount > 0 && (
      <View style={styles.floatingCartBar}>
        <View>
          <Text style={styles.cartCountText}>Đã chọn {preOrderCount} món nước</Text>
          <Text style={styles.cartTotalText}>{formatCurrency(preOrderTotal)}</Text>
        </View>
        <TouchableOpacity
          style={styles.cartCheckoutBtn}
          onPress={() => navigation.navigate('BookingTab')}
        >
          <Text style={styles.cartCheckoutText}>Tiến Hành Đặt Bàn</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    )
  }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  categoriesWrapper: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  itemsList: {
    padding: 16,
    gap: 12,
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 12,
  },
  itemIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  catBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  catBadgeText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnAdd: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepQty: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    minWidth: 18,
    textAlign: 'center',
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: colors.text,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
  },
  cartCountText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  cartCheckoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  cartCheckoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});

