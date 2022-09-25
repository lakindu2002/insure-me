import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { Carousel } from '@insureme/common/Carousel';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { Loader } from '@insureme/common/Loader';
import { ReadOnlyField } from '@insureme/common/ReadOnlyField';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, IconButton, List, useTheme } from 'react-native-paper';
import { ClaimStatus } from './Claim.type';
import { getAccidentTypeName, getClaimStatusName } from './Claim.util';
import { ClaimNavigatorParamList } from './ClaimNavigator';
import { useClaims } from './ClaimsContext';
import { ClaimStatusUpdateModal } from './ClaimStatusUpdateModal';

type ClaimViewScreenNavigationProp = NativeStackScreenProps<ClaimNavigatorParamList, 'ClaimDetail'>;

interface ClaimViewScreenProps extends ClaimViewScreenNavigationProp { }

export const ClaimViewScreen: FC<ClaimViewScreenProps> = ({ route, navigation }) => {
  const { params } = route;
  const { claimId } = params;
  const { getClaimById, claimLoading, claim, assignClaimToLoggedInUser, deleteClaim } = useClaims();
  const sheet = useActionSheet();
  const { user } = useAuth();
  const theme = useTheme();
  const [openStatsUpdateModal, setOpenStatsUpdateModal] = useState(false);

  const launchDeleteConfirmation = useCallback(() => {
    if (!claim?.id) {
      return;
    }
    Alert.alert('Delete Claim', 'Are you sure you wish to delete this claim?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const isDeleted = await deleteClaim(claim.id)
          if (isDeleted) navigation.navigate('ClaimList');
        }
      },
    ])
  }, [claim?.id])

  const launchAssignConfirmation = useCallback(() => {
    Alert.alert('Assign To Me', 'Are you sure you want to manage this claim?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Assign To Me', style: 'default', onPress: async () => { await assignClaimToLoggedInUser(); } },
    ])
  }, [])

  const launchUpdateStatusWizard = useCallback(() => {
    setOpenStatsUpdateModal(true);
  }, []);

  const handleLaunchClaimOptions = useCallback(() => {
    let options = [];
    if (user?.role === UserRole.CUSTOMER) {
      options = ['Delete Claim', 'Cancel'];
    } else {
      options = [claim?.status === ClaimStatus.PENDING ? 'Assign To Me' : 'Update Status', 'Cancel'];
    }
    sheet.showActionSheetWithOptions({
      options,
      cancelButtonIndex: 0,
      title: 'Claim Options',
      destructiveButtonIndex: user?.role === UserRole.CUSTOMER ? 0 : 1,
      message: 'Manage the claim',
      containerStyle: {
        backgroundColor: theme.colors.background,
      },
      textStyle: {
        color: theme.colors.text,
      },
      messageTextStyle: {
        color: theme.colors.text,
      },
      titleTextStyle: {
        color: theme.colors.text,
      },
    }, (buttonIndex) => {
      if (buttonIndex === 0 && user?.role === UserRole.CUSTOMER) {
        launchDeleteConfirmation();
      }
      if (buttonIndex === 0 && user?.role === UserRole.CLAIM_ADJUSTER && claim?.status === ClaimStatus.PENDING) {
        launchAssignConfirmation();
      }
      if (buttonIndex === 0 && user?.role === UserRole.CLAIM_ADJUSTER && claim?.status !== ClaimStatus.PENDING) {
        launchUpdateStatusWizard();
      }
    });
  }, [launchDeleteConfirmation, launchAssignConfirmation, launchUpdateStatusWizard, user?.role, claim?.status, theme]);

  useEffect(() => {
    navigation.setOptions({
      ...claim?.id && {
        headerRight: (props) => (
          <IconButton
            onPress={handleLaunchClaimOptions}
            icon={'dots-vertical'}
          />
        )
      }
    })
  }, [handleLaunchClaimOptions, claim?.id])

  useEffect(() => {
    getClaimById(claimId);
  }, [claimId]);

  return (
    <ScrollView style={{ ...globalStyles.container, backgroundColor: theme.colors.background }}>
      <View
        style={{ padding: 20 }}
      >
        {claimLoading ? (
          <Loader />
        ) : (
          <Fragment>
            {claim && (
              <View>
                <Carousel
                  data={claim?.pictures || []}
                  type='image'
                />
                <View style={{ marginTop: 30 }}>
                  <List.Accordion
                    title='Accident Information'
                  >
                    <ReadOnlyField
                      label='Accident Type'
                      content={getAccidentTypeName(claim.accidentType)}
                    />
                    <ReadOnlyField
                      label='Accident Date'
                      content={moment(claim.date).format('Do MMMM/YYYY')}
                    />
                    <ReadOnlyField
                      label='Accident Time'
                      content={moment(claim.time).format('HH : mm a')}
                    />
                    <ReadOnlyField
                      label='Accident Location'
                      content={claim.location}
                    />
                  </List.Accordion>
                  <Divider style={{ marginVertical: 20 }} />
                  <List.Accordion
                    title='Vehicle Information'
                  >
                    <ReadOnlyField
                      label='Vehicle'
                      content={`${claim.vehicle.brand} ${claim.vehicle.model}`}
                    />
                  </List.Accordion>
                  <Divider style={{ marginVertical: 20 }} />
                  <List.Accordion
                    title='Claim Information'
                  >
                    {claim.managerId && (
                      <ReadOnlyField
                        label='Managed By'
                        content={claim.manager?.name || ''}
                      />
                    )}
                    <ReadOnlyField
                      label='Status'
                      content={`${getClaimStatusName(claim.status)}`}
                    />
                    <ReadOnlyField
                      label='Expected Amount'
                      content={`${claim.expectedCurrency} ${claim.expectedAmount}`}
                    />
                    {claim.approvedAmount && (
                      <ReadOnlyField
                        label='Approved Amount'
                        content={`${claim.approvedCurrency} ${claim.approvedAmount}`}
                      />
                    )}

                  </List.Accordion>
                </View>
              </View>
            )}
          </Fragment>

        )}
      </View>
      {openStatsUpdateModal && claim && (
        <ClaimStatusUpdateModal
          onClose={() => setOpenStatsUpdateModal(false)}
          open={openStatsUpdateModal}
        />
      )}
    </ScrollView>
  );
};
