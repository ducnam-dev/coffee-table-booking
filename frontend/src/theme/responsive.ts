import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  isSmallPhone: boolean;
  columns: number;
  horizontalPadding: number;
}

export function useResponsive(): ResponsiveInfo {
  const [dim, setDim] = useState<ScaledSize>(() => Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDim(window);
    });
    return () => sub.remove();
  }, []);

  const isLandscape = dim.width > dim.height;
  const isTablet = Math.min(dim.width, dim.height) >= 600;
  const isSmallPhone = dim.width < 360;

  let columns = 1;
  if (isTablet) {
    columns = isLandscape ? 4 : 3;
  } else if (isLandscape) {
    columns = 2;
  }

  const horizontalPadding = isTablet ? 32 : isLandscape ? 24 : 16;

  return {
    width: dim.width,
    height: dim.height,
    isLandscape,
    isTablet,
    isSmallPhone,
    columns,
    horizontalPadding,
  };
}

export default useResponsive;
