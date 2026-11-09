import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '../../theme/designTokens';
import { AnimatedScaleButton } from '../../components/AnimatedScaleButton';
import { FadeInView } from '../../components/FadeInView';
import { BentoCard } from '../../components/BentoCard';
import { Badge } from '../../components/Badge';
import { AIModel } from '../../models/AIModel';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/slices/menuSlice';
import { AICoffeeRecommendation } from '../../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendation?: AICoffeeRecommendation;
}

const QUICK_MOODS = [
  '⚡ Cần tỉnh táo tập trung cao độ',
  '🍃 Thư giãn nhẹ nhàng, ít ngọt',
  '☕ Tìm cà phê đặc sản vị béo ngậy',
  '🍊 Thanh mát giải nhiệt mùa hè',
  '🍰 Thức uống kèm bánh ngọt hẹn hò',
];

export const AICoffeeAssistantView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ Lý Pam AI Sommelier. Hãy chia sẻ tâm trạng, sở thích vị giác hoặc nhu cầu lúc này của bạn để tôi gợi ý món phù hợp nhất nhé!',
    },
  ]);

  const handleSend = async (userPrompt: string) => {
    const prompt = userPrompt || inputText;
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const rec = await AIModel.getRecommendation(prompt);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: rec.moodAnalysis,
        recommendation: rec,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Rất tiếc, Pam AI tạm thời chưa thể kết nối. Bạn hãy thử chọn lại từ các gợi ý tâm trạng bên dưới nhé!',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handlePickDrink = (drinkName: string, price: number) => {
    dispatch(
      addToCart({
        menuItemId: Date.now(),
        name: drinkName,
        price,
        quantity: 1,
      })
    );
    navigation.navigate('Booking');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.sparkleWrap}>
            <Ionicons name="sparkles" size={20} color={colors.primaryDark} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Pam AI Coffee Sommelier</Text>
            <Text style={styles.headerSub}>Tư vấn thức uống thông minh theo cảm xúc</Text>
          </View>
        </View>
        <Badge label="AI BASIC" variant="amber" />
      </View>

      {/* Messages Feed */}
      <ScrollView
        contentContainerStyle={styles.messagesScroll}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <FadeInView
            key={msg.id}
            style={[styles.msgWrapper, msg.sender === 'user' ? styles.msgUser : styles.msgAI]}
          >
            {msg.sender === 'ai' ? (
              <View style={styles.aiBubbleContainer}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={14} color={colors.textInverse} />
                </View>
                <View style={styles.aiBubble}>
                  <Text style={styles.aiBubbleText}>{msg.text}</Text>

                  {/* Recommendation Card */}
                  {msg.recommendation && (
                    <View style={styles.recContainer}>
                      <Text style={styles.recHeading}>GỢI Ý TỪ BARISTA CHO BẠN:</Text>
                      {msg.recommendation.recommendedDrinks.map((drink, i) => (
                        <BentoCard key={i} variant="elevated" padding="md" style={styles.recDrinkCard}>
                          <View style={styles.recDrinkHeader}>
                            <Text style={styles.recDrinkName}>{drink.name}</Text>
                            <Text style={styles.recDrinkPrice}>
                              {drink.price.toLocaleString('vi-VN')} đ
                            </Text>
                          </View>
                          <Text style={styles.recDrinkReason}>{drink.reason}</Text>

                          <View style={styles.flavorRow}>
                            {drink.flavorNotes.map((note, idx) => (
                              <View key={idx} style={styles.flavorBadge}>
                                <Text style={styles.flavorText}>{note}</Text>
                              </View>
                            ))}
                            <View style={styles.sweetnessBadge}>
                              <Text style={styles.sweetnessText}>{drink.suggestedSweetness}</Text>
                            </View>
                          </View>

                          <AnimatedScaleButton
                            onPress={() => handlePickDrink(drink.name, drink.price)}
                            style={styles.pickDrinkBtn}
                          >
                            <Ionicons name="add-circle-outline" size={16} color={colors.textInverse} />
                            <Text style={styles.pickDrinkBtnText}>Đặt Bàn Chọn Món Này</Text>
                          </AnimatedScaleButton>
                        </BentoCard>
                      ))}

                      {msg.recommendation.baristaTip ? (
                        <View style={styles.tipBox}>
                          <Ionicons name="bulb-outline" size={16} color={colors.primaryDark} />
                          <Text style={styles.tipText}>
                            <Text style={{ fontWeight: '700' }}>Lời khuyên Barista: </Text>
                            {msg.recommendation.baristaTip}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{msg.text}</Text>
              </View>
            )}
          </FadeInView>
        ))}

        {loading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Pam AI đang cảm thụ và pha chế gợi ý...</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Mood Chips */}
      <View style={styles.quickMoodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodScroll}>
          {QUICK_MOODS.map((mood, idx) => (
            <AnimatedScaleButton
              key={idx}
              onPress={() => handleSend(mood)}
              style={styles.moodChip}
              disabled={loading}
            >
              <Text style={styles.moodChipText}>{mood}</Text>
            </AnimatedScaleButton>
          ))}
        </ScrollView>
      </View>

      {/* Input Box */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nói với Pam AI tâm trạng hoặc món bạn muốn..."
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={() => handleSend(inputText)}
        />
        <AnimatedScaleButton
          onPress={() => handleSend(inputText)}
          style={styles.sendBtn}
          disabled={loading || !inputText.trim()}
        >
          <Ionicons name="send" size={18} color={colors.textInverse} />
        </AnimatedScaleButton>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sparkleWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '800',
  },
  headerSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  messagesScroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  msgWrapper: {
    marginBottom: spacing.md,
  },
  msgAI: {
    alignItems: 'flex-start',
  },
  msgUser: {
    alignItems: 'flex-end',
  },
  aiBubbleContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    maxWidth: '92%',
  },
  aiAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  aiBubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.soft,
  },
  aiBubbleText: {
    ...typography.body,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  userBubble: {
    backgroundColor: colors.espresso,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '80%',
  },
  userBubbleText: {
    ...typography.body,
    color: colors.textInverse,
  },
  recContainer: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  recHeading: {
    ...typography.overline,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  recDrinkCard: {
    marginVertical: spacing.xs,
    borderRadius: radius.md,
  },
  recDrinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recDrinkName: {
    ...typography.bodyLarge,
    fontWeight: '800',
    color: colors.espresso,
    flex: 1,
  },
  recDrinkPrice: {
    ...typography.bodyLarge,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  recDrinkReason: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  flavorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginVertical: spacing.xs,
  },
  flavorBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  flavorText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sweetnessBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  sweetnessText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  pickDrinkBtn: {
    backgroundColor: colors.primary,
    height: 38,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  pickDrinkBtnText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.primarySubtle,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  tipText: {
    ...typography.caption,
    color: colors.espresso,
    flex: 1,
    lineHeight: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  quickMoodContainer: {
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  moodScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  moodChip: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  moodChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
});

export default AICoffeeAssistantView;
