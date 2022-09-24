import React, { createContext, FC, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { AccidentType, Claim, ClaimStatus, ClaimVehicle } from './Claim.type';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { useToast } from 'react-native-toast-notifications';
import { getAccidentTypeName } from './Claim.util';

const claimRef = firestore().collection('claims');
const vehicleRef = firestore().collection('vehicles');
const claimsImagesRef = storage().ref('claims');

interface State {
  claims: Claim[],
  selectedClaimStatus: ClaimStatus,
  claimsLoading: boolean,
  accidentTypes: { label: string, value: string }[]
  claimVehicles: ClaimVehicle[]
  claimCreating: boolean
}

const initialState: State = {
  claims: [],
  selectedClaimStatus: ClaimStatus.PENDING,
  claimsLoading: false,
  accidentTypes: [],
  claimVehicles: [],
  claimCreating: false
}

interface ClaimsContextType extends State {
  updateSelectedClaimStatus: (status: ClaimStatus) => void;
  getVehicleAccidentTypes: () => void
  getClaimVehicles: () => Promise<void>,
  createClaim: (newClaim: Partial<Claim>) => Promise<boolean>
};

const ClaimsContext = createContext<ClaimsContextType>({
  ...initialState,
  updateSelectedClaimStatus: () => { },
  getVehicleAccidentTypes: () => { },
  getClaimVehicles: () => Promise.resolve(),
  createClaim: () => Promise.resolve(true)
});

interface ClaimsProviderProps {
  children: React.ReactNode;
}

type UPDATE_SELECTED_CLAIM_STATUS_ACTION = {
  type: 'UPDATE_SELECTED_CLAIM_STATUS';
  payload: ClaimStatus;
}

type UPDATE_LOADING_CLAIMS_ACTION = {
  type: 'UPDATE_LOADING_CLAIMS';
  payload: boolean;
}

type SET_CLAIMS_ACTION = {
  type: 'SET_CLAIMS';
  payload: Claim[];
}

type SET_VEHICLE_ACCIDENT_TYPES_ACTION = {
  type: 'SET_VEHICLE_ACCIDENT_TYPES';
  payload: { label: string, value: string }[];
}

type SET_CLAIM_VEHICLES = {
  type: 'SET_CLAIM_VEHICLES';
  payload: ClaimVehicle[];
}

type ADD_CLAIM = {
  type: 'ADD_CLAIM',
  payload: Claim
}

type SET_CLAIM_CREATING_ACTION = {
  type: 'SET_CLAIM_CREATING';
  payload: boolean;
}

type Action = UPDATE_SELECTED_CLAIM_STATUS_ACTION | UPDATE_LOADING_CLAIMS_ACTION | SET_CLAIMS_ACTION | SET_VEHICLE_ACCIDENT_TYPES_ACTION | SET_CLAIM_VEHICLES | ADD_CLAIM | SET_CLAIM_CREATING_ACTION;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_SELECTED_CLAIM_STATUS':
      return {
        ...state,
        selectedClaimStatus: action.payload,
      }
    case 'UPDATE_LOADING_CLAIMS':
      return {
        ...state,
        claimsLoading: action.payload,
      }
    case 'SET_CLAIMS':
      return {
        ...state,
        claims: action.payload,
      }
    case 'SET_VEHICLE_ACCIDENT_TYPES':
      return {
        ...state,
        accidentTypes: action.payload,
      }
    case 'SET_CLAIM_VEHICLES':
      return {
        ...state,
        claimVehicles: action.payload,
      }
    case 'ADD_CLAIM':
      return {
        ...state,
        claims: [...state.claims, action.payload]
      }
    case 'SET_CLAIM_CREATING':
      return {
        ...state,
        claimCreating: action.payload
      }
    default:
      return state;
  }
}

export const ClaimsProvider: FC<ClaimsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateSelectedClaimStatus = (status: ClaimStatus) => {
    dispatch({ type: 'UPDATE_SELECTED_CLAIM_STATUS', payload: status });
  }

  const loadClaimsByMode = useCallback(async (mode: 'restricted' | 'managing', userId: string) => {
    try {
      dispatch({ type: 'UPDATE_LOADING_CLAIMS', payload: true });
      dispatch({ type: 'SET_CLAIMS', payload: [] });
      let query = claimRef.where('status', '==', state.selectedClaimStatus);
      if (mode === 'managing') {
        if (state.selectedClaimStatus !== ClaimStatus.PENDING) {
          query = query.where('managerId', '==', userId).orderBy('time', 'desc');
        }
      } else {
        query = query.where('ownerId', '==', userId).orderBy('time', 'desc');
      }
      const data = await query.get();
      if (!data.empty) {
        const resp = data.docs.map((doc) => doc.data() as Claim);
        dispatch({ type: 'SET_CLAIMS', payload: resp });
      }
    } catch (err) {
      showToast('Error loading claims', { type: 'danger' });
    } finally {
      dispatch({ type: 'UPDATE_LOADING_CLAIMS', payload: false });
    }

  }, [state.selectedClaimStatus]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const { role } = user;
    if (role === UserRole.CLAIM_ADJUSTER) {
      // all pending, the claims that they've approved, rejected, or are processing
      loadClaimsByMode('managing', user?.id);
      return;
    }
    if (role === UserRole.CUSTOMER) {
      // all their claims
      loadClaimsByMode('restricted', user?.id);
    }
  }, [loadClaimsByMode]);

  const getVehicleAccidentTypes = useCallback(() => {
    const data = [
      { label: getAccidentTypeName(AccidentType.HEAD_ON), value: AccidentType.HEAD_ON },
      { label: getAccidentTypeName(AccidentType.HIT_AND_RUN), value: AccidentType.HIT_AND_RUN },
      { label: getAccidentTypeName(AccidentType.LOW_SPEED), value: AccidentType.LOW_SPEED },
      { label: getAccidentTypeName(AccidentType.REAR), value: AccidentType.REAR },
      { label: getAccidentTypeName(AccidentType.ROLLOVER), value: AccidentType.ROLLOVER },
      { label: getAccidentTypeName(AccidentType.SIDE_IMPACT), value: AccidentType.SIDE_IMPACT },
    ]
    dispatch({ type: 'SET_VEHICLE_ACCIDENT_TYPES', payload: data });
  }, []);

  const getClaimVehicles = useCallback(async () => {
    dispatch({ type: 'SET_CLAIM_VEHICLES', payload: [] });
    const snapshot = await vehicleRef.where('owner', '==', user?.id).get();
    if (!snapshot.empty) {
      const data = snapshot.docs.map((doc) => doc.data()).map((vehicle) => ({ brand: vehicle.brand, chassisNumber: vehicle.chassisNumber, licensePlate: vehicle.licensePlate, model: vehicle.model, pictureUrl: vehicle.pictureUrl }) as ClaimVehicle);
      dispatch({ type: 'SET_CLAIM_VEHICLES', payload: data });
    }
  }, []);

  const createClaim = useCallback(async (newClaim: Partial<Claim>) => {
    const timestamp = firestore.Timestamp.now().toMillis();
    const picturePathsToUpload = newClaim.pictures as string[];
    dispatch({ type: 'SET_CLAIM_CREATING', payload: true });
    try {
      const newDocumentRef = claimRef.doc();

      const claimId = newDocumentRef.id;
      // all or nothing
      const uploadedPictureUrls = await Promise.all(picturePathsToUpload.map(async (path, idx) => {
        const imageKey = `${claimId}/${idx}`;
        const imageRef = claimsImagesRef.child(imageKey);
        await imageRef.putFile(path);
        const url = await imageRef.getDownloadURL();
        return url;
      }));

      const claim: Claim = {
        id: claimId,
        accidentType: newClaim.accidentType as AccidentType,
        createdAt: timestamp,
        updatedAt: timestamp,
        expectedAmount: newClaim.expectedAmount as number,
        expectedCurrency: newClaim.expectedCurrency as string,
        location: newClaim.location as string,
        status: ClaimStatus.PENDING,
        time: newClaim.time as number,
        ownerId: user?.id as string,
        owner: {
          name: user?.fullName as string,
          nic: user?.nicImageUrl as string,
          phone: user?.contact as string,
        },
        pictures: uploadedPictureUrls,
        vehicle: newClaim.vehicle as ClaimVehicle,
      }
      await claimRef.doc(claimId).set(claim);
      dispatch({ type: 'ADD_CLAIM', payload: claim });
      return true;
    } catch (err) {
      showToast('Error creating claim', { type: 'danger' });
      return false;
    } finally {
      dispatch({ type: 'SET_CLAIM_CREATING', payload: false });
    }
  }, []);

  return (
    <ClaimsContext.Provider value={{
      claims: state.claims,
      selectedClaimStatus: state.selectedClaimStatus,
      updateSelectedClaimStatus,
      claimsLoading: state.claimsLoading,
      accidentTypes: state.accidentTypes,
      getVehicleAccidentTypes,
      claimVehicles: state.claimVehicles,
      getClaimVehicles,
      claimCreating: state.claimCreating,
      createClaim
    }}>
      {children}
    </ClaimsContext.Provider>
  );
};

export const useClaims = () => useContext(ClaimsContext);
