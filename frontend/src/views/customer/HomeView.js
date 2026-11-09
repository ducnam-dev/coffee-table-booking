import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CoffeeContext } from '../../context/CoffeeContext';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../config/api';

const { width } = Dimensions.get('window');

export default function HomeView({ navigation }) {
  const { user, isStaff } = useContext(AuthContext);
  const { tables, menu, setSelectedTableForBooking } = useContext(CoffeeContext);

  const availableTables = tables.filter(t => t.status === 'AVAILABLE');
  const featuredMenu = menu.slice(0, 4);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          <View>
            <Text style={styles.brandName}>
              Pam Coffee <Text style={{ color: colors.primary }}>& Tea</Text>
            </Text>
            <Text style={styles.greeting}>
              Xin chào, {user?.fullName || user?.username || 'Khách yêu'} 👋
            </Text>
          </View>
        </View>

          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </TouchableOpacity>

            {isStaff && (
              <TouchableOpacity
                style={styles.adminBadgeBtn}
                onPress={() => navigation.navigate('AdminDashboard')}
              >
                <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                <Text style={styles.adminBadgeText}>Quản Trị</Text>
              </TouchableOpacity>
            )}
          </View>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <Image
          source={require('../../../assets/hero.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Còn {availableTables.length} bàn trống hôm nay</Text>
          </View>
          <Text style={styles.heroHeadline}>Không Gian Thư Giãn & Cà Phê Thơm Ngon</Text>
          <Text style={styles.heroSub}>Đặt bàn trước để luôn có vị trí đẹp nhất cho bạn và người thân.</Text>

          <View style={styles.heroBtnRow}>
            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={() => navigation.navigate('BookingTab')}
            >
              <Text style={styles.primaryCtaText}>Đặt Bàn Ngay</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryCtaBtn}
              onPress={() => navigation.navigate('MenuTab')}
            >
              <Text style={styles.secondaryCtaText}>Xem Thực Đơn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* AI Assistant Banner */}
      <TouchableOpacity
        style={styles.aiBanner}
        onPress={() => navigation.navigate('AIAssistant')}
      >
        <View style={styles.aiBannerLeft}>
          <View style={styles.aiBannerIcon}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBannerTitle}>Pam AI Đặt Bàn Thông Minh</Text>
            <Text style={styles.aiBannerSub}>Gợi ý bàn & combo đồ uống theo mục đích</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
      </TouchableOpacity>

      {/* Features */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tiện ích nổi bật (MVP)</Text>
        <Text style={styles.sectionSub}>Trải nghiệm không gian chuẩn tại Pam Coffee & Tea</Text>
      </View>

      <View style={styles.featureGrid}>
        <View style={styles.featureItem}>
          <View style={[styles.featureIconBox, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="wifi" size={20} color="#b45309" />
          </View>
          <Text style={styles.featureName}>Wifi 5GHz Free</Text>
          <Text style={styles.featureDesc}>Tốc độ cao học tập & làm việc</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIconBox, { backgroundColor: '#e0f2fe' }]}>
            <Ionicons name="flash" size={20} color="#0369a1" />
          </View>
          <Text style={styles.featureName}>Ổ cắm từng bàn</Text>
          <Text style={styles.featureDesc}>Sạc laptop, điện thoại thoải mái</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIconBox, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="snow" size={20} color="#15803d" />
          </View>
          <Text style={styles.featureName}>Phòng Lạnh 24/7</Text>
          <Text style={styles.featureDesc}>Mát rượi, yên tĩnh tuyệt đối</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIconBox, { backgroundColor: '#fce7f3' }]}>
            <Ionicons name="leaf" size={20} color="#be185d" />
          </View>
          <Text style={styles.featureName}>Sân Vườn Xanh</Text>
          <Text style={styles.featureDesc}>Thoáng đãng ngoài trời thư giãn</Text>
        </View>
      </View>

      {/* Featured Menu */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Món nổi bật được yêu thích</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MenuTab')}>
            <Text style={styles.seeAllText}>Xem tất cả ({menu.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {featuredMenu.map(item => (
          <View key={item.id} style={styles.menuCard}>
            <View style={styles.menuImagePlaceholder}>
              <Ionicons name="cafe" size={36} color={colors.primary} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.menuCardBody}>
              <Text style={styles.menuItemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.menuBottomRow}>
                <Text style={styles.menuItemPrice}>{formatCurrency(item.price)}</Text>
                <TouchableOpacity
                  style={styles.addMenuBtn}
                  onPress={() => navigation.navigate('MenuTab')}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Tables Preview */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Sơ đồ bàn quán</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TablesTab')}>
            <Text style={styles.seeAllText}>Chi tiết sơ đồ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tablePreviewGrid}>
        {tables.slice(0, 4).map(table => {
          const isAvailable = table.status === 'AVAILABLE';
          return (
            <TouchableOpacity
              key={table.id}
              style={[
                styles.tablePreviewCard,
                { borderColor: isAvailable ? colors.success : colors.warning }
              ]}
              onPress={() => {
                if (isAvailable) {
                  setSelectedTableForBooking(table);
                  navigation.navigate('BookingTab');
                } else {
                  navigation.navigate('TablesTab');
                }
              }}
            >
              <View style={styles.tableCardHeader}>
                <Text style={styles.tableName}>{table.name}</Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isAvailable ? colors.successLight : colors.warningLight }
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: isAvailable ? colors.success : colors.warning }
                    ]}
                  >
                    {isAvailable ? 'Trống' : 'Đã đặt'}
                  </Text>
                </View>
              </View>

              <Text style={styles.tableDetails}>
                👥 {table.seats} chỗ ngồi • {table.type}
              </Text>
              <Text style={styles.tableActionHint}>
                {isAvailable ? '👉 Nhấn để đặt ngay' : 'Đang bận'}
              </Text>
            </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  greeting: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  adminBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 22,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.55,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    justifyContent: 'space-between',
  },
  liveBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  heroHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 26,
  },
  heroSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: -4,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  primaryCtaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryCtaBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  secondaryCtaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  notifBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
    borderColor: '#fde68a',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  aiBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  aiBannerSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    marginTop: 12,
    gap: 10,
  },
  featureItem: {
    width: (width - 48) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  featureDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  menuCard: {
    width: 170,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuImagePlaceholder: {
    height: 100,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  menuCardBody: {
    padding: 12,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  menuItemDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
    height: 28,
  },
  menuBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  addMenuBtn: {
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tablePreviewGrid: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  tablePreviewCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
  },
  tableCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableDetails: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  tableActionHint: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
});

