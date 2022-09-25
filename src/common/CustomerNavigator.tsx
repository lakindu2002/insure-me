import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCarAlt } from '@fortawesome/free-solid-svg-icons/faCarAlt'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt'
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt'
import ProfileNavigator from '@insureme/profile/ProfileNavigator';
import { useTheme } from 'react-native-paper';
import VehiclesNavigator from '@insureme/vehicles/VehiclesNavigator';
import ClaimNavigator from '@insureme/claims/ClaimNavigator';

export type CustomerBottomTabNavigationParamList = {
  Vehicles: undefined;
  Claims: undefined;
  Profile: undefined;
}

const CustomerBottomTabNavigation = createBottomTabNavigator<CustomerBottomTabNavigationParamList>();

const CustomerBottomTabNavigator: FC = () => {
  const theme = useTheme();
  return (
    <CustomerBottomTabNavigation.Navigator
      screenOptions={({ route }) => ({
        headerTintColor: theme.colors.text,
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'Vehicles') {
            return (
              <FontAwesomeIcon
                color={focused ? theme.colors.primary : color}
                icon={faCarAlt}
              />
            )
          }
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
      <CustomerBottomTabNavigation.Screen
        name="Vehicles"
        component={VehiclesNavigator}
        options={{
          headerTitle: 'My Vehicles',
        }}
      />
      <CustomerBottomTabNavigation.Screen
        name="Claims"
        component={ClaimNavigator}
        options={{
          headerTitle: 'My Claims',
        }}
      />
      <CustomerBottomTabNavigation.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </CustomerBottomTabNavigation.Navigator>
  );
};

export default CustomerBottomTabNavigator;
