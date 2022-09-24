import { FC } from 'react';
import { View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { Vehicle as VehicleType } from './Vehicle.type';

interface VehicleProps {
  vehicle: VehicleType;
  onLongPress?: () => void;
}

export const Vehicle: FC<VehicleProps> = (props) => {
  const { vehicle, onLongPress } = props;
  const vehicleName = `${vehicle.brand} ${vehicle.model}`;
  return (
    <Card
      {...onLongPress && {
        onLongPress,
      }}
    >
      <Card.Cover
        source={{ uri: vehicle.pictureUrl }}
      />
      <Card.Title
        title={vehicleName} />
      <Card.Content>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}
        >
          <Paragraph>
            License Plate: {vehicle.licensePlate}
          </Paragraph>
          <Paragraph>
            Chassis Number: {vehicle.chassisNumber}
          </Paragraph>
        </View>
      </Card.Content>
    </Card >
  );
};
