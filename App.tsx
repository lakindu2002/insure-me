import React, { FC, Fragment } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as ThemeProvider } from 'react-native-paper';
import { AuthConsumer, AuthProvider } from '@insureme/auth/AuthContext';
import { SplashScreen } from '@insureme/common/SplashScreen';
import LoginScreen from '@insureme/auth/LoginScreen';
import { ToastProvider } from 'react-native-toast-notifications';
import SignUpScreen from '@insureme/auth/SignUpScreen';

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
            <SafeAreaView>
              <AuthConsumer>
                {({ initializing, user }) => (
                  initializing ? <SplashScreen /> : (
                    <Fragment>
                      {user ? (
                        <>
                        </>
                      ) : (
                        <LoginScreen />
                      )}
                    </Fragment>
                  )
                )}
              </AuthConsumer>
            </SafeAreaView>
          </NavigationContainer>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
