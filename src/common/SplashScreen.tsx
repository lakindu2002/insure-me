import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
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
  useEffect(() => {
    if (initializing) {
      return;
    }
    if (!user) {
      navigation.replace('Login');
      return;
    }
    if (user && user.role === UserRole.CUSTOMER) {
      navigation.replace('Customer');
      return;
    }
  }, [user, initializing]);

  return (
    <View style={[globalStyles.container, stylesheet.wrapperCenter]}>
      <AppLogo size={150} />
      <View style={stylesheet.marginTop}>
        <ActivityIndicator
          animating
          size='large'
        />
      </View>
    </View>
  );
};
