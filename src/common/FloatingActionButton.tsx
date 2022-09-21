import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';

type Icon = 'plus';

interface FloatingActionButtonProps {
  icon?: Icon
  onPress: () => void;
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export const FloatingActionButton: FC<FloatingActionButtonProps> = React.memo((props) => {
  const { icon, onPress } = props;
  const theme = useTheme();
  return (
    <FAB
      style={{ ...styles.fab, backgroundColor: theme.colors.primary }}
      small
      icon={icon as Icon}
      onPress={onPress}
    />
  );
});

FloatingActionButton.defaultProps = {
  icon: 'plus'
}
