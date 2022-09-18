import { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Avatar } from 'react-native-paper';
import Logo from '../../assets/logo.svg';
interface AppLogoProps {
  width?: number;
  height?: number;
}

export const AppLogo: FC<AppLogoProps> = ({ width = 150, height = 150 }) => {
  return (
    <Logo
      width={width}
      height={height}
    />
  );
};
