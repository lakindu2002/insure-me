import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AppLogo } from './AppLogo';
import { globalStyles } from './GlobalStyles';

interface SplashScreenProps { }

const stylesheet = StyleSheet.create({
  wrapperCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginTop: {
    marginTop: 20,
  }
});

export const SplashScreen: FC<SplashScreenProps> = (props) => {
  return (
    <View style={[globalStyles.container, stylesheet.wrapperCenter]}>
      <AppLogo size={150} />
      <View style={stylesheet.marginTop}>
        <ActivityIndicator
          animating
          size='large'
        />
      </View>
    </View>
  );
};
