import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { useResponsive } from '../../theme/responsive';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge, BadgeVariant } from '../../components/Badge';
import { TablesPresenter, TablesViewInterface } from '../../presenters/TablesPresenter';
import { useAppDispatch, useAppSelector } from '../../store';
import { setTables, selectTable } from '../../store/slices/tablesSlice';
import { CoffeeTable, TableArea, TableStatus } from '../../types';

interface TablesViewProps {
  navigation: any;
}

const AREAS: { key: TableArea | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'INDOOR', label: 'Trong nhà' },
  { key: 'BALCONY', label: 'Ban công' },
  { key: 'OUTDOOR', label: 'Sân vườn' },
  { key: 'VIP', label: 'Phòng VIP' },
];

export const TablesView: React.FC<TablesViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  const tables = useAppSelector((state) => state.tables.tables);
  const selected = useAppSelector((state) => state.tables.selectedTable);

  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState<TableArea | 'ALL'>('ALL');

  const viewCallbacks: TablesViewInterface = {
    showLoading: (l) => setLoading(l),
    showError: () => {},
    renderTables: (data) => dispatch(setTables(data)),
  };

  const presenter = new TablesPresenter(viewCallbacks);

  useEffect(() => {
    if (tables.length === 0) {
      presenter.loadTables();
    }
  }, []);

  const filteredTables = tables.filter(
    (t) => selectedArea === 'ALL' || t.area === selectedArea
  );

  const getStatusBadge = (status: TableStatus): { label: string; variant: BadgeVariant } => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'Bàn Trống', variant: 'success' };
      case 'OCCUPIED':
        return { label: 'Đang Có Khách', variant: 'danger' };
      case 'RESERVED':
        return { label: 'Đã Được Đặt', variant: 'warning' };
    }
  };

  const handleSelectTable = (table: CoffeeTable) => {
    if (table.status !== 'AVAILABLE') return;
    dispatch(selectTable(table));
    navigation.navigate('CustomerTabs', {
      screen: 'Booking',
      params: { preselectedTable: table },
    });
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('CustomerTabs');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Navigation Header Bar with Back Button */}
      <View style={[styles.navHeader, { paddingHorizontal: responsive.horizontalPadding }]}>
        <AnimatedScaleButton
          onPress={handleGoBack}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.navTitle} numberOfLines={1}>Sơ Đồ Bàn Quán</Text>
        <AnimatedScaleButton
          onPress={() => presenter.loadTables()}
          style={styles.backBtn}
        >
          <Ionicons name="refresh" size={20} color={colors.textPrimary} />
        </AnimatedScaleButton>
      </View>

      {/* Area Selector Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          {...(Platform.OS === 'web'
            ? {
                onWheel: (e: any) => {
                  if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                },
              }
            : {})}
          contentContainerStyle={[
            styles.filterScroll,
            { paddingHorizontal: responsive.horizontalPadding },
          ]}
        >
          {AREAS.map((a) => {
            const isActive = selectedArea === a.key;
            return (
              <AnimatedScaleButton
                key={a.key}
                onPress={() => setSelectedArea(a.key)}
                style={[styles.areaChip, isActive && styles.areaChipActive]}
              >
                <Text style={[styles.areaChipText, isActive && styles.areaChipTextActive]}>
                  {a.label}
                </Text>
              </AnimatedScaleButton>
            );
          })}
        </ScrollView>
      </View>

      {/* Legend Guide */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>Có khách</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Đã đặt</Text>
        </View>
      </View>

      {/* Tables Floor Plan Grid */}
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContainer,
            { paddingHorizontal: responsive.horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.grid,
              { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
            ]}
          >
            {filteredTables.map((table, index) => {
              const statusBadge = getStatusBadge(table.status);
              const isAvailable = table.status === 'AVAILABLE';
              const cardWidth =
                (responsive.width - responsive.horizontalPadding * 2 - spacing.md) / 2;

              return (
                <FadeInView
                  key={table.id}
                  delay={index * 30}
                  style={{ width: responsive.columns > 2 ? '31%' : cardWidth }}
                >
                  <AnimatedScaleButton
                    onPress={() => handleSelectTable(table)}
                    disabled={!isAvailable}
                    style={styles.tableCardTouchable}
                  >
                    <BentoCard
                      variant="elevated"
                      padding="md"
                      style={[
                        styles.tableCard,
                        selected?.id === table.id && styles.tableCardSelected,
                        !isAvailable && styles.tableCardDisabled,
                      ]}
                    >
                      <View style={styles.cardTop}>
                        <View style={styles.tableNumberWrap}>
                          <Text style={styles.tableNumber}>
                            {table.tableNumber || `B0${table.id}`}
                          </Text>
                        </View>
                        <Badge label={statusBadge.label} variant={statusBadge.variant} />
                      </View>

                      <View style={styles.tableNameWrap}>
                        <Text style={styles.tableName} numberOfLines={1}>
                          {table.name || `Bàn ${table.tableNumber || `0${table.id}`}`}
                        </Text>
                      </View>

                      <View style={styles.capacityRow}>
                        <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.capacityText}>Sức chứa: {table.capacity || table.seats || 4} người</Text>
                      </View>

                      <Text style={styles.description} numberOfLines={2}>
                        {table.description || table.name || 'Khu vực yên tĩnh, thoáng mát'}
                      </Text>

                      <View style={styles.perksRow}>
                        {table.hasPowerOutlet && (
                          <View style={styles.perkBadge}>
                            <Ionicons name="flash-outline" size={12} color={colors.primaryDark} />
                            <Text style={styles.perkText}>Ổ cắm</Text>
                          </View>
                        )}
                        {table.isWindowView && (
                          <View style={styles.perkBadge}>
                            <Ionicons name="sunny-outline" size={12} color={colors.primaryDark} />
                            <Text style={styles.perkText}>View đẹp</Text>
                          </View>
                        )}
                      </View>
                    </BentoCard>
                  </AnimatedScaleButton>
                </FadeInView>
              );
            })}
          </View>
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
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  filterBar: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.xxl,
  },
  areaChip: {
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaChipActive: {
    backgroundColor: colors.espresso,
    borderColor: colors.espresso,
  },
  areaChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  areaChipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  loader: {
    marginTop: spacing.xxxl,
  },
  listContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: 40,
  },
  grid: {},
  tableCardTouchable: {
    width: '100%',
  },
  tableCard: {
    borderRadius: radius.lg,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  tableCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primarySubtle,
  },
  tableCardDisabled: {
    opacity: 0.65,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableNumberWrap: {
    minWidth: 44,
    height: 38,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  tableNumber: {
    fontSize: 14,
    color: colors.textInverse,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tableNameWrap: {
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  tableName: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  capacityText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  perksRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: spacing.xs,
  },
  perkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  perkText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});

export default TablesView;

