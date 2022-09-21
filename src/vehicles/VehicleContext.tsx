import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { Vehicle } from './Vehicle.type';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useToast } from 'react-native-toast-notifications';
import { useAuth } from '@insureme/auth/AuthContext';

const vehicleRef = firestore().collection('vehicles');
const storageRef = storage();

type VehicleContextType = {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (vehicleId: string) => Promise<void>;
  getVehicles: () => Promise<void>;
  loading: boolean;
};

const VehicleContext = createContext<VehicleContextType>({
  vehicles: [],
  addVehicle: () => Promise.resolve(),
  removeVehicle: () => Promise.resolve(),
  getVehicles: () => Promise.resolve(),
  loading: false
});

interface VehiclesProviderProps {
  children: React.ReactNode;
}

export const VehiclesProvider: FC<VehiclesProviderProps> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempUrlVehicleImage, setTempUrlVehicleImage] = useState<string>('');
  const toast = useToast();
  const { user } = useAuth();

  const addVehicle = async (partialVehicle: Partial<Vehicle>): Promise<void> => {
    const timestamp = firestore.Timestamp.fromDate(new Date()).toMillis();
    const newVehicle: Vehicle = { ...partialVehicle as Vehicle, createdAt: timestamp, updatedAt: timestamp, owner: user?.id || '' };
    let url = tempUrlVehicleImage;
    // upload file to firestore
    if (!tempUrlVehicleImage) {
      const vehicleStoragePoint = storageRef.ref(`vehicles/${newVehicle.chassisNumber}`);
      const resp = await vehicleStoragePoint.list({
        maxResults: 1
      })
      if (resp.items.length === 0) {
        // no temp url present, upload file
        await vehicleStoragePoint.putFile(partialVehicle.pictureUrl || '');
        url = await vehicleStoragePoint.getDownloadURL();
        setTempUrlVehicleImage(url);
      }
    }
    await vehicleRef.doc(newVehicle.chassisNumber).set({ ...newVehicle, pictureUrl: url });
    setTempUrlVehicleImage('');
    setVehicles([...vehicles, newVehicle]);
  };

  const removeVehicle = async (chassisNumber: string) => {
    try {
      await vehicleRef.doc(chassisNumber).delete();
      const updatedVehicles = vehicles.filter(vehicle => vehicle.chassisNumber !== chassisNumber);
      setVehicles(updatedVehicles);
      toast.show('Vehicle deleted successfully', { type: 'success' });
    } catch (err) {
      toast.show('Error removing vehicle', { type: 'danger' });
    }
  };

  /**
   * Does not paginate as a customer will not own more than 10 vehicles.
   */
  const getVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const snapshot = await vehicleRef.where('owner', '==', user?.id).get();
      if (snapshot.empty) {
        setVehicles([]);
      } else {
        const parsedVehicles = snapshot.docs.map((doc) => doc.data() as Vehicle);
        setVehicles(parsedVehicles);
      }
    } catch (err) {
      toast.show('Error getting vehicles', { type: 'danger' });
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        removeVehicle,
        getVehicles,
        loading
      }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => useContext(VehicleContext);
