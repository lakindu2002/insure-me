import { FC } from 'react';
import { View } from 'react-native';

interface CustomerDashboardScreenProps { }

export const CustomerDashboardScreen: FC<CustomerDashboardScreenProps> = (props) => {
  console.log('CustomerDashboardScreen', props);
  return (
    <>
      <View>
      </View>
    </>
  );
};
