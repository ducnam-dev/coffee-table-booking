import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../config/api';

export default function BookingDetailView({ route, navigation }) {
  const { booking } = route.params || {
    booking: {
      id: 101,
      customerName: 'Lê Hoàng Khách VIP',
      customerPhone: '0901234567',
      customerEmail: 'vip@pamcoffeetea.com',
      coffeeTable: { id: 1, name: 'Bàn 01 (Cửa sổ)' },
      timeDisplay: '19:00 - Hôm nay',
      guestNumber: 2,
      status: 'CONFIRMED',
      note: 'Góc yên tĩnh học bài',
      orderItems: [{ menuItem: { name: 'Trà Sữa Gạo Rang', price: 18000 }, quantity: 2 }]
    }
  };

  const handleShareTicket = async () => {
    try {
      await Share.share({
        message: `☕ Vé Đặt Bàn Pam Coffee & Tea: Mã vé #${booking.id} - ${booking.coffeeTable?.name} lúc ${booking.timeDisplay} cho ${booking.guestNumber} người.`,
      });
    } catch (e) {}
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Ticket Card */}
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.brandText}>Pam Coffee & Tea</Text>
          <Text style={styles.ticketCode}>VÉ ĐẶT BÀN #{booking.id}</Text>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
            <Ionicons name="qr-code" size={140} color={colors.text} />
          </View>
          <Text style={styles.qrHint}>Đưa mã này cho nhân viên phục vụ khi đến quán</Text>
        </View>

        <View style={styles.dashLine} />

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>BÀN ĐÃ CHỌN</Text>
            <Text style={styles.value}>{booking.coffeeTable?.name || 'Bàn Quán'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>THỜI GIAN ĐẾN</Text>
            <Text style={styles.value}>{booking.timeDisplay || 'Hôm nay'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>KHÁCH HÀNG</Text>
            <Text style={styles.value}>{booking.customerName}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>SỐ LƯỢNG KHÁCH</Text>
            <Text style={styles.value}>{booking.guestNumber} người</Text>
          </View>
        </View>

        {booking.orderItems && booking.orderItems.length > 0 && (
          <View style={styles.drinksBox}>
            <Text style={styles.drinksTitle}>ĐỒ UỐNG ĐÃ ĐẶT TRƯỚC:</Text>
            {booking.orderItems.map((item, idx) => (
              <View key={idx} style={styles.drinkRow}>
                <Text style={styles.drinkName}>• {item.menuItem?.name || 'Món uống'}</Text>
                <Text style={styles.drinkQty}>x{item.quantity} ({formatCurrency(item.menuItem?.price || 20000)})</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Share / Action Button */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareTicket}>
          <Ionicons name="share-social-outline" size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Chia Sẻ Vé Đặt Bàn</Text>
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
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  ticketHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    paddingBottom: 14,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  ticketCode: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 1,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrBox: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 10,
  },
  dashLine: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 8,
  },
  gridItem: {
    width: '45%',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 3,
  },
  drinksBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  drinksTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 6,
  },
  drinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  drinkName: {
    fontSize: 12,
    color: colors.text,
  },
  drinkQty: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  actionRow: {
    marginTop: 20,
  },
  shareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 50,
    gap: 8,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

