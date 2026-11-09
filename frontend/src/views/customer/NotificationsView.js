import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const NOTIFICATIONS = [
  {
    id: 1,
    title: '🎉 Ưu đãi Giờ Vàng 14:00 - 17:00',
    content: 'Giảm ngay 20% cho toàn bộ nhóm thực đơn Trà Trái Cây khi đặt bàn trước!',
    time: '20 phút trước',
    read: false,
    icon: 'gift',
    color: '#d97706'
  },
  {
    id: 2,
    title: '✅ Đặt bàn đã được xác nhận',
    content: 'Bàn 01 (Cửa sổ) của bạn lúc 19:00 hôm nay đã sẵn sàng đón tiếp.',
    time: '2 giờ trước',
    read: false,
    icon: 'checkmark-circle',
    color: '#10b981'
  },
  {
    id: 3,
    title: '🌿 Menu Mới: Trà Sữa Gạo Rang',
    content: 'Hương vị thơm bùi gạo rang kết hợp sữa béo ngậy vừa ra mắt tại quán.',
    time: 'Hôm qua',
    read: true,
    icon: 'cafe',
    color: '#0284c7'
  }
];

export default function NotificationsView() {
  const [list, setList] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setList(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Thông Báo Quán</Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markReadText}>Đánh dấu đã đọc</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.list}>
        {list.map(item => (
          <View
            key={item.id}
            style={[styles.card, !item.read && { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  content: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 3,
  },
  time: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 6,
  },
});

