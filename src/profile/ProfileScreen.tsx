import { FC, useLayoutEffect } from 'react';
import { useAuth } from '@insureme/auth/AuthContext';
import { StyleSheet, View } from 'react-native';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { Avatar, IconButton, useTheme } from 'react-native-paper';
import { ReadOnlyTextField } from '@insureme/common/ReadOnlyTextField';
import { ProfileStackNavigationParamList } from './ProfileNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ProfileScreenNavigationProp = NativeStackScreenProps<ProfileStackNavigationParamList, 'View'>;

interface ProfileScreenProps extends ProfileScreenNavigationProp { }

const stylesheet = StyleSheet.create({
  avatarHolder: {
    width: '100%',
    position: 'relative',
  },
  avatarEditButton: {
    position: 'absolute',
    right: 270,
    top: 90,
  }
});

export const ProfileScreen: FC<ProfileScreenProps> = (props) => {
  const { updateUser, user } = useAuth();
  const { navigation } = props;
  const theme = useTheme();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerShown: false,
    })
  }, []);

  const handleAvatarEditClicked = () => {
  }

  const handleFieldPressed = (field: keyof ProfileStackNavigationParamList) => () => {
    navigation.navigate(field as any, {
      id: user?.id,
    });
  };

  return (
    <View style={globalStyles.container}>
      <View style={stylesheet.avatarHolder}>
        <Avatar.Image
          onTouchEnd={handleAvatarEditClicked}
          size={100}
          style={{
            marginVertical: 30,
            marginLeft: 10
          }}
        />
        <IconButton
          onPress={handleAvatarEditClicked}
          icon={'pencil'}
          color={theme.colors.surface}
          style={[stylesheet.avatarEditButton, { backgroundColor: theme.colors.onSurface }]}
        />
      </View>
      <ReadOnlyTextField
        content={user?.fullName || 'N/A'}
        onPress={handleFieldPressed('Name')}
        label="Full Name"
      />
      <ReadOnlyTextField
        content={user?.email || 'N/A'}
        label="Email"
      />
      <ReadOnlyTextField
        content={user?.contact || 'N/A'}
        onPress={handleFieldPressed('Contact')}
        label="Contact Number"
      />
      <ReadOnlyTextField
        content={user?.address || 'N/A'}
        onPress={handleFieldPressed('Address')}
        label="Residing Address"
      />
    </View>
  )
};
