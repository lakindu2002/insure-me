import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface CustomButtonProps extends Text {
  label: string;
  loading?: boolean;
  disabled?: boolean
  mode?: 'contained' | 'outlined' | 'text';
  onPress?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  color?: keyof ReactNativePaper.ThemeColors
}

export const CustomButton: FC<CustomButtonProps> = (props) => {
  const { label, loading, color } = props;
  const theme = useTheme();
  return (
    <Button {...props}
      disabled={loading || props.disabled}
      color={theme.colors[color || 'primary']}
      contentStyle={{ flexDirection: 'row-reverse' }}>
      {label}
    </Button>
  );
};
