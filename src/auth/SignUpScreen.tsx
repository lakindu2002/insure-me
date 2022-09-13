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
  withTheme,
} from 'react-native-paper';
import { useFormik } from 'formik';
import auth from '@react-native-firebase/auth';

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


interface SignUpScreenProps { }

const SignUpScreen: FC<SignUpScreenProps> = (props) => {
  const theme = useTheme();

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
        await auth().createUserWithEmailAndPassword(email, password);
        // TODO: Add user to firestore
      } catch (err) {
        // TODO: Handle error
      }
    }
  });

  return (
    <View
      style={{
        ...globalStyles.container,
        backgroundColor: theme.colors.surface,
      }}>
      <View style={styles.wrapper}>
        <AppLogo size={150} style={{ alignSelf: 'center' }} />
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
              style={{ ...styles.caption, color: theme.colors.primary }}>
              Log in
            </Caption>
          </Caption>
        </View>
      </View>
    </View>
  );
};

export default withTheme(SignUpScreen);
