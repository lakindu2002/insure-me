import * as Yup from 'yup';
import { AppLogo } from '@insureme/common/AppLogo';
import { CustomButton } from '@insureme/common/CustomButton';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Caption,
  Divider,
  Headline,
  useTheme,
} from 'react-native-paper';
import { useFormik } from 'formik';
import { useAuth } from './AuthContext';
import { UserRole } from './User.type';
import { useToast } from 'react-native-toast-notifications';
import { RootStackNavigatorParamList } from '@insureme/common/RootNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  marginTop: {
    marginTop: 20,
  },
  caption: {
    fontSize: 14
  }
})

type SignUpNavigatorProps = NativeStackScreenProps<RootStackNavigatorParamList, 'SignUp'>;

interface SignUpScreenProps extends SignUpNavigatorProps { }

const SignUpScreen: FC<SignUpScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { createUser } = useAuth();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Email address poorly formatted').required('Email address is required'),
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      const { fullName, email, password } = values;
      try {
        await createUser(email, fullName, UserRole.CUSTOMER, password);
        navigation.navigate('Customer'); // navigate to customer dashboard
      } catch (err) {
        if ((err as any).message?.includes('[auth/email-already-in-use]')) {
          toast.show('This email address is already in use', { type: 'danger' });
          return;
        }
        toast.show('An error occurred while creating your account', { type: 'danger' });
      }
    }
  });

  const onLoginPressed = () => {
    navigation.navigate('Login');
  }

  return (
    <View
      style={{
        ...globalStyles.container,
        backgroundColor: theme.colors.surface,
      }}>
      <View style={styles.wrapper}>
        <AppLogo width={150}
          height={150}
        />
        <Divider
          style={{
            marginVertical: 25,
          }}
        />
        <Headline style={globalStyles.heading}>Create Your Account</Headline>
        <OutlinedTextInput
          label={'Full Name'}
          style={styles.marginTop}
          onChangeText={formik.handleChange('fullName')}
          error={Boolean(formik.touched.fullName && formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />
        <OutlinedTextInput
          label={'Email Address'}
          style={styles.marginTop}
          onChangeText={formik.handleChange('email')}
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <OutlinedTextInput
          secureTextEntry
          label={'Password'}
          style={styles.marginTop}
          onChangeText={formik.handleChange('password')}
          error={Boolean(formik.touched.password && formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <OutlinedTextInput
          label={'Confirm Password'}
          style={styles.marginTop}
          onChangeText={formik.handleChange('confirmPassword')}
          secureTextEntry
          error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <CustomButton
          label={'Create Account'}
          mode={'contained'}
          icon='arrow-right'
          style={styles.marginTop}
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}>
          <Caption style={{ fontSize: 14 }}>
            Already have an account?{' '}
            <Caption
              onPress={onLoginPressed}
              style={{ ...styles.caption, color: theme.colors.primary }}>
              Log in
            </Caption>
          </Caption>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
