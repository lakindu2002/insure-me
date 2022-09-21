import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { FC, Fragment, useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Vehicle as VehicleComponent } from './Vehicle';
import { Alert as AlertComponent } from '@insureme/common/Alert';
import { useVehicles } from './VehicleContext';
import { Loader } from '@insureme/common/Loader';

interface VehicleListProps {
}

const styles = StyleSheet.create({
  marginBottom10: {
    marginBottom: 10,
  },
  margin10: {
    margin: 10,
  }
})

export const VehicleList: FC<VehicleListProps> = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useTheme();
  const { loading, removeVehicle, vehicles } = useVehicles();

  const onPromptDeleteVehicle = useCallback((vehicleId: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this vehicle?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeVehicle(vehicleId);
        }
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
    <View style={[styles.margin10]}>
      {loading ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Loader />
        </View>
      ) : (
        <Fragment>
          {vehicles.length === 0 && (
            <AlertComponent
              title={'No Vehicles'}
              message={'You have no vehicles. Click the + button to add a vehicle.'}
              variant={'warning'}
            />
          )}
          {vehicles.map((vehicle) => (
            <View
              key={vehicle.chassisNumber}
              style={styles.marginBottom10}
            >
              <VehicleComponent
                vehicle={vehicle}
                onLongPress={handleOnVehicleLongPress(vehicle.chassisNumber)}
              />
            </View>
          ))}
        </Fragment>
      )}

    </View>
  );
};
