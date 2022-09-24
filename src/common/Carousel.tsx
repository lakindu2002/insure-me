import React, { FC, useCallback } from 'react';
import CarouselComponent from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import { Image } from './Image';

interface CarouselProps {
  data: any[];
  type: 'image'
}

// dynamically adjust slider width and height based on device screen size.
export const SLIDER_WIDTH = Dimensions.get('window').width - 20;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

export const Carousel: FC<CarouselProps> = ({ data, type }) => {

  const handleRender = useCallback((item: any) => {
    if (type === 'image') {
      const { item: url } = item as { item: string, index: number };
      return (
        <Image source={{ uri: url }} style={{ width: ITEM_WIDTH, height: 200, borderRadius: 10 }} />
      )
    }
    return (
      <>
      </>
    )
  }, [type]);

  return (
    <CarouselComponent
      vertical={false}
      layout="default"
      layoutCardOffset={9}
      data={data}
      renderItem={handleRender}
      sliderWidth={SLIDER_WIDTH}
      itemWidth={ITEM_WIDTH}
    />
  );
};
