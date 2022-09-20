import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ClaimListScreen } from '@insureme/claims/ClaimListScreen';
import ProfileNavigator from '@insureme/profile/ProfileNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';

type ClaimAdjusterBottomTabNavigationParamList = {
  AllClaims: undefined;
  AssignedClaims: undefined;
  Profile: undefined;
};

const ClaimAdjusterBottomTabsNavigation = createBottomTabNavigator<ClaimAdjusterBottomTabNavigationParamList>();

const ClaimAdjusterBottomTabsNavigator: FC = () => {
  const theme = useTheme();
  return (
    <ClaimAdjusterBottomTabsNavigation.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'AllClaims') {
            return (
              <>
              </>
            )
          }
          if (route.name === 'AssignedClaims') {
            return (
              <>
              </>
            )
          }
          if (route.name === 'Profile') {
            return (
              <FontAwesomeIcon
                color={focused ? theme.colors.primary : color}
                icon={faUserAlt}
              />
            )
          }
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: {
          backgroundColor: theme.colors.background
        },
        headerStyle: {
          backgroundColor: theme.colors.background
        },
        headerTitleStyle: {
          color: theme.colors.text
        }
      })}
    >
      <ClaimAdjusterBottomTabsNavigation.Screen
        name="AllClaims"
        component={ClaimListScreen}
      />
      <ClaimAdjusterBottomTabsNavigation.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </ClaimAdjusterBottomTabsNavigation.Navigator>
  );
};

export default ClaimAdjusterBottomTabsNavigator;
