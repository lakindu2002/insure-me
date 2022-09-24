import React, { FC, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, Provider as ThemeProvider } from 'react-native-paper';
import { AuthConsumer, AuthProvider } from '@insureme/auth/AuthContext';
import { ToastProvider } from 'react-native-toast-notifications';
import RootNavigator from '@insureme/common/RootNavigator';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import storage from '@react-native-firebase/firestore';
import { NetworkProvider } from 'react-native-offline';



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

const FirestoreWrapper: FC<{ children: JSX.Element }> = ({ children }) => {
  useEffect(() => {
    const enablePersistence = async () => {
      await storage().settings({ persistence: true });
    }
    enablePersistence();
  }, []);

  return children;
}

const App: FC = () => {
  return (
    <NetworkProvider>
      <FirestoreWrapper>
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
      </FirestoreWrapper>
    </NetworkProvider>
  );
};

export default connectActionSheet(App);
