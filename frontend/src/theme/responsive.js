import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isTablet = width >= 768;

  // Grid columns based on screen size & orientation
  const numColumns = isTablet ? (isLandscape ? 4 : 3) : (isLandscape ? 2 : 1);
  const cardWidth = width / numColumns - (numColumns > 1 ? 24 : 0);

  return {
    width,
    height,
    isLandscape,
    isTablet,
    numColumns,
    cardWidth,
  };
}

