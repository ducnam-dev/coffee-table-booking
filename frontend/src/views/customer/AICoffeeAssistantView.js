import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIModel } from '../../models/AIModel';
import { CoffeeContext } from '../../context/CoffeeContext';
import { colors } from '../../theme/colors';
import { FadeInView } from '../../components/FadeInView';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { formatCurrency } from '../../config/api';

const PURPOSES = [
  'Làm việc & Học tập',
  'Hẹn hò lãng mạn',
  'Gặp gỡ bạn bè',
  'Thư giãn sân vườn'
];

export default function AICoffeeAssistantView({ navigation }) {
  const { setSelectedTableForBooking, updatePreOrderQty } = useContext(CoffeeContext);

  const [purpose, setPurpose] = useState('Làm việc & Học tập');
  const [guestCount, setGuestCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const handleAskAI = async () => {
    setLoading(true);
    try {
      const result = await AIModel.getRecommendation(purpose, guestCount, 'tiêu chuẩn');
      setRecommendation(result);
    } catch (e) {
      Alert.alert('Thông báo', 'Không thể kết nối dịch vụ AI');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAIBooking = () => {
    if (recommendation?.recommendedTable) {
      setSelectedTableForBooking(recommendation.recommendedTable);
      // Pre-add recommended drink
      if (recommendation.recommendedDrinks?.length > 0) {
        updatePreOrderQty(recommendation.recommendedDrinks[0].id, 1);
      }
      navigation.navigate('BookingTab');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiBadgeRow}>
          <View style={styles.aiIconBox}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <Text style={styles.aiBadgeText}>Pam AI Assistant 2.0</Text>
        </View>
        <Text style={styles.headerTitle}>Trợ Lý AI Đặt Bàn Thông Minh</Text>
        <Text style={styles.headerSub}>
          Trí tuệ nhân tạo phân tích sở thích và mục đích để chọn vị trí bàn & combo đồ uống hoàn hảo nhất
        </Text>
      </View>

      <View style={styles.content}>
        {/* Step 1: Purpose */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Mục đích buổi hẹn của bạn:</Text>
          <View style={styles.pillsRow}>
            {PURPOSES.map(p => {
              const active = purpose === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setPurpose(p)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Guest count */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Số lượng người đi cùng:</Text>
          <View style={styles.pillsRow}>
            {[1, 2, 4, 6, 8].map(num => {
              const active = guestCount === num;
              return (
                <TouchableOpacity
                  key={num}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setGuestCount(num)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {num} người
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* AI Action Button */}
        <AnimatedScaleButton
          style={styles.askAiBtn}
          onPress={handleAskAI}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text style={styles.askAiBtnText}>Nhờ AI Phân Tích & Gợi Ý Ngay</Text>
            </>
          )}
        </AnimatedScaleButton>

        {/* AI Result Presentation */}
        {recommendation && (
          <FadeInView style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.aiRobotAvatar}>
                <Ionicons name="hardware-chip" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiName}>Pam AI Advisor</Text>
                <Text style={styles.scoreText}>
                  Độ phù hợp: <Text style={{ color: colors.success, fontWeight: '800' }}>{recommendation.suitabilityScore}%</Text>
                </Text>
              </View>
            </View>

            <Text style={styles.aiMessageText}>{recommendation.aiMessage}</Text>

            {/* Table Box */}
            <View style={styles.recommendItemBox}>
              <Text style={styles.itemBoxLabel}>VỊ TRÍ BÀN ĐỀ XUẤT:</Text>
              <Text style={styles.recommendTableName}>
                🪑 {recommendation.recommendedTable?.name} ({recommendation.recommendedTable?.type})
              </Text>
              <Text style={styles.tableFeaturesText}>
                {recommendation.recommendedTable?.hasSocket ? '⚡ Có ổ cắm sạc laptop • ' : ''}
                {recommendation.recommendedTable?.isNearWindow ? '🪟 Góc cửa sổ đẹp • ' : ''}
                {recommendation.recommendedTable?.seats} ghế
              </Text>
            </View>

            {/* Drinks Box */}
            <View style={styles.recommendItemBox}>
              <Text style={styles.itemBoxLabel}>COMBO NƯỚC UỐNG HỢP VỊ:</Text>
              {recommendation.recommendedDrinks?.map(drink => (
                <View key={drink.id} style={styles.drinkRow}>
                  <Text style={styles.drinkName}>• {drink.name}</Text>
                  <Text style={styles.drinkPrice}>{formatCurrency(drink.price)}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyAIBooking}>
              <Text style={styles.applyBtnText}>Đặt Bàn Này Theo Gợi Ý AI</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </FadeInView>
        )}
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
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aiIconBox: {
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
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
  content: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
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
  askAiBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 50,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  askAiBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiRobotAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  scoreText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  aiMessageText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
  },
  recommendItemBox: {
    backgroundColor: colors.borderLight,
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  itemBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  recommendTableName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  tableFeaturesText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '600',
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
  drinkPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  applyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    marginTop: 4,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});

