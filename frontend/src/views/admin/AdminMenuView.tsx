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
import { colors, radius, spacing, typography } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { MenuModel } from '../../models/MenuModel';
import { MenuItem } from '../../types';

export const AdminMenuView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await MenuModel.getAllMenuItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailable = (item: MenuItem) => {
    item.isAvailable = !item.isAvailable;
    setItems([...items]);
    Alert.alert(
      'Cập nhật món',
      `${item.name} hiện ${item.isAvailable ? 'CÒN HÀNG' : 'HẾT HÀNG'}`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Quản Lý Thực Đơn</Text>
        <AnimatedScaleButton
          onPress={() => {
            Alert.alert('Thêm Món', 'Thêm món nước mới vào thực đơn?', [
              { text: 'Hủy' },
              {
                text: 'Thêm Cà Phê Mới',
                onPress: async () => {
                  await MenuModel.createMenuItem({
                    name: `Món Mới ${items.length + 1}`,
                    category: 'COFFEE',
                    price: 45000,
                    description: 'Hương vị thơm ngon',
                  });
                  await loadData();
                },
              },
            ]);
          }}
          style={styles.backBtn}
        >
          <Ionicons name="add" size={24} color={colors.primaryDark} />
        </AnimatedScaleButton>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {items.map((item, i) => (
            <FadeInView key={item.id} delay={i * 20} style={styles.cardWrap}>
              <BentoCard variant="elevated" padding="md">
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.cat}>Danh mục: {item.category}</Text>
                    <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
                  </View>

                  <Badge
                    label={item.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                    variant={item.isAvailable ? 'success' : 'danger'}
                  />
                </View>

                <View style={styles.actions}>
                  <AnimatedScaleButton
                    onPress={() => handleToggleAvailable(item)}
                    style={[
                      styles.toggleBtn,
                      { backgroundColor: item.isAvailable ? colors.dangerSubtle : colors.successSubtle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        { color: item.isAvailable ? colors.danger : colors.success },
                      ]}
                    >
                      {item.isAvailable ? 'Đánh dấu Hết hàng' : 'Đánh dấu Còn hàng'}
                    </Text>
                  </AnimatedScaleButton>
                </View>
              </BentoCard>
            </FadeInView>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h2 },
  scroll: { padding: spacing.lg, paddingBottom: 60 },
  cardWrap: { marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { ...typography.bodyLarge, fontWeight: '700' },
  cat: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  price: { ...typography.h3, color: colors.primaryDark, marginTop: 4 },
  actions: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggleBtn: {
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: { ...typography.caption, fontWeight: '700' },
});

export default AdminMenuView;

