import { useActionSheet } from '@expo/react-native-action-sheet';
import { useMemo, useState } from 'react';
import { useTheme } from 'react-native-paper';
import { openCamera, openImagePicker } from '@insureme/common/ImagePickerService';
import { Image } from 'react-native-image-crop-picker';

export const useCamera = (maxImages: number) => {
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const [images, setImages] = useState<Image[]>([]);

  const photoActionSheetOptions: any = useMemo(
    () => ({
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
      },
      title: 'Select or take a photo',
    }),
    [theme],
  );

  const launchPhotoSelection = () => {
    showActionSheetWithOptions(
      photoActionSheetOptions,
      async (index: number | undefined) => {
        try {
          if (index === 0) {
            // launch camera
            const file = (await openCamera(maxImages)) as Image;
            setImages([file]);
          } else if (index === 1) {
            // launch gallery
            const file = (await openImagePicker(maxImages)) as Image;
            setImages([file]);
          }
        } catch (err) { }
      },
    );
  };

  return {
    launchPhotoSelection,
    images,
  };
};
