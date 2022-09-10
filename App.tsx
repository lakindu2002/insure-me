import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import React, { FC } from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-named-default
import { default as theme } from './theme.json';
import { LoginScreen } from '@insureme/auth/LoginScreen';

const App: FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorScheme = isDarkMode ? eva.dark : eva.light;
  return (
    <NavigationContainer>
      <ApplicationProvider
        {...eva}
        theme={{ ...colorScheme, ...theme }}
      >
        <SafeAreaView>
          <LoginScreen />
        </SafeAreaView>
      </ApplicationProvider>
    </NavigationContainer>
  );
};

export default App;
