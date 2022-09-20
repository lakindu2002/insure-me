import { FC } from 'react';
import { ActivityIndicator, useTheme } from 'react-native-paper';

interface LoaderProps { }

export const Loader: FC<LoaderProps> = props => {
  const theme = useTheme();
  return (
    <ActivityIndicator
      animating
      size={'large'}
      color={theme.colors.primary}
    />
  );
};
