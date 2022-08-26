import { ApplicationProvider, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import React, { FC } from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
// eslint-disable-next-line import/no-named-default
import { default as theme } from './theme.json';

const App: FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorScheme = isDarkMode ? eva.dark : eva.light;
  return (
    <ApplicationProvider
      {...eva}
      theme={{ ...colorScheme, ...theme }}
    >
      <SafeAreaView>
        <Button
          status="primary"
        >
          Custom
        </Button>
      </SafeAreaView>
    </ApplicationProvider>
  );
};

export default App;
