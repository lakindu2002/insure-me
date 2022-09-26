import { CustomButton } from '@insureme/common/CustomButton';
import moment from 'moment';
import React, { FC } from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { Claim } from './ClaimType';
import { getAccidentTypeName } from './ClaimUtil';

interface ClaimCardProps {
  claim: Claim;
  onMoreDetailsPress: () => void;
}

export const ClaimCard: FC<ClaimCardProps> = React.memo((props) => {
  const { claim, onMoreDetailsPress } = props;
  const { accidentType, vehicle, time, owner } = claim;
  const { name, phone } = owner;
  const theme = useTheme();

  const accidentTypeName = getAccidentTypeName(accidentType, 'Accident');

  return (
    <Card>
      <Card.Title title={accidentTypeName} />
      <Card.Content>
        <Text style={{
          color: theme.colors.disabled,
          fontWeight: '600'
        }}>
          {vehicle.brand} {vehicle.model} | {name} - {phone}
        </Text>
        <Text style={{ marginTop: 5 }}>
          Accident Time: {moment(time).format('DD MMM YYYY, hh:mm a')}
        </Text>
      </Card.Content>
      <Card.Actions style={{
        paddingLeft: 12,
        paddingBottom: 15,
        marginLeft: 'auto'
      }}>
        <CustomButton
          label='View Details'
          mode='contained'
          onPress={onMoreDetailsPress}
          labelStyle={{ fontSize: 10 }}
          style={{ marginTop: 10 }}
        />
      </Card.Actions>
    </Card>
  );
});
