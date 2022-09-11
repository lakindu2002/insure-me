import { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Avatar } from 'react-native-paper';

interface AppLogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const AppLogo: FC<AppLogoProps> = ({ size, style }) => {
  return (
    <Avatar.Image
      source={require('../../assets/logo.png')}
      {...size && {
        size
      }}
      {...style && {
        style
      }}
    />
  );
};
