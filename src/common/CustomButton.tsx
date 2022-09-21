import React, { FC } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface CustomButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean
  mode?: 'contained' | 'outlined' | 'text';
  onPress?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  color?: keyof ReactNativePaper.ThemeColors
  labelStyle?: StyleProp<TextStyle>;
}

export const CustomButton: FC<CustomButtonProps> = (props) => {
  const { label, loading, color, labelStyle } = props;
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
