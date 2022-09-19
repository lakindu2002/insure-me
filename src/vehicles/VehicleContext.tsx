import { createContext, FC, useContext, useState } from 'react';
import { Vehicle } from './Vehicle.type';

type VehicleContextType = {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => Promise<void>;
  removeVehicle: (vehicleId: string) => Promise<void>;
  getVehicles: () => Promise<void>;
};

const VehicleContext = createContext<VehicleContextType>({
  vehicles: [],
  addVehicle: () => Promise.resolve(),
  removeVehicle: () => Promise.resolve(),
  getVehicles: () => Promise.resolve(),
});

interface VehiclesProviderProps {
  children: React.ReactNode;
}

export const VehiclesProvider: FC<VehiclesProviderProps> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const addVehicle = async (vehicle: Vehicle) => { };

  const removeVehicle = async (vehicleId: string) => { };

  const getVehicles = async () => { };
  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        removeVehicle,
        getVehicles,
      }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => useContext(VehicleContext);
