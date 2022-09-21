import { Alert } from '@insureme/common/Alert';
import { Loader } from '@insureme/common/Loader';
import React, { FC, Fragment } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AccidentType, Claim, ClaimStatus } from './Claim.type';
import { useClaims } from './ClaimsContext';

const claims: Claim[] = [
  {
    id: '1',
    accidentType: AccidentType.HEAD_ON,
    createdAt: Date.now(),
    location: {
      latitude: 0,
      longitude: 0,
    },
    pictures: [
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
    ],
    status: ClaimStatus.APPROVED,
    time: Date.now(),
    updatedAt: Date.now(),
    approvedAmount: 1000,
    expectedAmount: 2000,
    user: {
      name: 'John Doe',
      nic: '123456789V',
      phone: '0712345678',
      email: '',
    },
    userId: '1',
    vehicle: {
      brand: 'Toyota',
      model: 'Corolla',
      licensePlate: 'ABC-1234',
      chassisNumber: '1234567890',
      createdAt: Date.now(),
      owner: '123',
      updatedAt: Date.now(),
      pictureUrl: 'https://picsum.photos/200/300',
    },
  },
];

const stylesheet = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20
  }
})

export const ClaimList: FC = React.memo((props) => {
  const { claims, claimsLoading } = useClaims();
  const theme = useTheme();
  return (
    <ScrollView style={[stylesheet.container, {
      backgroundColor: theme.colors.background
    }]}>
      {claimsLoading ? (
        <Loader />
      ) : (
        <Fragment>
          {claims.length === 0 && (
            <Alert
              message='There are no claims to show at the moment'
              title='No claims found'
              variant='warning'
            />
          )}
        </Fragment>
      )}
    </ScrollView>
  )
});
