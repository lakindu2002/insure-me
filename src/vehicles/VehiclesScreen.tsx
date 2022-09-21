import { FloatingActionButton } from '@insureme/common/FloatingActionButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useLayoutEffect } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { VehicleList } from './VehicleList';
import { VehiclesNavigatorParamList } from './VehiclesNavigator';


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
        <VehicleList />
      </ScrollView>
      <FloatingActionButton
        onPress={handleNewClicked}
      />
    </>
  );
};
