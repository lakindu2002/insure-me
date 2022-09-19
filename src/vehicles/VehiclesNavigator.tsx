import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { useTheme } from 'react-native-paper';
import { VehicleNewScreen } from './VehicleNewScreen';
import { VehiclesScreen } from './VehiclesScreen';

export type VehiclesNavigatorParamList = {
  VehicleList: undefined;
  NewVehicle: undefined;
};

const VehiclesStackNavigator = createNativeStackNavigator<VehiclesNavigatorParamList>();

const VehiclesNavigator: FC = () => {
  const theme = useTheme();
  return (
    <VehiclesStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background
        },
        headerTitleStyle: {
          color: theme.colors.text
        }
      }}
      initialRouteName='VehicleList'
    >
      <VehiclesStackNavigator.Screen name='VehicleList'
        options={{
          headerTitle: 'My Vehicles'
        }}
        component={VehiclesScreen}
      />
      <VehiclesStackNavigator.Screen name='NewVehicle'
        options={{
          headerTitle: 'Add New Vehicle'
        }}
        component={VehicleNewScreen} />
    </VehiclesStackNavigator.Navigator>
  )
}

export default VehiclesNavigator;