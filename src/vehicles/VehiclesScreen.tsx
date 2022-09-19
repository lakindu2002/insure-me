import { CustomerBottomTabNavigationParamList } from '@insureme/common/CustomerNavigator';
import { FloatingActionButton } from '@insureme/common/FloatingActionButton';
import { useCamera } from '@insureme/common/UseCamera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useLayoutEffect } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Vehicle } from './Vehicle.type';
import { VehicleList } from './VehicleList';
import { VehiclesNavigatorParamList } from './VehiclesNavigator';


const vehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Ford',
    chassisNumber: '123456789',
    licensePlate: 'ABC-123',
    model: 'Fiesta',
    pictureUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
  },
  {
    id: '2',
    brand: 'Ford',
    chassisNumber: '123456789',
    licensePlate: 'ABC-123',
    model: 'Fiesta',
    pictureUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
  },
  {
    id: '3',
    brand: 'Ford',
    chassisNumber: '123456789',
    licensePlate: 'ABC-123',
    model: 'Fiesta',
    pictureUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
  },
];

type VehiclesScreenNavigatorProps = NativeStackScreenProps<VehiclesNavigatorParamList, 'VehicleList'>;

interface VehiclesScreenProps extends VehiclesScreenNavigatorProps { }

export const VehiclesScreen: FC<VehiclesScreenProps> = ({ navigation }) => {
  const theme = useTheme();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerShown: false,
    })
  }, []);

  const handleNewClicked = () => {
    navigation.navigate('NewVehicle');
  };

  return (
    <>
      <ScrollView style={{
        backgroundColor: theme.colors.background,
      }}>
        <VehicleList
          vehicles={vehicles}
        />
      </ScrollView>
      <FloatingActionButton
        onPress={handleNewClicked}
      />
    </>
  );
};
