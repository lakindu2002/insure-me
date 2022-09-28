import React, { FC, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, Provider as ThemeProvider } from 'react-native-paper';
import { AuthConsumer, AuthProvider } from '@insureme/auth/AuthContext';
import { ToastProvider } from 'react-native-toast-notifications';
import RootNavigator from '@insureme/common/RootNavigator';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import storage from '@react-native-firebase/firestore';
import { NetworkProvider } from 'react-native-offline';
import PermissionManager from '@insureme/common/PermissionManager';
import { NetworkWrapper } from '@insureme/common/NetworkWrapper';

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
      await storage().settings({ persistence: true, ignoreUndefinedProperties: true });
    }
    enablePersistence();
  }, []);

  return children;
}

const App: FC = () => {
  const [permissionsInitialized, setPermissionsInitialized] = useState<boolean>(false);
  useEffect(() => {
    // check if user has permissions to access media and camera, if not, request them
    const evaluatePermissions = async () => {
      await PermissionManager.requestAppPermissions();
      setPermissionsInitialized(true);
    }
    evaluatePermissions();
  }, []);
  return (
    <NetworkProvider>
      <FirestoreWrapper>
        <ToastProvider>
          <NetworkWrapper>
            <ActionSheetProvider>
              <AuthProvider>
                <AuthConsumer>
                  {({ user }) => (
                    <ThemeProvider
                      theme={user?.preferredMode === 'dark' ? darkTheme : lightTheme}
                    >
                      {permissionsInitialized && (
                        <NavigationContainer>
                          <RootNavigator />
                        </NavigationContainer>
                      )}
                    </ThemeProvider>
                  )}

                </AuthConsumer>
              </AuthProvider >
            </ActionSheetProvider>
          </NetworkWrapper>
        </ToastProvider>
      </FirestoreWrapper>
    </NetworkProvider >
  );
};

export default connectActionSheet(App);
