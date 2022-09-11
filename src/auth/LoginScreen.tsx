import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Caption, Divider, Headline, TextInput, useTheme } from 'react-native-paper';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';
import { CustomButton } from '@insureme/common/CustomButton';


const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    height: '100%',
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  heading: {
    fontSize: 33,
    fontWeight: '700',
  },
  marginTop: {
    marginTop: 20,
  },
  caption: {
    fontSize: 14
  }
})


interface LoginScreenProps {

}

export const LoginScreen: FC<LoginScreenProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleSecureEntry, setToggleSecureEntry] = useState<boolean>(true);

  const theme = useTheme();

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
  };

  const handleLoginClick = () => {
    console.log('Login Clicked');
    console.log(theme.colors.background);
  };

  const handleSignUpClicked = () => {
    console.log('Sign Up Clicked');
  };

  const handleForgotPasswordClicked = () => {
    console.log('Forgot Password Clicked');
  }

  return (
    <>
      <View
        style={{ ...styles.container, backgroundColor: theme.colors.background }}
      >
        <View style={styles.wrapper}>
          <Avatar.Image source={require('../../assets/logo.png')}
            size={150}
            style={{ alignSelf: 'center' }}
          />
          <Divider style={{
            marginVertical: 25
          }} />
          <Headline
            style={styles.heading}
          >
            Welcome Back!
          </Headline>
          <OutlinedTextInput
            label={'Email'}
            value={email}
            left={<TextInput.Icon name='email'
              disabled
            />}
            style={styles.marginTop}
            onChangeText={handleEmailChange}
          />
          <OutlinedTextInput
            label={'Password'}
            value={password}
            onChangeText={handlePasswordChange}
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
            onPress={handleLoginClick}
            mode='contained'
            icon={'arrow-right'}
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
      </View>
    </>
  );
};
