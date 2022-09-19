import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { useTheme } from 'react-native-paper';
import { ClaimListScreen } from './ClaimListScreen';

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
    <ClaimNavigatorStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background
        },
        headerTitleStyle: {
          color: theme.colors.text
        }
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
    </ClaimNavigatorStack.Navigator>
  );
};

export default ClaimNavigator;