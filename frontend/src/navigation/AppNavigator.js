import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

// MVP Auth Views
import LoginView from '../views/auth/LoginView';
import RegisterView from '../views/auth/RegisterView';

// MVP Customer Views
import HomeView from '../views/customer/HomeView';
import BookingView from '../views/customer/BookingView';
import TablesView from '../views/customer/TablesView';
import MenuView from '../views/customer/MenuView';
import MyBookingsView from '../views/customer/MyBookingsView';
import ProfileView from '../views/customer/ProfileView';

// New Required Views (Screen count & Features)
import AICoffeeAssistantView from '../views/customer/AICoffeeAssistantView';
import DrinkDetailView from '../views/customer/DrinkDetailView';
import BookingDetailView from '../views/customer/BookingDetailView';
import NotificationsView from '../views/customer/NotificationsView';

// MVP Admin Views
import AdminDashboardView from '../views/admin/AdminDashboardView';
import AdminBookingsView from '../views/admin/AdminBookingsView';
import AdminTablesView from '../views/admin/AdminTablesView';
import AdminMenuView from '../views/admin/AdminMenuView';
import AdminUsersView from '../views/admin/AdminUsersView';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BookingTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'TablesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'AITab') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'MenuTab') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          } else if (route.name === 'MyBookingsTab') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size || 20} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeView}
        options={{ tabBarLabel: 'Trang Chủ' }}
      />
      <Tab.Screen
        name="BookingTab"
        component={BookingView}
        options={{ tabBarLabel: 'Đặt Bàn' }}
      />
      <Tab.Screen
        name="TablesTab"
        component={TablesView}
        options={{ tabBarLabel: 'Sơ Đồ Bàn' }}
      />
      <Tab.Screen
        name="AITab"
        component={AICoffeeAssistantView}
        options={{ tabBarLabel: 'Pam AI' }}
      />
      <Tab.Screen
        name="MenuTab"
        component={MenuView}
        options={{ tabBarLabel: 'Thực Đơn' }}
      />
      <Tab.Screen
        name="MyBookingsTab"
        component={MyBookingsView}
        options={{ tabBarLabel: 'Lịch Đặt' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileView}
        options={{ tabBarLabel: 'Tài Khoản' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800', fontSize: 17 },
          headerShadowVisible: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginView}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterView}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="CustomerTabs"
              component={CustomerTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AIAssistant"
              component={AICoffeeAssistantView}
              options={{ title: 'Pam AI Gợi Ý Đặt Bàn' }}
            />
            <Stack.Screen
              name="DrinkDetail"
              component={DrinkDetailView}
              options={{ title: 'Chi Tiết Đồ Uống' }}
            />
            <Stack.Screen
              name="BookingDetail"
              component={BookingDetailView}
              options={{ title: 'Chi Tiết Vé Đặt Bàn' }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsView}
              options={{ title: 'Thông Báo & Ưu Đãi' }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardView}
              options={{ title: 'Bảng Quản Trị' }}
            />
            <Stack.Screen
              name="AdminBookings"
              component={AdminBookingsView}
              options={{ title: 'Quản Lý Đặt Bàn' }}
            />
            <Stack.Screen
              name="AdminTables"
              component={AdminTablesView}
              options={{ title: 'Quản Lý Sơ Đồ Bàn' }}
            />
            <Stack.Screen
              name="AdminMenu"
              component={AdminMenuView}
              options={{ title: 'Quản Lý Thực Đơn' }}
            />
            <Stack.Screen
              name="AdminUsers"
              component={AdminUsersView}
              options={{ title: 'Quản Lý Tài Khoản' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
