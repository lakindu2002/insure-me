import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as ThemeProvider } from 'react-native-paper';
import { AuthProvider } from '@insureme/auth/AuthContext';
import { ToastProvider } from 'react-native-toast-notifications';
import RootNavigator from '@insureme/common/RootNavigator';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

const customTheme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
  },
};

const App: FC = () => {
  return (
    <ActionSheetProvider>
      <AuthProvider>
        <ThemeProvider
          theme={customTheme}
        >
          <ToastProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider >
    </ActionSheetProvider>
  );
};

export default connectActionSheet(App);
