import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { TableModel } from '../../models/TableModel';
import { ReservationModel } from '../../models/ReservationModel';
import { CoffeeTable, TableStatus, TableArea, Reservation, ReservationStatus } from '../../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  AVAILABLE: { label: 'Trống', color: '#16a34a', bg: '#dcfce7', icon: 'checkmark-circle' },
  OCCUPIED:  { label: 'Có khách', color: '#dc2626', bg: '#fee2e2', icon: 'people' },
  RESERVED:  { label: 'Đã đặt', color: '#d97706', bg: '#fef3c7', icon: 'calendar' },
};

const AREA_LABELS: Record<string, string> = {
  INDOOR: 'Trong nhà 🏠',
  OUTDOOR: 'Sân vườn 🌿',
  BALCONY: 'Gác lửng 🌇',
  VIP: 'Phòng VIP 👑',
};

const RES_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Chờ duyệt', color: '#d97706', bg: '#fef3c7' },
  CONFIRMED: { label: 'Đã duyệt', color: '#16a34a', bg: '#dcfce7' },
  CANCELLED: { label: 'Đã hủy',   color: '#dc2626', bg: '#fee2e2' },
};

type TabType = 'tables' | 'bookings';

export const AdminTablesView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('tables');

  // Tables state
  const [tables, setTables] = useState<CoffeeTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [refreshingTables, setRefreshingTables] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingRes, setLoadingRes] = useState(true);
  const [refreshingRes, setRefreshingRes] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [resFilter, setResFilter] = useState<ReservationStatus | 'ALL'>('ALL');

  // Add table modal
  const [modalVisible, setModalVisible] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [area, setArea] = useState<TableArea>('INDOOR');
  const [hasSocket, setHasSocket] = useState(true);
  const [isWindow, setIsWindow] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTables = async (refresh = false) => {
    if (refresh) setRefreshingTables(true);
    else setLoadingTables(true);
    const data = await TableModel.getAllTables();
    setTables(data);
    if (refresh) setRefreshingTables(false);
    else setLoadingTables(false);
  };

  const loadReservations = async (refresh = false) => {
    if (refresh) setRefreshingRes(true);
    else setLoadingRes(true);
    const data = await ReservationModel.getAllReservations();
    setReservations(data);
    if (refresh) setRefreshingRes(false);
    else setLoadingRes(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTables();
      loadReservations();
    }, [])
  );

  const handleChangeStatus = async (table: CoffeeTable, nextStatus: TableStatus) => {
    if (table.status === nextStatus) return;
    setUpdatingId(table.id);
    try {
      await TableModel.updateTableStatus(table.id, nextStatus);
      setTables(prev => prev.map(t => t.id === table.id ? { ...t, status: nextStatus } : t));
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái bàn.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateResStatus = async (id: number, status: ReservationStatus) => {
    setApprovingId(id);
    try {
      await ReservationModel.updateStatus(id, status);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      if (status === 'CONFIRMED') {
        // Reload tables too so status updates
        loadTables();
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật đơn đặt bàn.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleCreateTable = async () => {
    if (!tableNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên/số bàn!');
      return;
    }
    setSaving(true);
    try {
      await TableModel.createTable({
        tableNumber: tableNumber.trim(),
        capacity: parseInt(capacity, 10) || 4,
        area,
        status: 'AVAILABLE',
        hasPowerOutlet: hasSocket,
        isWindowView: isWindow,
      });
      setModalVisible(false);
      setTableNumber('');
      setCapacity('4');
      await loadTables();
      Alert.alert('✅ Thành công', 'Đã thêm bàn mới!');
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm bàn lúc này.');
    } finally {
      setSaving(false);
    }
  };

  const filteredRes = reservations.filter(r => resFilter === 'ALL' || r.status === resFilter);
  const pendingCount = reservations.filter(r => r.status === 'PENDING').length;

  // --- RENDER TABLES TAB ---
  const renderTablesTab = () => (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshingTables} onRefresh={() => loadTables(true)} colors={[colors.primary]} />}
    >
      {/* Summary row */}
      <View style={styles.summaryRow}>
        {(['AVAILABLE', 'OCCUPIED', 'RESERVED'] as TableStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s];
          const count = tables.filter(t => t.status === s).length;
          return (
            <View key={s} style={[styles.summaryCard, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.summaryCount, { color: cfg.color }]}>{count}</Text>
              <Text style={[styles.summaryLabel, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          );
        })}
      </View>

      {loadingTables ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
      ) : tables.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="grid-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>Chưa có bàn nào</Text>
        </View>
      ) : (
        tables.map((t, i) => {
          const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.AVAILABLE;
          const isUpdating = updatingId === t.id;
          return (
            <FadeInView key={t.id} delay={i * 25}>
              <View style={styles.tableCard}>
                {/* Header row */}
                <View style={styles.tableCardHeader}>
                  <View style={[styles.tableIconBox, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
                  </View>
                  <View style={styles.tableCardInfo}>
                    <Text style={styles.tableCardName}>{t.tableNumber}</Text>
                    <Text style={styles.tableCardMeta}>
                      {AREA_LABELS[t.area] || t.area} • {t.capacity} chỗ
                      {t.hasPowerOutlet ? ' ⚡' : ''}
                      {t.isWindowView ? ' 🪟' : ''}
                    </Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.statusPillText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>

                {/* Status change buttons */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusRowLabel}>Chuyển trạng thái:</Text>
                  {isUpdating ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <View style={styles.statusBtnGroup}>
                      {(['AVAILABLE', 'OCCUPIED', 'RESERVED'] as TableStatus[]).map(s => {
                        const sc = STATUS_CONFIG[s];
                        const isActive = t.status === s;
                        return (
                          <TouchableOpacity
                            key={s}
                            onPress={() => handleChangeStatus(t, s)}
                            style={[
                              styles.statusBtn,
                              isActive
                                ? { backgroundColor: sc.color, borderColor: sc.color }
                                : { backgroundColor: sc.bg, borderColor: sc.color + '50' },
                            ]}
                          >
                            <Text style={[styles.statusBtnText, { color: isActive ? '#fff' : sc.color }]}>
                              {sc.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            </FadeInView>
          );
        })
      )}
    </ScrollView>
  );

  // --- RENDER BOOKINGS TAB ---
  const renderBookingsTab = () => (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshingRes} onRefresh={() => loadReservations(true)} colors={[colors.primary]} />}
    >
      {/* Filter chips */}
      <View style={styles.filterRow}>
        {(['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'] as const).map(s => (
          <TouchableOpacity
            key={s}
            onPress={() => setResFilter(s)}
            style={[styles.filterChip, resFilter === s && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, resFilter === s && styles.filterChipTextActive]}>
              {s === 'ALL' ? 'Tất cả' : s === 'PENDING' ? `Chờ duyệt${pendingCount > 0 ? ` (${pendingCount})` : ''}` : s === 'CONFIRMED' ? 'Đã duyệt' : 'Đã hủy'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loadingRes ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
      ) : filteredRes.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>Không có đơn đặt bàn nào</Text>
        </View>
      ) : (
        filteredRes.map((r, i) => {
          const rcfg = RES_STATUS_CONFIG[r.status] || RES_STATUS_CONFIG.PENDING;
          const isApproving = approvingId === r.id;
          return (
            <FadeInView key={r.id} delay={i * 30}>
              <View style={styles.resCard}>
                {/* Top row */}
                <View style={styles.resCardTop}>
                  <View style={styles.resAvatarBox}>
                    <Text style={styles.resAvatarText}>
                      {(r.customerName || 'K').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.resInfo}>
                    <Text style={styles.resCustName}>{r.customerName || 'Khách hàng'}</Text>
                    <Text style={styles.resPhone}>📞 {r.phone || '---'}</Text>
                  </View>
                  <View style={[styles.resBadge, { backgroundColor: rcfg.bg }]}>
                    <Text style={[styles.resBadgeText, { color: rcfg.color }]}>{rcfg.label}</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.resMeta}>
                  <View style={styles.resMetaItem}>
                    <Ionicons name="grid-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.resMetaText}>Bàn <Text style={{ fontWeight: '700' }}>{r.tableNumber}</Text></Text>
                  </View>
                  <View style={styles.resMetaItem}>
                    <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.resMetaText}>{r.guestCount} người</Text>
                  </View>
                  <View style={styles.resMetaItem}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.resMetaText}>{r.reservationDate}</Text>
                  </View>
                  <View style={styles.resMetaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.resMetaText}>{r.reservationTime}</Text>
                  </View>
                </View>

                {r.specialRequests ? (
                  <View style={styles.resNote}>
                    <Ionicons name="chatbubble-ellipses-outline" size={13} color={colors.primaryDark} />
                    <Text style={styles.resNoteText}>{r.specialRequests}</Text>
                  </View>
                ) : null}

                <View style={styles.resFooter}>
                  <Text style={styles.resDepositLabel}>Tiền cọc</Text>
                  <Text style={styles.resDepositVal}>
                    {(r.depositAmount || 50000).toLocaleString('vi-VN')}đ
                  </Text>
                </View>

                {/* Action buttons */}
                {r.status === 'PENDING' && (
                  <View style={styles.resActions}>
                    {isApproving ? (
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() => handleUpdateResStatus(r.id, 'CONFIRMED')}
                        >
                          <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                          <Text style={styles.approveBtnText}>Phê Duyệt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectBtn}
                          onPress={() =>
                            Alert.alert('Xác nhận', 'Từ chối đơn đặt bàn này?', [
                              { text: 'Hủy', style: 'cancel' },
                              { text: 'Từ chối', style: 'destructive', onPress: () => handleUpdateResStatus(r.id, 'CANCELLED') },
                            ])
                          }
                        >
                          <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
                          <Text style={styles.rejectBtnText}>Từ Chối</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
                {r.status === 'CONFIRMED' && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() =>
                      Alert.alert('Xác nhận', 'Hủy đơn đã duyệt này?', [
                        { text: 'Không', style: 'cancel' },
                        { text: 'Hủy đơn', style: 'destructive', onPress: () => handleUpdateResStatus(r.id, 'CANCELLED') },
                      ])
                    }
                  >
                    <Text style={styles.cancelBtnText}>Hủy đơn</Text>
                  </TouchableOpacity>
                )}
              </View>
            </FadeInView>
          );
        })
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>
          {activeTab === 'tables' ? 'Quản Lý Bàn' : 'Đơn Đặt Bàn'}
        </Text>
        {activeTab === 'tables' ? (
          <AnimatedScaleButton
            onPress={() => {
              setTableNumber(`Bàn ${tables.length + 1 < 10 ? '0' : ''}${tables.length + 1}`);
              setModalVisible(true);
            }}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </AnimatedScaleButton>
        ) : (
          <AnimatedScaleButton onPress={() => loadReservations(true)} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={20} color={colors.textPrimary} />
          </AnimatedScaleButton>
        )}
      </View>

      {/* Tab switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tables' && styles.tabActive]}
          onPress={() => setActiveTab('tables')}
        >
          <Ionicons name="grid" size={16} color={activeTab === 'tables' ? colors.primaryDark : colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'tables' && styles.tabTextActive]}>
            Bàn ({tables.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bookings' && styles.tabActive]}
          onPress={() => setActiveTab('bookings')}
        >
          <Ionicons name="calendar" size={16} color={activeTab === 'bookings' ? colors.primaryDark : colors.textMuted} />
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.tabTextActive]}>
            Đặt bàn
            {pendingCount > 0 && (
              <Text style={styles.badge}> {pendingCount}</Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'tables' ? renderTablesTab() : renderBookingsTab()}

      {/* Add Table Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>➕ Thêm Bàn Mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Tên / Số bàn *</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Bàn 07, VIP 01..."
                placeholderTextColor={colors.textMuted}
                value={tableNumber}
                onChangeText={setTableNumber}
              />

              <Text style={styles.inputLabel}>Sức chứa (người)</Text>
              <TextInput
                style={styles.input}
                placeholder="4"
                keyboardType="numeric"
                placeholderTextColor={colors.textMuted}
                value={capacity}
                onChangeText={setCapacity}
              />

              <Text style={styles.inputLabel}>Khu vực</Text>
              <View style={styles.areaGrid}>
                {(['INDOOR', 'OUTDOOR', 'BALCONY', 'VIP'] as TableArea[]).map(a => (
                  <TouchableOpacity
                    key={a}
                    onPress={() => setArea(a)}
                    style={[styles.areaBtn, area === a && styles.areaBtnActive]}
                  >
                    <Text style={[styles.areaBtnText, area === a && styles.areaBtnTextActive]}>
                      {AREA_LABELS[a]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Tiện ích</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, hasSocket && styles.toggleBtnActive]}
                  onPress={() => setHasSocket(!hasSocket)}
                >
                  <Ionicons name={hasSocket ? 'flash' : 'flash-outline'} size={18} color={hasSocket ? '#fff' : colors.textMuted} />
                  <Text style={[styles.toggleBtnText, hasSocket && { color: '#fff' }]}>Ổ cắm điện</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, isWindow && styles.toggleBtnActive]}
                  onPress={() => setIsWindow(!isWindow)}
                >
                  <Ionicons name={isWindow ? 'sunny' : 'sunny-outline'} size={18} color={isWindow ? '#fff' : colors.textMuted} />
                  <Text style={[styles.toggleBtnText, isWindow && { color: '#fff' }]}>View cửa sổ</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.submitBtn, saving && { opacity: 0.6 }]} onPress={handleCreateTable} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.submitBtnText}>Tạo & Đưa Vào Hoạt Động</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5f0' },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.soft,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  refreshBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceSubtle },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h2, fontSize: 18 },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabActive: { borderBottomColor: colors.primaryDark },
  tabText: { ...typography.caption, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.primaryDark, fontWeight: '800' },
  badge: { color: '#dc2626', fontWeight: '800' },

  scroll: { padding: spacing.md, paddingBottom: 80 },

  // Summary
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  summaryCard: { flex: 1, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  summaryCount: { fontSize: 24, fontWeight: '900' },
  summaryLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },

  // Table card
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  tableCardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tableIconBox: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  tableCardInfo: { flex: 1 },
  tableCardName: { ...typography.bodyLarge, fontWeight: '800', fontSize: 16 },
  tableCardMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  statusPill: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontWeight: '800' },

  // Status buttons
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusRowLabel: { ...typography.caption, color: colors.textMuted, fontSize: 11 },
  statusBtnGroup: { flexDirection: 'row', gap: 6 },
  statusBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBtnText: { fontSize: 11, fontWeight: '700' },

  // Empty
  emptyBox: { alignItems: 'center', paddingTop: 60, gap: spacing.md },
  emptyText: { ...typography.bodyLarge, color: colors.textMuted },

  // Filter
  filterRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md, flexWrap: 'wrap' },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.espresso, borderColor: colors.espresso },
  filterChipText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: '#fff', fontWeight: '800' },

  // Reservation card
  resCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  resCardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  resAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resAvatarText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  resInfo: { flex: 1 },
  resCustName: { ...typography.bodyLarge, fontWeight: '800' },
  resPhone: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  resBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 20 },
  resBadgeText: { fontSize: 11, fontWeight: '800' },
  resMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  resMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resMetaText: { ...typography.caption, color: colors.textSecondary },
  resNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginTop: spacing.xs, backgroundColor: '#eff6ff', padding: spacing.xs, borderRadius: radius.sm },
  resNoteText: { ...typography.caption, color: colors.primaryDark, flex: 1, fontStyle: 'italic' },
  resFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  resDepositLabel: { ...typography.caption, color: colors.textMuted },
  resDepositVal: { ...typography.bodyLarge, fontWeight: '800', color: colors.primaryDark },

  // Action buttons
  resActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 42, borderRadius: radius.lg,
    backgroundColor: '#16a34a',
  },
  approveBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 42, borderRadius: radius.lg,
    backgroundColor: '#fee2e2', borderWidth: 1.5, borderColor: '#dc2626',
  },
  rejectBtnText: { color: '#dc2626', fontWeight: '800', fontSize: 14 },
  cancelBtn: {
    marginTop: spacing.sm, height: 36, borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle, alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalHandle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.md },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h2 },
  inputLabel: { ...typography.caption, fontWeight: '700', color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.xs },
  input: {
    backgroundColor: '#f8f5f0',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    ...typography.body,
    color: colors.textPrimary,
  },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  areaBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#f8f5f0',
  },
  areaBtnActive: { backgroundColor: colors.espresso, borderColor: colors.espresso },
  areaBtnText: { ...typography.caption, fontWeight: '700', color: colors.textSecondary },
  areaBtnTextActive: { color: '#fff' },
  toggleRow: { flexDirection: 'row', gap: spacing.sm },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 44, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: '#f8f5f0',
  },
  toggleBtnActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  toggleBtnText: { ...typography.caption, fontWeight: '700', color: colors.textMuted },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 52, borderRadius: radius.xl,
    backgroundColor: colors.primaryDark, marginTop: spacing.xl, marginBottom: spacing.lg,
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default AdminTablesView;
