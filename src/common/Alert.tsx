import React, { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface AlertProps {
  title: string;
  message: string;
  variant: 'error' | 'warning' | 'info';
}

export const Alert: FC<AlertProps> = (props) => {
  const { title, message, variant } = props;
  const theme = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: 5,
      padding: 10,
    },
    error: {
      backgroundColor: theme.colors.error,
    },
    info: {
      backgroundColor: '#2196f3',
    },
    warning: {
      backgroundColor: '#ff9800',
    }
  }), []);

  return (
    <View>
      <View style={[styles.container, styles[variant]]}>
        <Text style={{ color: theme.colors.text, fontSize: 20 }}>{title}</Text>
        <Text style={{ color: theme.colors.text, fontSize: 16 }}>{message}</Text>
      </View>
    </View>
  );
};
