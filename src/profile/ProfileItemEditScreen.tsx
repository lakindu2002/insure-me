import { useAuth } from '@insureme/auth/AuthContext';
import { CustomButton } from '@insureme/common/CustomButton';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFormik } from 'formik';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { ProfileStackNavigationParamList } from './ProfileNavigator';
import * as Yup from 'yup';
import { useTheme } from 'react-native-paper';

type ProfileItemEditScreenNavigationProps = NativeStackScreenProps<ProfileStackNavigationParamList, 'Name' | 'Contact' | 'Address'>;

interface ProfileItemEditScreenProps extends ProfileItemEditScreenNavigationProps { }

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  }
})

export const ProfileItemEditScreen: FC<ProfileItemEditScreenProps> = (props) => {
  const { navigation, route } = props;
  const { params, name: routeName } = route;
  const { id } = params;

  const { user, updateUser } = useAuth();

  if (id && (id !== user?.id)) {
    throw new Error('Invalid user id');
  }
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      ...routeName === 'Name' && { value: user?.fullName || '' },
      ...routeName === 'Contact' && { value: user?.contact || '' },
      ...routeName === 'Address' && { value: user?.address || '' },
    },
    onSubmit: async ({ value }) => {
      try {
        await updateUser(id, {
          ...routeName === 'Name' && { fullName: value },
          ...routeName === 'Contact' && { contact: value },
          ...routeName === 'Address' && { address: value }
        });
        toast.show('Profile updated successfully', { type: 'success' });
        navigation.goBack();
      } catch (err) {
        toast.show('We ran into an error while updating your profile information. Please try again', { type: 'success' });
      }
    },
    validationSchema: Yup.object({
      ...routeName === 'Name' && { value: Yup.string().required('Full Name is required') },
      ...routeName === 'Contact' && { value: Yup.number().required('Contact is required').typeError('Contact number must be a number') },
      ...routeName === 'Address' && { value: Yup.string().required('Address is required') },
    })
  })

  return (
    <View style={[globalStyles.container, { justifyContent: 'center', alignContent: 'center', position: 'relative', backgroundColor: useTheme().colors.background }]}>
      <View style={[styles.container]}>
        <OutlinedTextInput
          label={routeName}
          value={formik.values.value}
          {...routeName === 'Address' && {
            multiline: true
          }}
          error={Boolean(formik.touched.value && formik.errors.value)}
          helperText={formik.touched.value && formik.errors.value}
          onChangeText={formik.handleChange('value')}
        />
      </View>
      <CustomButton
        loading={formik.isSubmitting}
        onPress={formik.handleSubmit}
        mode='contained'
        disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, marginHorizontal: 20, marginVertical: 40 }}
        label={`Update ${routeName}`}
      />
    </View>
  );
};
