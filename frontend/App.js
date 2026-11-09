import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { TamaguiProvider } from 'tamagui';

import store from './src/store';
import tamaguiConfig from './src/theme/tamagui.config';
import { AuthProvider } from './src/context/AuthContext';
import { CoffeeProvider } from './src/context/CoffeeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <SafeAreaProvider>
          <AuthProvider>
            <CoffeeProvider>
              <StatusBar style="dark" />
              <AppNavigator />
            </CoffeeProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ReduxProvider>
  );
}
