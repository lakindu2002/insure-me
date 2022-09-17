import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as ThemeProvider } from 'react-native-paper';
import { AuthProvider } from '@insureme/auth/AuthContext';
import { ToastProvider } from 'react-native-toast-notifications';
import RootNavigator from '@insureme/common/RootNavigator';

const customTheme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
  },
};

const App: FC = () => {
  return (
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
  );
};

export default App;
