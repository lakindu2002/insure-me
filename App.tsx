import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, Provider as ThemeProvider } from 'react-native-paper';
import { AuthConsumer, AuthProvider } from '@insureme/auth/AuthContext';
import { ToastProvider } from 'react-native-toast-notifications';
import RootNavigator from '@insureme/common/RootNavigator';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

const baseTheme = {
  roundness: 8,
};

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
  ...baseTheme,
}

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
  },
  ...baseTheme,
}

const App: FC = () => {
  return (
    <ActionSheetProvider>
      <AuthProvider>
        <AuthConsumer>
          {({ user }) => (
            <ThemeProvider
              theme={user?.preferredMode === 'dark' ? darkTheme : lightTheme}
            >
              <ToastProvider>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </ToastProvider>
            </ThemeProvider>
          )}

        </AuthConsumer>
      </AuthProvider >
    </ActionSheetProvider>
  );
};

export default connectActionSheet(App);
