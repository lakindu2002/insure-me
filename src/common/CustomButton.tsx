import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

interface CustomButtonProps extends Text {
  label: string;
  loading?: boolean;
  disabled?: boolean
  mode?: 'contained' | 'outlined' | 'text';
  onPress?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export const CustomButton: FC<CustomButtonProps> = (props) => {
  const { label, loading } = props;
  return (
    <Button {...props}
      disabled={loading || props.disabled}
      contentStyle={{ flexDirection: 'row-reverse' }}>
      {label}
    </Button>
  );
};
