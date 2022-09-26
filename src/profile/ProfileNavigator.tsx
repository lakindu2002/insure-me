import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@insureme/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { IconButton, useTheme } from 'react-native-paper';
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

  const sheet = useActionSheet();
  const theme = useTheme();
  const navigation = useNavigation();
  const { logout } = useAuth();


  const handleAccountOptionsClick = () => {
    sheet.showActionSheetWithOptions({
      options: ['Logout', 'Cancel'],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      title: 'Account Options',
      containerStyle: {
        backgroundColor: theme.colors.background,
      },
      textStyle: {
        color: theme.colors.text,
      },
      titleTextStyle: {
        color: theme.colors.text,
      }
    }, async (buttonIndex) => {
      if (buttonIndex === 0) {
        await logout();
        (navigation as any).navigate('Login');
      }
    })
  }

  return (
    <ProfileNavigation.Navigator
      initialRouteName='View'
      screenOptions={({ route }) => ({
        presentation: 'modal', headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.text,
        ...route.name === 'View' && {
          headerRight: (props) => (
            <IconButton
              onPress={handleAccountOptionsClick}
              icon={'dots-vertical'}
            />
          )
        }
      })}>
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
