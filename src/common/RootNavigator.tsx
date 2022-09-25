import LoginScreen from '@insureme/auth/LoginScreen';
import SignUpScreen from '@insureme/auth/SignUpScreen';
import ClaimAdjusterBottomTabsNavigator from '@insureme/common/ClaimAdjusterNavigator';
import CustomerBottomTabNavigator from '@insureme/common/CustomerNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { useTheme } from 'react-native-paper';
import { SplashScreen } from './SplashScreen';


export type RootStackNavigatorParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Customer: undefined;
  ClaimAdjuster: undefined;
}

const RootStackNavigator = createNativeStackNavigator<RootStackNavigatorParamList>();

const RootNavigator: FC = () => {
  const theme = useTheme();
  return (
    <RootStackNavigator.Navigator initialRouteName="Splash"
      screenOptions={{
        headerTintColor: theme.colors.text,
        headerShown: false,
      }}
    >
      <RootStackNavigator.Group>
        <RootStackNavigator.Screen name="Splash" component={SplashScreen} />
      </RootStackNavigator.Group>
      <RootStackNavigator.Group>
        <RootStackNavigator.Screen name="Login" component={LoginScreen} />
        <RootStackNavigator.Screen name="SignUp" component={SignUpScreen} />
      </RootStackNavigator.Group>
      <RootStackNavigator.Group>
        <RootStackNavigator.Screen name="Customer" component={CustomerBottomTabNavigator} />
        <RootStackNavigator.Screen name="ClaimAdjuster" component={ClaimAdjusterBottomTabsNavigator} />
      </RootStackNavigator.Group>
    </RootStackNavigator.Navigator>
  );
};

export default RootNavigator;
