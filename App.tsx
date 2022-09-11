import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as ThemeProvider } from 'react-native-paper';
import LoginScreen from '@insureme/auth/LoginScreen';

const customTheme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
  },
};

const App: FC = () => {
  return (
    <ThemeProvider
      theme={customTheme}
    >
      <NavigationContainer>
        <SafeAreaView>
          <LoginScreen />
        </SafeAreaView>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
