import { ClaimListScreen } from '@insureme/claims/ClaimListScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';

type ClaimAdjusterBottomTabNavigationParamList = {
  AllClaims: undefined;
  AssignedClaims: undefined;
  Profile: undefined;
};

const ClaimAdjusterBottomTabsNavigation =
  createBottomTabNavigator<ClaimAdjusterBottomTabNavigationParamList>();

const ClaimAdjusterBottomTabsNavigator: FC = () => {
  return (
    <ClaimAdjusterBottomTabsNavigation.Navigator>
      <ClaimAdjusterBottomTabsNavigation.Screen
        name="AllClaims"
        component={ClaimListScreen}
      />
    </ClaimAdjusterBottomTabsNavigation.Navigator>
  );
};

export default ClaimAdjusterBottomTabsNavigator;
