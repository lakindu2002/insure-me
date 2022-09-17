import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { ProfileItemEditScreen } from './ProfileItemEditScreen';
import { ProfileScreen } from './ProfileScreen';

export type ProfileStackNavigationParamList = {
  Name: {
    id: string;
  };
  Contact: {
    id: string;
  };
  Address: {
    id: string;
  }
  View: undefined;
};

const ProfileNavigation = createNativeStackNavigator<ProfileStackNavigationParamList>();

const ProfileNavigator: FC = () => {
  return (
    <ProfileNavigation.Navigator
      initialRouteName='View'
      screenOptions={{ presentation: 'modal', headerShown: true }}>
      <ProfileNavigation.Screen name="Name" component={ProfileItemEditScreen}
        options={{
          headerTitle: 'Edit Full Name'
        }}
      />
      <ProfileNavigation.Screen name="Contact"
        options={{
          headerTitle: 'Edit Contact Number'
        }}
        component={ProfileItemEditScreen} />
      <ProfileNavigation.Screen name='Address'
        options={{
          headerTitle: 'Edit Residential Address'
        }}
        component={ProfileItemEditScreen} />
      <ProfileNavigation.Screen name="View"
        options={{
          headerTitle: 'Profile'
        }}
        component={ProfileScreen}
      />
    </ProfileNavigation.Navigator>
  );
};

export default ProfileNavigator;
