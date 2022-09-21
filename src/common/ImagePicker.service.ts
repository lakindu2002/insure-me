import { openSettings } from 'react-native-permissions';
import ImageCropPicker from 'react-native-image-crop-picker';
import PermissionManager, { Permissions } from './PermissionManager';
import { ToastAndroid } from 'react-native';

export const openCamera = async (maxFiles: number = 1) => {
  const isAuthorized = await PermissionManager.checkForRequest(
    Permissions.ANDROID.CAMERA,
  );
  if (!isAuthorized) {
    ToastAndroid.show(
      'Please provide camera permissions to continue',
      ToastAndroid.LONG,
    );
    await openSettings();
    return;
  }
  return await ImageCropPicker.openCamera({
    mediaType: 'photo',
    cropping: true,
    forceJpg: true,
    maxFiles,
    minFiles: maxFiles,
    writeTempFile: true,
  });
};

export const openImagePicker = async (maxFiles: number = 1) => {
  const isAuthorized = await PermissionManager.checkForRequest(
    Permissions.ANDROID.READ_EXTERNAL_STORAGE,
  );
  if (!isAuthorized) {
    ToastAndroid.show(
      'Please provide storage permissions to continue',
      ToastAndroid.LONG,
    );
    await openSettings();
    return;
  }
  return await ImageCropPicker.openPicker({
    mediaType: 'photo',
    cropping: true,
    forceJpg: true,
    maxFiles,
    minFiles: maxFiles,
    writeTempFile: true,
  });
};
