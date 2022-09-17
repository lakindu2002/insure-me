import * as Yup from 'yup';
import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Divider, Headline, TextInput, useTheme, withTheme } from 'react-native-paper';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import { CustomButton } from '@insureme/common/CustomButton';
import { AppLogo } from '@insureme/common/AppLogo';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { useFormik } from 'formik';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { useAuth } from './AuthContext';
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


type LoginScreenNavigatorProps = NativeStackScreenProps<RootStackNavigatorParamList, 'Login'>;

interface LoginScreenProps extends LoginScreenNavigatorProps {

}

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [toggleSecureEntry, setToggleSecureEntry] = useState<boolean>(true);
  const [openForgetPasswordModal, setOpenForgetPasswordModal] = useState<boolean>(false);
  const { login } = useAuth();
  const toast = useToast();

  const validationSchema = Yup.object({
    email: Yup.string().email('Email address poorly formatted').required('Email is Required'),
    password: Yup.string().required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      try {
        await login(email, password)
      } catch (err) {
        const parsedErr = err as any;
        if (parsedErr.message.startsWith('[auth/]')) {
          toast.show('Invalid Email Address or Password', { type: 'danger' });
          return;
        }
        toast.show('An unknown error occured. Please try again', { type: 'danger' });
      }
    }
  })

  const theme = useTheme();

  const handleSignUpClicked = () => {
    console.log('sign up clicked')
    navigation.navigate('SignUp');
  };

  const handleForgotPasswordClicked = () => {
    setOpenForgetPasswordModal(true);
  }

  return (
    <View
      style={{ ...globalStyles.container, backgroundColor: theme.colors.surface }}
    >
      <View style={styles.wrapper}>
        <AppLogo
          size={150}
          style={{ alignSelf: 'center' }}
        />
        <Divider style={{
          marginVertical: 25
        }} />
        <Headline
          style={globalStyles.heading}
        >
          Welcome Back!
        </Headline>
        <OutlinedTextInput
          label={'Email'}
          value={formik.values.email}
          left={<TextInput.Icon name='email'
            disabled
          />}
          style={styles.marginTop}
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          onChangeText={formik.handleChange('email')}
        />
        <OutlinedTextInput
          label={'Password'}
          value={formik.values.password}
          error={Boolean(formik.touched.password && formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          onChangeText={formik.handleChange('password')}
          secureTextEntry={toggleSecureEntry}
          left={<TextInput.Icon name='lock'
            disabled
          />}
          right={<TextInput.Icon name={toggleSecureEntry ? 'eye' : 'eye-off'}
            onPress={() => setToggleSecureEntry((prevState) => !prevState)}
          />}
          style={styles.marginTop}
        />
        <CustomButton
          onPress={formik.handleSubmit}
          mode='contained'
          icon={'arrow-right'}
          loading={formik.isSubmitting}
          style={{ ...styles.marginTop }}
          label={'Log In'}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
          <Caption
            style={{ fontSize: 14 }}
          >
            No account? <Caption
              onPress={handleSignUpClicked}
              style={{ ...styles.caption, color: theme.colors.primary }}>Sign Up</Caption>
          </Caption>
          <Caption
            onPress={handleForgotPasswordClicked}
            style={{ ...styles.caption, color: theme.colors.primary }}>Forgot Password?
          </Caption>
        </View>
      </View>
      {openForgetPasswordModal && (
        <ForgotPasswordScreen
          onClose={() => setOpenForgetPasswordModal(false)}
          open={openForgetPasswordModal}
        />
      )}
    </View>
  );
};

export default LoginScreen;