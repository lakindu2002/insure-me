import { createContext, FC, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { Vehicle } from './Vehicle.type';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useToast } from 'react-native-toast-notifications';
import { useAuth } from '@insureme/auth/AuthContext';

const vehicleRef = firestore().collection('vehicles');
const storageRef = storage();

interface State {
  vehicles: Vehicle[];
  loading: boolean;
}

const initialState: State = {
  vehicles: [],
  loading: false,
}

interface VehicleContextType extends State {
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (vehicleId: string) => Promise<void>;
  getVehicles: () => Promise<void>;
};

const VehicleContext = createContext<VehicleContextType>({
  ...initialState,
  addVehicle: () => Promise.resolve(),
  removeVehicle: () => Promise.resolve(),
  getVehicles: () => Promise.resolve(),
});

interface VehiclesProviderProps {
  children: React.ReactNode;
}

type ADD_VEHICLE_ACTION = {
  type: 'ADD_VEHICLE';
  payload: Vehicle;
}

type REMOVE_VEHICLE_ACTION = {
  type: 'REMOVE_VEHICLE';
  payload: string;
}

type SET_VEHICLES_ACTION = {
  type: 'SET_VEHICLES';
  payload: Vehicle[];
}

type VEHICLES_LOADING_ACTION = {
  type: 'VEHICLES_LOADING';
  payload: boolean;
}

type Action = ADD_VEHICLE_ACTION | REMOVE_VEHICLE_ACTION | SET_VEHICLES_ACTION | VEHICLES_LOADING_ACTION;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_VEHICLE':
      return {
        ...state,
        vehicles: [...state.vehicles, action.payload],
      }
    case 'REMOVE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle.chassisNumber !== action.payload),
      }
    case 'SET_VEHICLES':
      return {
        ...state,
        vehicles: action.payload,
      }
    case 'VEHICLES_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state;
  }
}

export const VehiclesProvider: FC<VehiclesProviderProps> = ({ children }) => {
  const [tempUrlVehicleImage, setTempUrlVehicleImage] = useState<string>('');
  const toast = useToast();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

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
    dispatch({ type: 'ADD_VEHICLE', payload: newVehicle });
  };

  const removeVehicle = async (chassisNumber: string) => {
    try {
      await vehicleRef.doc(chassisNumber).delete();
      dispatch({ type: 'REMOVE_VEHICLE', payload: chassisNumber });
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
      dispatch({ type: 'SET_VEHICLES', payload: [] });
      dispatch({ type: 'VEHICLES_LOADING', payload: true });
      const snapshot = await vehicleRef.where('owner', '==', user?.id).get();
      if (!snapshot.empty) {
        const parsedVehicles = snapshot.docs.map((doc) => doc.data() as Vehicle);
        dispatch({ type: 'SET_VEHICLES', payload: parsedVehicles });
      }
    } catch (err) {
      toast.show('Error getting vehicles', { type: 'danger' });
    } finally {
      dispatch({ type: 'VEHICLES_LOADING', payload: false });
    }
  }, []);


  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  return (
    <VehicleContext.Provider
      value={{
        vehicles: state.vehicles,
        addVehicle,
        removeVehicle,
        getVehicles,
        loading: state.loading,
      }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => useContext(VehicleContext);
