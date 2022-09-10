import { FC, useState } from 'react';
import { LoadingButton } from '@insureme/common/LoadingButton';
import { Input, Layout } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 40,
  },
  view: {
    marginBottom: 10
  }
})


interface LoginScreenProps {

}

export const LoginScreen: FC<LoginScreenProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <View style={styles.view}>
          <Input
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email address"
          />
        </View>
        <View style={styles.view}>
          <Input
            value={password}
            textContentType="password"
            secureTextEntry={true}
            placeholder="Enter your password"
            onChangeText={handlePasswordChange}
          />
        </View>
        <View style={styles.view}>
          <LoadingButton
            onPress={handleLoginClick}
            label="Login"
          />
        </View>
      </View>
    </>
  );
};
