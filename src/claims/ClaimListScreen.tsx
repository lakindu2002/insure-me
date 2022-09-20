import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { FloatingActionButton } from '@insureme/common/FloatingActionButton';
import { FC } from 'react';
import { ScrollView } from 'react-native';

interface ClaimListScreenProps { }

export const ClaimListScreen: FC<ClaimListScreenProps> = ({ }) => {
  const { user } = useAuth();

  const handleOnNewClaimPressed = () => {
    console.log('new claim pressed');
  };

  return (
    <>
      <ScrollView></ScrollView>
      {user?.role === UserRole.CUSTOMER && (
        <FloatingActionButton onPress={handleOnNewClaimPressed} />
      )}
    </>
  );
};
