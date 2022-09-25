import { faFileAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ClaimNavigator from '@insureme/claims/ClaimNavigator';
import ProfileNavigator from '@insureme/profile/ProfileNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react';
import { useTheme } from 'react-native-paper';

type ClaimAdjusterBottomTabNavigationParamList = {
  Claims: undefined;
  Profile: undefined;
};

const ClaimAdjusterBottomTabsNavigation = createBottomTabNavigator<ClaimAdjusterBottomTabNavigationParamList>();

const ClaimAdjusterBottomTabsNavigator: FC = () => {
  const theme = useTheme();
  return (
    <ClaimAdjusterBottomTabsNavigation.Navigator
      screenOptions={({ route }) => ({
        headerTintColor: theme.colors.text,
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Claims') {
            return (
              <FontAwesomeIcon
                color={focused ? theme.colors.primary : color}
                icon={faFileAlt}
              />
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
        name="Claims"
        component={ClaimNavigator}
      />
      <ClaimAdjusterBottomTabsNavigation.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </ClaimAdjusterBottomTabsNavigation.Navigator>
  );
};

export default ClaimAdjusterBottomTabsNavigator;
