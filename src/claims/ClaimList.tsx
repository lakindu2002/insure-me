import { Alert } from '@insureme/common/Alert';
import { Loader } from '@insureme/common/Loader';
import React, { FC, Fragment } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ClaimCard } from './ClaimCard';
import { useClaims } from './ClaimsContext';

const stylesheet = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20
  }
})

export const ClaimList: FC = React.memo((props) => {
  const { claims, claimsLoading } = useClaims();
  const theme = useTheme();

  const handleClaimDetailsClick = (claimId: string) => () => {
    console.log('claimId', claimId);
  }

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
          {claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onMoreDetailsPress={handleClaimDetailsClick(claim.id)}
            />
          ))}
        </Fragment>
      )}
    </ScrollView>
  )
});
