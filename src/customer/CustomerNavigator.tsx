import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { CustomerVehiclesScreen } from './CustomerVehicles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCarAlt } from '@fortawesome/free-solid-svg-icons/faCarAlt'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt'


type CustomerBottomTabNavigationParamList = {
  Vehicles: undefined;
  Claims: undefined;
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
                icon={faCarAlt} />
            )
          }
          if (route.name === 'Claims') {
            return (
              <FontAwesomeIcon
                color={color}
                icon={faFileAlt} />
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
    </CustomerBottomTabNavigation.Navigator>
  );
};

export default CustomerBottomTabNavigator;
