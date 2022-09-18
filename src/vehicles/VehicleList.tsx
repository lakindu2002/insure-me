import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { FC, useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Vehicle as VehicleComponent } from './Vehicle';
import { Vehicle as VehicleType } from './Vehicle.type';

interface VehicleListProps {
  vehicles: VehicleType[]
}

const styles = StyleSheet.create({
  marginBottom10: {
    marginBottom: 10,
  },
  margin10: {
    margin: 10,
  }
})

export const VehicleList: FC<VehicleListProps> = (props) => {
  const { vehicles } = props;
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useTheme();

  const onPromptDeleteVehicle = useCallback((vehicleId: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this vehicle?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => { }
      }
    ]);
  }, [])

  const handleOnVehicleLongPress = useCallback((vehicleId: string) => () => {
    showActionSheetWithOptions({
      options: ['Delete', 'Cancel'],
      title: 'Vehicle Options',
      useModal: true,
      autoFocus: true,
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      containerStyle: {
        backgroundColor: theme.colors.background,
      },
      textStyle: {
        color: theme.colors.text,
      },
      titleTextStyle: {
        color: theme.colors.text,
      }
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        onPromptDeleteVehicle(vehicleId);
      }
    });
  }, []);

  return (
    <View style={styles.margin10}>
      {vehicles.map((vehicle) => (
        <View
          key={vehicle.id}
          style={styles.marginBottom10}
        >
          <VehicleComponent
            vehicle={vehicle}
            onLongPress={handleOnVehicleLongPress(vehicle.id)}
          />
        </View>
      ))}
    </View>
  );
};
