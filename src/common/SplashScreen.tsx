import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/UserType';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { AppLogo } from './AppLogo';
import { globalStyles } from './GlobalStyles';
import { RootStackNavigatorParamList } from './RootNavigator';


type SplashScreenNavigatorProps = NativeStackScreenProps<RootStackNavigatorParamList, 'Splash'>;
interface SplashScreenProps extends SplashScreenNavigatorProps { }

const stylesheet = StyleSheet.create({
  wrapperCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginTop: {
    marginTop: 20,
  }
});


export const SplashScreen: FC<SplashScreenProps> = (props) => {
  const { navigation } = props;
  const { user, initializing } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const navigateToHome = () => {
      if (!user || !user.role) {
        // when context initializes, it initializes with entire user or user with just a color theme (so to handle that case, navigate to login as no actual user present, its just a color theme config)
        navigation.replace('Login');
      } else if (user && user.role === UserRole.CUSTOMER) {
        navigation.replace('Customer');
      } else if (user && user.role === UserRole.CLAIM_ADJUSTER) {
        navigation.replace('ClaimAdjuster');
      }
    }
    if (initializing) {
      return;
    }
    navigateToHome();
  }, [user, initializing]);
  return (
    <View style={[globalStyles.container, stylesheet.wrapperCenter, { backgroundColor: theme.colors.background }]}>
      <AppLogo width={150}
        height={150} />
      <View style={stylesheet.marginTop}>
        <ActivityIndicator
          animating
          size='large'
        />
      </View>
    </View>
  );
};
