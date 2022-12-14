import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { useTheme } from 'react-native-paper';
import { ClaimListScreen } from './ClaimListScreen';
import { ClaimNewScreen } from './ClaimNewScreen';
import { ClaimsProvider } from './ClaimsContext';
import { ClaimViewScreen } from './ClaimViewScreen';

export type ClaimNavigatorParamList = {
  ClaimList: undefined;
  ClaimDetail: { claimId: string };
  NewClaim: undefined;
};

const ClaimNavigatorStack =
  createNativeStackNavigator<ClaimNavigatorParamList>();

const ClaimNavigator: FC = () => {
  const theme = useTheme();
  return (
    <ClaimsProvider>
      <ClaimNavigatorStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text
          },
        }}
        initialRouteName='ClaimList'
      >
        <ClaimNavigatorStack.Screen
          name="ClaimList"
          component={ClaimListScreen}
          options={{
            headerTitle: 'Claims',
          }}
        />
        <ClaimNavigatorStack.Screen
          name="NewClaim"
          component={ClaimNewScreen}
          options={{
            headerTitle: 'Submit New Claim',
          }}
        />
        <ClaimNavigatorStack.Screen
          name="ClaimDetail"
          component={ClaimViewScreen}
          options={{
            headerTitle: 'Manage Claim',
          }}
        />
      </ClaimNavigatorStack.Navigator>
    </ClaimsProvider>
  );
};

export default ClaimNavigator;