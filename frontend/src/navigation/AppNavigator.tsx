import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography, shadows, spacing } from '../theme/designTokens';

// Auth Views
import { LoginView } from '../views/auth/LoginView';
import { RegisterView } from '../views/auth/RegisterView';

// Customer Views
import { HomeView } from '../views/customer/HomeView';
import { MenuView } from '../views/customer/MenuView';
import { DrinkDetailView } from '../views/customer/DrinkDetailView';
import { TablesView } from '../views/customer/TablesView';
import { BookingView } from '../views/customer/BookingView';
import { BookingDetailView } from '../views/customer/BookingDetailView';
import { MyBookingsView } from '../views/customer/MyBookingsView';
import { ProfileView } from '../views/customer/ProfileView';
import { NotificationsView } from '../views/customer/NotificationsView';
import { AICoffeeAssistantView } from '../views/customer/AICoffeeAssistantView';
import { FavoritesView } from '../views/customer/FavoritesView';

// Admin Views
import { AdminDashboardView } from '../views/admin/AdminDashboardView';
import { AdminBookingsView } from '../views/admin/AdminBookingsView';
import { AdminTablesView } from '../views/admin/AdminTablesView';
import { AdminMenuView } from '../views/admin/AdminMenuView';
import { AdminUsersView } from '../views/admin/AdminUsersView';
import { AdminUserTrackingView } from '../views/admin/AdminUserTrackingView';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 8);

  return (
    <Tab.Navigator
      id="customer-tabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 54 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
          ...shadows.soft,
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeView}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'cafe' : 'cafe-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuView}
        options={{
          tabBarLabel: 'Thực đơn',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AICoffeeAssistant"
        component={AICoffeeAssistantView}
        options={{
          tabBarLabel: 'Pam AI',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.aiIconFocused : undefined}>
              <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={size} color={focused ? colors.primary : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingView}
        options={{
          tabBarLabel: 'Đặt bàn',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileView}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator id="root-stack" screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="Login" component={LoginView} />
        <Stack.Screen name="Register" component={RegisterView} />

        {/* Customer Main Flow */}
        <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
        <Stack.Screen name="DrinkDetail" component={DrinkDetailView} />
        <Stack.Screen name="Tables" component={TablesView} />
        <Stack.Screen name="BookingDetail" component={BookingDetailView} />
        <Stack.Screen name="MyBookings" component={MyBookingsView} />
        <Stack.Screen name="Notifications" component={NotificationsView} />
        <Stack.Screen name="Favorites" component={FavoritesView} />

        {/* Admin Flow */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardView} />
        <Stack.Screen name="AdminBookings" component={AdminBookingsView} />
        <Stack.Screen name="AdminTables" component={AdminTablesView} />
        <Stack.Screen name="AdminMenu" component={AdminMenuView} />
        <Stack.Screen name="AdminUsers" component={AdminUsersView} />
        <Stack.Screen name="AdminUserTracking" component={AdminUserTrackingView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    ...shadows.soft,
  },
  tabBarLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  aiIconFocused: {
    backgroundColor: colors.primarySubtle,
    borderRadius: 16,
    padding: 2,
  },
});

export default AppNavigator;
