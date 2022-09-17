import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { CustomerVehiclesScreen } from './CustomerVehiclesScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCarAlt } from '@fortawesome/free-solid-svg-icons/faCarAlt'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt'
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt'
import ProfileNavigator from '@insureme/profile/ProfileNavigator';

export type CustomerBottomTabNavigationParamList = {
  Vehicles: undefined;
  Claims: undefined;
  Profile: undefined;
}

const CustomerBottomTabNavigation = createBottomTabNavigator<CustomerBottomTabNavigationParamList>();

const CustomerBottomTabNavigator: FC = () => {
  return (
    <CustomerBottomTabNavigation.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          if (route.name === 'Vehicles') {
            return (
              <FontAwesomeIcon
                color={color}
                icon={faCarAlt}
              />
            )
          }
          if (route.name === 'Claims') {
            return (
              <FontAwesomeIcon
                color={color}
                icon={faFileAlt}
              />
            )
          }
          if (route.name === 'Profile') {
            return (
              <FontAwesomeIcon
                color={color}
                icon={faUserAlt}
              />
            )
          }
        },
      })}
    >
      <CustomerBottomTabNavigation.Screen
        name="Vehicles"
        component={CustomerVehiclesScreen}
        options={{
          headerTitle: 'My Vehicles',
        }}
      />
      <CustomerBottomTabNavigation.Screen
        name="Claims"
        component={CustomerVehiclesScreen}
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
