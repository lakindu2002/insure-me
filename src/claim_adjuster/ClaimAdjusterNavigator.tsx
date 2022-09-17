import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { ClaimAdjusterAllClaimsScreen } from './ClaimAdjusterAllClaimsScreen';

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
        component={ClaimAdjusterAllClaimsScreen}
      />
    </ClaimAdjusterBottomTabsNavigation.Navigator>
  );
};

export default ClaimAdjusterBottomTabsNavigator;
