import { useAuth } from '@insureme/auth/AuthContext';
import { Alert } from '@insureme/common/Alert';
import { CustomButton } from '@insureme/common/CustomButton';
import { DropdownMenu } from '@insureme/common/DropdownMenu';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { Image } from '@insureme/common/Image';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import { TimePicker } from '@insureme/common/TimePicker';
import { useCamera } from '@insureme/common/UseCamera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, HelperText, IconButton, Provider, Text, useTheme } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { AccidentType, Claim } from './ClaimType';
import { ClaimNavigatorParamList } from './ClaimNavigator';
import { useClaims } from './ClaimsContext';

type ClaimNewScreenNavigatorProps = NativeStackScreenProps<
  ClaimNavigatorParamList,
  'NewClaim'
>;

interface ClaimNewScreenProps extends ClaimNewScreenNavigatorProps { }

const Header: FC<{ label: string }> = ({ label }) => {
  return (
    <View>
      <Text style={{
        fontSize: 18,
        fontWeight: '700'
      }}>
        {label}
      </Text>
      <Divider style={{ marginVertical: 10 }} />
    </View>
  )
}

const steps = [
  {
    title: 'Provide Claim Information',
  },
  {
    title: 'Provide Claim Documents',
  }
]

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: 20,
  }
});

const validateStep01 = (claim: Partial<Claim>) => {
  const validationErrors: { key: string, message: string }[] = [];
  if (!claim.accidentType) validationErrors.push({ key: 'accidentType', message: 'Accident type is required' });
  if (!claim.date) validationErrors.push({ key: 'date', message: 'Accident date is required' });
  if (!claim.time) validationErrors.push({ key: 'time', message: 'Accident time is required' });
  if (!claim.expectedCurrency) validationErrors.push({ key: 'expectedCurrency', message: 'Expected currency is required' });
  if (!claim.expectedAmount) validationErrors.push({ key: 'expectedAmount', message: 'Expected amount is required' });
  if (!claim.vehicle) validationErrors.push({ key: 'vehicle', message: 'Vehicle is required' });
  if (!claim.location) validationErrors.push({ key: 'location', message: 'Location is required' });
  if (!claim.owner?.name) validationErrors.push({ key: 'ownerName', message: 'Your name is required. Please update it in the profile' });
  if (!claim.owner?.nic) validationErrors.push({ key: 'nic', message: 'Your NIC is required. Please update it in the profile' });
  if (!claim.owner?.phone) validationErrors.push({ key: 'contact', message: 'Your contact number is required. Please update it in the profile' });
  return validationErrors;
}

const validateStep02 = (images: string[]) => {
  const validationErrors: { key: string, message: string }[] = [];
  if (images.length === 0) validationErrors.push({ key: 'images', message: 'At least one image is required' });
  return validationErrors;
}

export const ClaimNewScreen: FC<ClaimNewScreenProps> = ({ navigation }) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const { accidentTypes, getVehicleAccidentTypes, claimVehicles, createClaim, claimCreating } = useClaims();
  const { images, launchPhotoSelection } = useCamera(5);
  const [newClaim, setNewClaim] = useState<Partial<Claim>>({ time: Date.now(), date: Date.now() });

  const [step01ValidationErrors, setStep01ValidationErrors] = useState<{ key: string, message: string }[]>([]);
  const [step02ValidationErrors, setStep02ValidationErrors] = useState<{ key: string, message: string }[]>([]);

  const theme = useTheme();
  const toast = useToast();

  const { user } = useAuth();

  useEffect(() => {
    setNewClaim((claim) => ({
      ...claim, pictures: [...(claim.pictures || []), ...images.map(image => image.path)]
    }))
  }, [images]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setNewClaim((claim) => ({
      ...claim, owner: {
        name: user.fullName,
        phone: user.contact || '',
        nic: user.nicImageUrl || '',
      }
    }))
  }, [user]);

  useEffect(() => {
    getVehicleAccidentTypes();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: steps[selectedStep].title,
    });
  }, [selectedStep]);

  const getPositiveLabel = () => {
    if (selectedStep === steps.length - 1) {
      return 'Submit Claim';
    }
    return 'Next'
  }

  const handlePositiveAction = async () => {
    if (selectedStep === 0) {
      const validationResults = validateStep01(newClaim);
      setStep01ValidationErrors(validationResults);
      if (validationResults.length === 0) {
        setSelectedStep(1);
      }
      return;
    }
    const validationResults = validateStep02(newClaim.pictures || []);
    setStep02ValidationErrors(validationResults);
    if (validationResults.length !== 0) {
      return;
    }
    // create claim
    const created = await createClaim(newClaim);
    if (created) {
      navigation.navigate('ClaimList');
    }
  };

  const handleVehicleSelect = useCallback((selectedVehicleChassisId: string) => {
    const selectedVehicle = claimVehicles.find((v) => v.chassisNumber === selectedVehicleChassisId);
    if (!selectedVehicle) {
      toast.show('Vehicle does not exist', { type: 'danger' });
    } else {
      setNewClaim((claim) => ({ ...claim, vehicle: selectedVehicle }));
    }
  }, [claimVehicles])

  const handleExpectedClaimAmountChange = (newClaimAmount: string) => {
    if (isNaN(Number(newClaimAmount))) {
      return;
    }
    setNewClaim((claim) => ({ ...claim, expectedAmount: Number(newClaimAmount) }));
  }

  const launchCamera = () => {
    launchPhotoSelection();
  }

  const handleImageRemove = (index: number) => {
    const newImages = [...newClaim.pictures || []];
    newImages.splice(index, 1);
    setNewClaim((claim) => ({ ...claim, pictures: newImages }));
  }

  const handleTimeChanged = (newTime: Date) => {
    const newTimeInMs = newTime.getTime();
    setNewClaim((claim) => ({ ...claim, time: newTimeInMs }));
  }

  const handleDateChanged = (newDate: Date) => {
    const newDateInMs = newDate.getTime();
    setNewClaim((claim) => ({ ...claim, date: newDateInMs }));
  }

  const selectedVehicle = useMemo(() => claimVehicles.find((vehicle) => vehicle.chassisNumber === newClaim.vehicle?.chassisNumber), [newClaim.vehicle?.chassisNumber]);
  return (
    <ScrollView style={{
      ...globalStyles.container,
      backgroundColor: theme.colors.background,
    }}>
      <Provider
        theme={theme}
      >
        <View
          style={{
            padding: 20,
          }}
        >
          {
            selectedStep === 0 && (
              <>
                <Header label={'Accident Information'} />
                <View style={styles.marginBottom}>
                  <DropdownMenu
                    label='Accident Type'
                    items={accidentTypes}
                    error={step01ValidationErrors.find((error) => error.key === 'accidentType') !== undefined}
                    helperText={step01ValidationErrors.find((error) => error.key === 'accidentType')?.message}
                    selected={accidentTypes.find((item) => item.value === newClaim.accidentType)}
                    onSelect={(item) => setNewClaim((claim) => ({ ...claim, accidentType: item as AccidentType }))}
                  />
                </View>
                <View style={styles.marginBottom}>
                  <TimePicker
                    initialValue={newClaim.date}
                    mode={'date'}
                    onDateChange={handleDateChanged}
                  />
                </View>
                <View style={styles.marginBottom}>
                  <TimePicker
                    mode='time'
                    initialValue={newClaim.time}
                    onDateChange={handleTimeChanged}
                  />
                </View>
                <View style={styles.marginBottom}>
                  <DropdownMenu
                    label='Vehicle'
                    helperText={step01ValidationErrors.find((error) => error.key === 'vehicle')?.message}
                    error={step01ValidationErrors.find((error) => error.key === 'vehicle') !== undefined}
                    items={claimVehicles.map((vehicle) => ({ label: `${vehicle.brand} ${vehicle.model}`, value: vehicle.chassisNumber }))}
                    selected={selectedVehicle && { label: `${selectedVehicle.brand} ${selectedVehicle.model}`, value: selectedVehicle.chassisNumber }}
                    onSelect={(newChassisNumber: string) => handleVehicleSelect(newChassisNumber)}
                  />
                </View>
                <View style={[styles.marginBottom, {
                  display: 'flex',
                  flexDirection: 'row',
                }]}>
                  <OutlinedTextInput
                    label={'Currency'}
                    style={{
                      flex: 1,
                      marginRight: 10
                    }}
                    helperText={step01ValidationErrors.find((error) => error.key === 'expectedCurrency')?.message}
                    error={step01ValidationErrors.find((error) => error.key === 'expectedCurrency') !== undefined}
                    value={newClaim.expectedCurrency || ''}
                    onChangeText={(newCurrency) => setNewClaim((claim) => ({ ...claim, expectedCurrency: newCurrency }))}
                  />
                  <OutlinedTextInput
                    style={{
                      flex: 2
                    }}
                    label={'Expected Claim Amount'}
                    helperText={step01ValidationErrors.find((error) => error.key === 'expectedAmount')?.message}
                    error={step01ValidationErrors.find((error) => error.key === 'expectedAmount') !== undefined}
                    value={(newClaim.expectedAmount || 0).toFixed()}
                    onChangeText={handleExpectedClaimAmountChange}
                  />
                </View>
                <View style={styles.marginBottom}>
                  <OutlinedTextInput
                    label={'Location'}
                    multiline
                    numberOfLines={4}
                    helperText={step01ValidationErrors.find((error) => error.key === 'location')?.message}
                    error={step01ValidationErrors.find((error) => error.key === 'location') !== undefined}
                    value={newClaim.location || ''}
                    onChangeText={(newLocation) => setNewClaim((claim) => ({ ...claim, location: newLocation }))}
                  />
                </View>
                <Header label={'Person Information'} />
                <View style={styles.marginBottom}>
                  <OutlinedTextInput
                    editable={false}
                    label={'Person Name'}
                    helperText={step01ValidationErrors.find((error) => error.key === 'ownerName')?.message}
                    error={step01ValidationErrors.find((error) => error.key === 'ownerName') !== undefined}
                    value={newClaim.owner?.name || ''}
                  />
                </View>
                <View style={styles.marginBottom}>
                  <OutlinedTextInput
                    editable={false}
                    label={'Phone Number'}
                    value={newClaim.owner?.phone || ''}
                    error={!newClaim.owner?.phone}
                    helperText={!newClaim.owner?.phone && 'Please add a phone number in your profile'}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: '700',
                    marginBottom: 10,
                    fontSize: 16
                  }}
                >
                  NIC
                </Text>
                {
                  newClaim.owner?.nic ? (
                    <Image
                      source={{ uri: newClaim.owner?.nic || '' }}
                    />
                  ) : (
                    <Alert
                      message='Visit the profile screen to upload your NIC'
                      title='NIC Not Provided'
                      variant='error'
                    />
                  )
                }
              </>
            )
          }
          {
            selectedStep === 1 && (
              <>
                <Header
                  label='Upload Vehicular Damage'
                />
                {
                  (newClaim.pictures || []).length < 5 && (
                    <>
                      <Text>
                        Select/take upto 5 images of the vehicular damage
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          marginTop: 20
                        }}
                      >
                        <IconButton
                          onPress={launchCamera}
                          icon={'camera'}
                        />
                      </View>
                      {step02ValidationErrors.length > 0 && (
                        <HelperText
                          type='error'
                          visible={step02ValidationErrors.length > 0}
                        >
                          {step02ValidationErrors[0].message}
                        </HelperText>
                      )}
                      <Divider style={{ marginVertical: 20 }} />
                    </>
                  )
                }
                {(newClaim.pictures || []).length === 0 && (
                  <Alert
                    variant='warning'
                    message='No images have been added'
                    title='No Images'
                  />
                )}
                {
                  (newClaim.pictures || []).map((image, index) => (
                    <View
                      key={index}
                      style={[styles.marginBottom, { position: 'relative' }]}
                    >
                      <Image
                        source={{ uri: image }}
                      />
                      <IconButton
                        icon={'close'}
                        onPress={() => handleImageRemove(index)}
                        style={{
                          position: 'absolute',
                          backgroundColor: theme.colors.primary,
                        }}
                      />
                    </View>
                  ))
                }
              </>
            )
          }
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 20
            }}
          >
            {
              selectedStep === 1 && <CustomButton
                label={'Back'}
                color='error'
                onPress={() => setSelectedStep(0)}
                mode='outlined'
                style={{
                  marginRight: 15
                }}
              />
            }
            <CustomButton
              mode='contained'
              color='primary'
              loading={claimCreating}
              onPress={handlePositiveAction}
              label={getPositiveLabel()}
            />
          </View>
        </View>
      </Provider>
    </ScrollView>
  );
};
