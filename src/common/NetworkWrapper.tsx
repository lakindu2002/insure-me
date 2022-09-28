import { FC, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useIsConnected } from 'react-native-offline';

interface NetworkWrapperProps {
  children: React.ReactNode;
}

export const NetworkWrapper: FC<NetworkWrapperProps> = ({ children }) => {
  const isConnected = useIsConnected();
  const [isOffline, setIsOffline] = useState<boolean>(false);
  useEffect(() => {
    if (isConnected === false) {
      setIsOffline(true);
      ToastAndroid.show('Internet connection lost. Data will sync back when connection restores.', ToastAndroid.LONG);
      return;
    }
    if (isOffline && isConnected) {
      setIsOffline(false);
      ToastAndroid.show('Your internet connect has been restored.', ToastAndroid.LONG);
    }
  }, [isConnected]);
  return (
    <>{children}</>
  );
};
