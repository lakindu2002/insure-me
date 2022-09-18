import { FC, useLayoutEffect } from 'react';
import { useAuth } from '@insureme/auth/AuthContext';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { globalStyles } from '@insureme/common/GlobalStyles';
import { Avatar, IconButton, useTheme } from 'react-native-paper';
import { ReadOnlyTextField } from '@insureme/common/ReadOnlyTextField';
import { ProfileStackNavigationParamList } from './ProfileNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import PermissionManager, { Permissions } from '@insureme/common/PermissionManager';
import { useToast } from 'react-native-toast-notifications';
import { openSettings } from 'react-native-permissions';

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
  const { user, updateProfilePicture } = useAuth();
  const { navigation } = props;
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerShown: false,
    })
  }, []);

  const handleProfileIconUpdateActionClicked = async (mode: 'picker' | 'camera') => {
    try {
      const isAuthorized = await PermissionManager.checkForRequest(mode === 'camera' ? Permissions.ANDROID.CAMERA : Permissions.ANDROID.READ_EXTERNAL_STORAGE);
      if (!isAuthorized) {
        ToastAndroid.show('Please enable camera and storage permissions to continue', ToastAndroid.LONG);
        await openSettings();
        return;
      }
      let resp = null;
      if (mode === 'camera') {
        resp = await ImageCropPicker.openCamera({
          mediaType: 'photo',
          cropping: true,
          forceJpg: true,
          maxFiles: 1,
          writeTempFile: true,
        })
      } else if (mode === 'picker') {
        resp = await ImageCropPicker.openPicker({
          mediaType: 'photo',
          cropping: true,
          forceJpg: true,
          maxFiles: 1,
          writeTempFile: true,
        })
      }
      if (resp === null) {
        return;
      }
      await updateProfilePicture(user?.id || '', resp.path);
    } catch (err) {
      console.log(err);
      if (((err as any)?.message || '').includes('User cancelled')) {
        return;
      }
      toast.show('Error updating profile picture', { type: 'danger' });
    }
  };

  const handleAvatarEditClicked = () => {
    showActionSheetWithOptions({
      options: ['Take Photo', 'Choose from Library', 'Cancel'],
      cancelButtonIndex: 2,
      title: 'Select a photo',
      titleTextStyle: {
        fontWeight: '700',
      },
      destructiveColor: theme.colors.error,
      destructiveButtonIndex: 2
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

  return (
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
