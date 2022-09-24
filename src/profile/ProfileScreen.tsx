import { FC, useLayoutEffect, useState } from 'react';
import { useAuth } from '@insureme/auth/AuthContext';
import { ScrollView, StyleSheet, View } from 'react-native';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { Avatar, IconButton, Switch, Text, useTheme } from 'react-native-paper';
import { ReadOnlyField } from '@insureme/common/ReadOnlyField';
import { ProfileStackNavigationParamList } from './ProfileNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useToast } from 'react-native-toast-notifications';
import { UserRole } from '@insureme/auth/User.type';
import { openCamera, openImagePicker } from '@insureme/common/ImagePicker.service';
import { Image } from '@insureme/common/Image';

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
  const { user, updateProfilePicture, updateNicPhoto, updateUser } = useAuth();
  const { navigation } = props;
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const toast = useToast();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user?.preferredMode === 'dark');

  const handleModeChange = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await updateUser(user?.id || '', { preferredMode: newMode ? 'dark' : 'light' })
    } catch (err) {
      setIsDarkMode(!newMode);
    }
  }

  const photoActionSheetOptions: any = {
    options: ['Take Photo', 'Choose from Library', 'Cancel'],
    cancelButtonIndex: 2,
    titleTextStyle: {
      fontWeight: '700',
      color: theme.colors.text,
    },
    destructiveColor: theme.colors.error,
    destructiveButtonIndex: 2,
    containerStyle: {
      backgroundColor: theme.colors.background,
    },
    textStyle: {
      color: theme.colors.text,
    }
  }

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerShown: false,
    })
  }, []);

  const handleProfileIconUpdateActionClicked = async (mode: 'picker' | 'camera') => {
    try {
      let resp = null;
      if (mode === 'camera') {
        resp = await openCamera();
      } else if (mode === 'picker') {
        resp = await openImagePicker();
      }
      if (resp === null || !resp) {
        return;
      }
      await updateProfilePicture(user?.id || '', resp.path);
    } catch (err) {
      if (((err as any)?.message || '').includes('User cancelled')) {
        return;
      }
      toast.show('Error updating profile picture', { type: 'danger' });
    }
  };

  const handleAvatarEditClicked = () => {
    showActionSheetWithOptions({
      ...photoActionSheetOptions,
      title: 'Select or take a photo',
    }, async (buttonIndex) => {
      if (buttonIndex === 0) {
        // launch camera
        await handleProfileIconUpdateActionClicked('camera');
      } else if (buttonIndex === 1) {
        // launch gallery
        await handleProfileIconUpdateActionClicked('picker');
      }
    });
  }

  const handleFieldPressed = (field: keyof ProfileStackNavigationParamList) => () => {
    navigation.navigate(field as any, {
      id: user?.id,
    });
  };

  const handleNicUpdateActionClicked = async (mode: 'picker' | 'camera') => {
    try {
      let resp = null;
      if (mode === 'camera') {
        resp = await openCamera();
      } else if (mode === 'picker') {
        resp = await openImagePicker();
      }
      if (resp === null || !resp) {
        return;
      }
      await updateNicPhoto(user?.id || '', resp.path);
    } catch (err) {
      if (((err as any)?.message || '').includes('User cancelled')) {
        return;
      }
      toast.show('Error updating NIC picture', { type: 'danger' });
    }
  }

  const launchNicImagePicker = () => {
    showActionSheetWithOptions({
      ...photoActionSheetOptions,
      title: 'Select or take a photo of your NIC',
    }, async (buttonIndex) => {
      if (buttonIndex === 0) {
        // launch camera
        await handleNicUpdateActionClicked('camera');
      } else if (buttonIndex === 1) {
        // launch gallery
        await handleNicUpdateActionClicked('picker');
      }
    });
  }

  return (
    <ScrollView style={{
      backgroundColor: theme.colors.background,
    }}>
      <View style={globalStyles.container}>
        <View style={stylesheet.avatarHolder}>
          {user?.profilePictureUrl ? (
            <Avatar.Image
              onTouchEnd={handleAvatarEditClicked}
              source={{ uri: user?.profilePictureUrl || '' }}
              size={100}
              style={{
                marginVertical: 30,
                marginLeft: 10
              }}
            />
          ) : (
            <Avatar.Icon
              onTouchEnd={handleAvatarEditClicked}
              icon={'account'}
              size={100}
              style={{
                marginVertical: 30,
                marginLeft: 10
              }}
            />
          )}
          <IconButton
            onPress={handleAvatarEditClicked}
            icon={'pencil'}
            color={theme.colors.surface}
            style={[stylesheet.avatarEditButton, { backgroundColor: theme.colors.onSurface }]}
          />
        </View>
        <ReadOnlyField
          content={<>
            <View style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Switch
                color={theme.colors.primary}
                onValueChange={handleModeChange}
                value={isDarkMode}
              />
              <Text
                style={{
                  fontWeight: '700',
                }}
              >
                Dark Mode
              </Text>
            </View>
          </>
          }
          label="Preferences"
        />
        <ReadOnlyField
          content={user?.fullName || 'N/A'}
          onPress={handleFieldPressed('Name')}
          label="Full Name"
        />
        <ReadOnlyField
          content={user?.email || 'N/A'}
          label="Email"
        />
        <ReadOnlyField
          content={user?.contact || 'N/A'}
          onPress={handleFieldPressed('Contact')}
          label="Contact Number"
        />
        <ReadOnlyField
          content={user?.address || 'N/A'}
          onPress={handleFieldPressed('Address')}
          label="Residing Address"
        />
        {user?.role === UserRole.CUSTOMER && (
          <ReadOnlyField
            onPress={launchNicImagePicker}
            label='National Identity Card'
            content={user?.nicImageUrl ? <Image
              source={{ uri: user?.nicImageUrl || '' }}
            /> : 'Not Uploaded'}
          />
        )}
      </View >
    </ScrollView>
  )
};
