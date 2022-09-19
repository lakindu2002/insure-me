import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { FloatingActionButton } from '@insureme/common/FloatingActionButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, useLayoutEffect } from 'react';
import { ScrollView } from 'react-native';
import { ClaimNavigatorParamList } from './ClaimNavigator';

type ClaimListScreenNavigationProps = NativeStackScreenProps<ClaimNavigatorParamList, 'ClaimList'>;

interface ClaimListScreenProps extends ClaimListScreenNavigationProps { }

export const ClaimListScreen: FC<ClaimListScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  const handleOnNewClaimPressed = () => {
    console.log('new claim pressed');
  };

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      headerShown: false,
    })
  }, []);

  return (
    <>
      <ScrollView></ScrollView>
      {user?.role === UserRole.CUSTOMER && (
        <FloatingActionButton onPress={handleOnNewClaimPressed} />
      )}
    </>
  );
};
