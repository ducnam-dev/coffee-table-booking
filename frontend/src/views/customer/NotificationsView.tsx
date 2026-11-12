import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';

interface NotificationsViewProps {
  navigation: any;
}

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Ưu đãi đặt bàn sớm (Happy Hour)',
    message: 'Giảm ngay 20% tổng hóa đơn thức uống khi đặt bàn trước khung giờ 08:00 - 11:00 các ngày trong tuần.',
    time: '2 giờ trước',
    type: 'promo',
    isRead: false,
  },
  {
    id: 2,
    title: 'Xác nhận đặt bàn thành công #PAM-101',
    message: 'Bàn B01 của bạn đã sẵn sàng cho ngày mai lúc 09:00. Hân hạnh được đón tiếp bạn!',
    time: 'Hôm qua',
    type: 'booking',
    isRead: true,
  },
  {
    id: 3,
    title: 'Món mới ra mắt: Cà Phê Muối Pam Signature',
    message: 'Thử ngay vị cà phê muối béo ngậy được chế biến thủ công cùng cốt phin Đắk Lắk hảo hạng.',
    time: '3 ngày trước',
    type: 'news',
    isRead: true,
  },
];

export const NotificationsView: React.FC<NotificationsViewProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AnimatedScaleButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedScaleButton>
        <Text style={styles.headerTitle}>Thông Báo & Khuyến Mãi</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((item, idx) => (
          <FadeInView key={item.id} delay={idx * 60} style={styles.itemWrap}>
            <BentoCard
              variant={item.isRead ? 'elevated' : 'amber'}
              padding="md"
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <View style={styles.titleRow}>
                  <Ionicons
                    name={
                      item.type === 'promo'
                        ? 'gift-outline'
                        : item.type === 'booking'
                        ? 'checkmark-circle-outline'
                        : 'newspaper-outline'
                    }
                    size={20}
                    color={colors.primaryDark}
                  />
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                {!item.isRead && <Badge label="MỚI" variant="danger" />}
              </View>

              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </BentoCard>
          </FadeInView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  itemWrap: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.sm,
  },
  itemTitle: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  message: {
    ...typography.body,
    lineHeight: 20,
    marginTop: 2,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});

export default NotificationsView;

