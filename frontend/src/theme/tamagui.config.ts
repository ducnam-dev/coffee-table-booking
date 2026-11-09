import { createTamagui } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v5';

export const tamaguiConfig = createTamagui(defaultConfig);

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
