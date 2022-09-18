import { FloatingActionButton } from '@insureme/common/FloatingActionButton';
import { FC } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Vehicle } from './Vehicle.type';
import { VehicleList } from './VehicleList';

interface VehiclesScreenProps { }

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

export const VehiclesScreen: FC<VehiclesScreenProps> = (props) => {
  const theme = useTheme();

  const handleNewClicked = () => {
    console.log('new clicked');
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
