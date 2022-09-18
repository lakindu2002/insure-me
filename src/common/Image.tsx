import { FC } from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

interface ImageProps extends RNImageProps { }

export const Image: FC<ImageProps> = props => {
  const { source, style: customStyle } = props;
  return (
    <RNImage
      source={source}
      style={{ width: '100%', height: 200, borderRadius: 20, ...customStyle && { customStyle } }}
    />
  );
};
