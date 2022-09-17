import LoginScreen from '@insureme/auth/LoginScreen';
import SignUpScreen from '@insureme/auth/SignUpScreen';
import { CustomerDashboardScreen } from '@insureme/customer/CustomerDashboardScreen';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC } from 'react';
import { SplashScreen } from './SplashScreen';


export type RootStackNavigatorParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  CustomerDashboard: undefined;
}

const RootStackNavigator = createNativeStackNavigator<RootStackNavigatorParamList>();

const RootNavigator: FC = () => {
  return (
    <RootStackNavigator.Navigator initialRouteName="Splash">
      <RootStackNavigator.Group
        screenOptions={{
          headerShown: false,
        }}>
        <RootStackNavigator.Screen name="Splash" component={SplashScreen} />
      </RootStackNavigator.Group>
      <RootStackNavigator.Group
        screenOptions={{
          headerShown: false,
        }}>
        <RootStackNavigator.Screen name="Login" component={LoginScreen} />
        <RootStackNavigator.Screen name="SignUp" component={SignUpScreen} />
      </RootStackNavigator.Group>
      <RootStackNavigator.Group>
        <RootStackNavigator.Screen
          name="CustomerDashboard"
          component={CustomerDashboardScreen}
        />
      </RootStackNavigator.Group>
    </RootStackNavigator.Navigator>
  );
};

export default RootNavigator;
