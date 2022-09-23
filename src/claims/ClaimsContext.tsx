import React, { createContext, FC, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { Claim, ClaimStatus } from './Claim.type';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { useToast } from 'react-native-toast-notifications';

const claimRef = firestore().collection('claims');

interface State {
  claims: Claim[],
  selectedClaimStatus: ClaimStatus,
  claimsLoading: boolean,
}

const initialState: State = {
  claims: [],
  selectedClaimStatus: ClaimStatus.PENDING,
  claimsLoading: false,
}

interface ClaimsContextType extends State {
  updateSelectedClaimStatus: (status: ClaimStatus) => void;
};

const ClaimsContext = createContext<ClaimsContextType>({
  ...initialState,
  updateSelectedClaimStatus: () => { },
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

type Action = UPDATE_SELECTED_CLAIM_STATUS_ACTION | UPDATE_LOADING_CLAIMS_ACTION | SET_CLAIMS_ACTION;

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

  return (
    <ClaimsContext.Provider value={{
      claims: state.claims,
      selectedClaimStatus: state.selectedClaimStatus,
      updateSelectedClaimStatus,
      claimsLoading: state.claimsLoading
    }}>
      {children}
    </ClaimsContext.Provider>
  );
};

export const useClaims = () => useContext(ClaimsContext);
