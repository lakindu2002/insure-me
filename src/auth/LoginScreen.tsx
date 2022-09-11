import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, TextInput, useTheme } from 'react-native-paper';
import { OutlinedTextInput } from '@insureme/common/OutlinedTextInput';


const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
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
  },
  marginTop: {
    marginTop: 10,
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
  };

  return (
    <>
      <View
        style={styles.container}
      >
        <View style={styles.wrapper}>
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
          <Button
            onPress={handleLoginClick}
            mode='contained'
            style={{ ...styles.marginTop }}
          >
            Log In
          </Button>
        </View>
      </View>
    </>
  );
};
