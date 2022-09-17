import * as Yup from 'yup';
import React, { FC } from 'react';
import { Dialog, Portal, TextInput } from 'react-native-paper';
import { useFormik } from 'formik';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import { CustomButton } from '@insureme/common/CustomButton';
import { useAuth } from './AuthContext';
import { useToast } from 'react-native-toast-notifications';

interface ForgotPasswordScreenProps {
  open: boolean
  onClose: () => void
}

export const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = (props) => {
  const { open, onClose } = props;
  const { forgotPassword } = useAuth();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email address poorly formatted').required('Email is required'),
    }),
    onSubmit: async (values) => {
      const { email } = values;
      try {
        await forgotPassword(email);
      } catch (err) {
      } finally {
        toast.show('You will recieve an email if your email address is valid!', { type: 'success' });
        onClose();
      }
    }
  });

  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={onClose}
        dismissable={!formik.isSubmitting}
      >
        <Dialog.Title>
          Reset Your Password
        </Dialog.Title>
        <Dialog.Content>
          <OutlinedTextInput
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            error={Boolean(formik.touched.email && formik.errors.email)}
            label="Email Address"
            left={<TextInput.Icon name='email' disabled />}
            helperText={formik.errors.email ? formik.touched.email && formik.errors.email : 'Provide the email that you created the account with'}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <CustomButton
            mode='outlined'
            label='Close'
            color='error'
            onPress={onClose}
            disabled={formik.isSubmitting}
            style={{
              marginRight: 10
            }}
          />
          <CustomButton
            mode='contained'
            label='Send Reset Link'
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting}
            loading={formik.isSubmitting}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
