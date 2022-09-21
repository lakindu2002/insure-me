import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { AppLogo } from './AppLogo';
import { globalStyles } from './GlobalStyles';
import PermissionManager from './PermissionManager';
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
  const [permissionsInitialized, setPermissionsInitialized] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    // check if user has permissions to access media and camera, if not, request them
    const evaluatePermissions = async () => {
      await PermissionManager.requestAppPermissions();
      setPermissionsInitialized(true);
    }
    evaluatePermissions();
  }, []);

  useEffect(() => {
    if (initializing || !permissionsInitialized) {
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
    if (user && user.role === UserRole.CLAIM_ADJUSTER) {
      navigation.replace('ClaimAdjuster');
      return;
    }
  }, [user, initializing, permissionsInitialized]);

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
