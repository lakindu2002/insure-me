import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { useTheme } from 'react-native-paper';
import { VehiclesProvider } from './VehicleContext';
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
    <VehiclesProvider>
      <VehiclesStackNavigator.Navigator
        screenOptions={{
          headerTintColor: theme.colors.text,
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
            headerTitle: 'Vehicles'
          }}
          component={VehiclesScreen}
        />
        <VehiclesStackNavigator.Screen name='NewVehicle'
          options={{
            headerTitle: 'Add New Vehicle'
          }}
          component={VehicleNewScreen} />
      </VehiclesStackNavigator.Navigator>
    </VehiclesProvider>
  )
}

export default VehiclesNavigator;