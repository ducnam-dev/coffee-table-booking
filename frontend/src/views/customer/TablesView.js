import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoffeeContext } from '../../context/CoffeeContext';
import { TablesPresenter } from '../../presenters/TablesPresenter';
import { colors } from '../../theme/colors';

const FILTER_AREAS = ['Tất cả', 'Cặp đôi', 'Sân vườn', 'Phòng lạnh', 'Gác lửng'];

export default function TablesView({ navigation }) {
  const { tables, setSelectedTableForBooking, refreshData } = useContext(CoffeeContext);
  const [selectedArea, setSelectedArea] = useState('Tất cả');
  const [loading, setLoading] = useState(false);

  // Passive View Contract Implementation
  const viewContract = useMemo(() => ({
    showLoading: (isLoading) => setLoading(isLoading),
    showError: (msg) => console.warn(msg),
    displayTables: () => refreshData()
  }), [refreshData]);

  const presenter = useMemo(() => new TablesPresenter(viewContract), [viewContract]);

  const filteredTables = useMemo(
    () => presenter.filterTables(tables, selectedArea),
    [presenter, tables, selectedArea]
  );

  const stats = useMemo(
    () => presenter.calculateStats(tables),
    [presenter, tables]
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return colors.success;
      case 'RESERVED': return colors.warning;
      case 'OCCUPIED': return colors.danger;
      default: return colors.textMuted;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Còn trống';
      case 'RESERVED': return 'Đã đặt trước';
      case 'OCCUPIED': return 'Đang có khách';
      default: return status;
    }
  };

  const handleBookTable = (table) => {
    setSelectedTableForBooking(table);
    navigation.navigate('BookingTab');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sơ Đồ Bàn Trực Quan</Text>
        <Text style={styles.headerSub}>
          [Kiến Trúc MVP] Xem trạng thái thời gian thực và tiện ích từng bàn
        </Text>

        <View style={styles.statusLegendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Trống: <Text style={{ fontWeight: '700' }}>{stats.available}</Text></Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Đã đặt: <Text style={{ fontWeight: '700' }}>{stats.reserved}</Text></Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Đang dùng: <Text style={{ fontWeight: '700' }}>{stats.occupied}</Text></Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_AREAS.map(area => {
          const active = selectedArea === area;
          return (
            <TouchableOpacity
              key={area}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedArea(area)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {area}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Table Cards List */}
      <View style={styles.tableListContainer}>
        {filteredTables.map(table => {
          const isAvailable = table.status === 'AVAILABLE';
          const statusColor = getStatusColor(table.status);

          return (
            <View key={table.id} style={[styles.tableCard, { borderLeftColor: statusColor, borderLeftWidth: 5 }]}>
              <View style={styles.tableCardTop}>
                <View>
                  <Text style={styles.tableCardName}>{table.name}</Text>
                  <Text style={styles.tableCardType}>Khu vực: {table.type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
                  <View style={[styles.statusBadgeDot, { backgroundColor: statusColor }]} />
                  <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                    {getStatusLabel(table.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.amenitiesContainer}>
                <View style={styles.amenityPill}>
                  <Ionicons name="people" size={14} color={colors.textMuted} />
                  <Text style={styles.amenityText}>{table.seats} chỗ ngồi</Text>
                </View>
                {table.hasSocket && (
                  <View style={styles.amenityPill}>
                    <Ionicons name="flash" size={14} color="#0284c7" />
                    <Text style={[styles.amenityText, { color: '#0369a1' }]}>Có ổ cắm sạc</Text>
                  </View>
                )}
                {table.isNearWindow && (
                  <View style={styles.amenityPill}>
                    <Ionicons name="sunny" size={14} color="#d97706" />
                    <Text style={[styles.amenityText, { color: '#b45309' }]}>Gần cửa sổ</Text>
                  </View>
                )}
                {table.isOutdoor && (
                  <View style={styles.amenityPill}>
                    <Ionicons name="leaf" size={14} color="#16a34a" />
                    <Text style={[styles.amenityText, { color: '#15803d' }]}>Sân vườn thoáng</Text>
                  </View>
                )}
              </View>

              <View style={styles.tableCardBottom}>
                {isAvailable ? (
                  <TouchableOpacity
                    style={styles.bookNowBtn}
                    onPress={() => handleBookTable(table)}
                  >
                    <Text style={styles.bookNowBtnText}>Đặt Bàn Này Ngay</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.unavailableBox}>
                    <Ionicons name="time" size={16} color={colors.textMuted} />
                    <Text style={styles.unavailableText}>
                      Bàn hiện không thể đặt trực tuyến
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
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
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
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
    lineHeight: 18,
  },
  statusLegendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  tableListContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tableCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tableCardName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  tableCardType: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  statusBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  amenityText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tableCardBottom: {
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
    paddingTop: 12,
  },
  bookNowBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  bookNowBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  unavailableBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  unavailableText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

