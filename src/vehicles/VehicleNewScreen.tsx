import { CustomButton } from '@insureme/common/CustomButton';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { Image } from '@insureme/common/Image';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import { useCamera } from '@insureme/common/UseCamera';
import { useFormik } from 'formik';
import { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import * as Yup from 'yup';

interface VehicleNewScreenProps { }

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20
  },
  marginTop20: {
    marginTop: 20
  },
  uploadBox: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const VehicleNewScreen: FC<VehicleNewScreenProps> = (props) => {
  const theme = useTheme();
  const toast = useToast();
  const { launchPhotoSelection, images } = useCamera(5);

  const handleUploadClick = () => {
    launchPhotoSelection();
  }

  const formik = useFormik({
    initialValues: {
      licensePlate: '',
      chassisNumber: '',
      model: '',
      brand: '',
      pictureUrl: ''
    },
    validationSchema: Yup.object({
      licensePlate: Yup.string().required('License plate is required'),
      chassisNumber: Yup.string().required('Chassis number is required'),
      model: Yup.string().required('Vehicle model is required'),
      brand: Yup.string().required('Vehicle brand is required'),
      pictureUrl: Yup.string().required('Picture is required')
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
      } catch (err) {
        toast.show('Error creating vehicle', { type: 'danger' });
      }
    }
  })

  useEffect(() => {
    if (images.length === 0) {
      return;
    }
    const image = images[0];
    const uri = image.path;
    formik.handleChange('pictureUrl')(uri);
  }, [images]);

  return (
    <ScrollView
      style={[globalStyles.container, styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={[globalStyles.positionRelative, styles.uploadBox,
        ...!formik.values.pictureUrl ? [{
          borderColor: theme.colors.disabled,
          borderWidth: 1,
          borderRadius: 5,
        }] : []
        ]}
      >
        {
          formik.values.pictureUrl && (
            <Image
              source={{ uri: formik.values.pictureUrl }}
              style={{
                height: '100%'
              }}
            />
          )
        }
        <IconButton
          icon={'camera'}
          size={35}
          color={theme.colors.primary}
          style={{
            ...formik.values.pictureUrl && {
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: theme.colors.disabled,
            }
          }}
          onPress={handleUploadClick}
        />
      </View>
      <OutlinedTextInput
        label={'License Plate'}
        value={formik.values.licensePlate}
        onChangeText={formik.handleChange('licensePlate')}
        error={Boolean(formik.touched.licensePlate && formik.errors.licensePlate)}
        helperText={formik.touched.licensePlate && formik.errors.licensePlate}
        style={styles.marginTop20}
      />
      <OutlinedTextInput
        label={'Chassis Number'}
        value={formik.values.chassisNumber}
        onChangeText={formik.handleChange('chassisNumber')}
        error={Boolean(formik.touched.chassisNumber && formik.errors.chassisNumber)}
        helperText={formik.touched.chassisNumber && formik.errors.chassisNumber}
        style={styles.marginTop20}
      />
      <OutlinedTextInput
        label={'Vehicle Model'}
        placeholder={'e.g. Corolla'}
        value={formik.values.model}
        onChangeText={formik.handleChange('model')}
        error={Boolean(formik.touched.model && formik.errors.model)}
        helperText={formik.touched.model && formik.errors.model}
        style={styles.marginTop20}
      />
      <OutlinedTextInput
        label={'Vehicle Make'}
        placeholder={'e.g. Toyota'}
        value={formik.values.brand}
        onChangeText={formik.handleChange('brand')}
        error={Boolean(formik.touched.brand && formik.errors.brand)}
        helperText={formik.touched.brand && formik.errors.brand}
        style={styles.marginTop20}
      />
      <CustomButton
        label='Save Car'
        mode='contained'
        style={styles.marginTop20}
        loading={formik.isSubmitting}
        onPress={formik.handleSubmit}
      />
    </ScrollView >
  );
};
