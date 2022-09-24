import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { Loader } from '@insureme/common/Loader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useCallback, useEffect } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { ClaimStatus } from './Claim.type';
import { ClaimNavigatorParamList } from './ClaimNavigator';
import { useClaims } from './ClaimsContext';

type ClaimViewScreenNavigationProp = NativeStackScreenProps<ClaimNavigatorParamList, 'ClaimDetail'>;

interface ClaimViewScreenProps extends ClaimViewScreenNavigationProp { }

export const ClaimViewScreen: FC<ClaimViewScreenProps> = ({ route, navigation }) => {
  const { params } = route;
  const { claimId } = params;
  const { getClaimById, claimLoading, claim, assignClaimToLoggedInUser, deleteClaim } = useClaims();
  const sheet = useActionSheet();
  const { user } = useAuth();
  const theme = useTheme();

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
  }, [launchDeleteConfirmation, launchAssignConfirmation, launchUpdateStatusWizard, user?.role, claim?.status]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <IconButton
          onPress={handleLaunchClaimOptions}
          icon={'dots-vertical'}
        />
      )
    })
  }, [handleLaunchClaimOptions])

  useEffect(() => {
    getClaimById(claimId);
  }, [claimId]);

  return (
    <ScrollView style={globalStyles.container}>
      <View
        style={{ padding: 20 }}
      >
        {claimLoading ? (
          <Loader />
        ) : (
          <View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
