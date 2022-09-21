import React, { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { Claim, ClaimStatus } from './Claim.type';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@insureme/auth/AuthContext';
import { UserRole } from '@insureme/auth/User.type';
import { useToast } from 'react-native-toast-notifications';

const claimRef = firestore().collection('claims');

type ClaimsContextType = {
  claims: Claim[];
  selectedClaimStatus: ClaimStatus;
  updateSelectedClaimStatus: (status: ClaimStatus) => void;
  claimsLoading: boolean;
};

const ClaimsContext = createContext<ClaimsContextType>({
  claims: [],
  selectedClaimStatus: ClaimStatus.PENDING,
  updateSelectedClaimStatus: () => { },
  claimsLoading: false
});

interface ClaimsProviderProps {
  children: React.ReactNode;
}

export const ClaimsProvider: FC<ClaimsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaimStatus, setSelectedClaimStatus] = useState<ClaimStatus>(ClaimStatus.PENDING);
  const { show: showToast } = useToast();
  const [loadingClaims, setLoadingClaims] = useState<boolean>(false);

  const updateSelectedClaimStatus = (status: ClaimStatus) => {
    setSelectedClaimStatus(status);
  }

  const loadClaimsByMode = useCallback(async (mode: 'restricted' | 'managing', userId: string) => {
    try {
      setClaims([]);
      setLoadingClaims(true);
      let query = claimRef.where('status', '==', selectedClaimStatus);
      if (mode === 'managing') {
        if (selectedClaimStatus !== ClaimStatus.PENDING) {
          query = query.where('managerId', '==', userId).orderBy('time', 'desc');
        }
      } else {
        query = query.where('ownerId', '==', userId).orderBy('time', 'desc');
      }
      const data = await query.get();
      if (data.empty) {
        setClaims([]);
      } else {
        const resp = data.docs.map((doc) => doc.data() as Claim);
        setClaims(resp);
      }
    } catch (err) {
      showToast('Error loading claims', { type: 'danger' });
    } finally {
      setLoadingClaims(false);
    }

  }, [selectedClaimStatus]);

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
      claims,
      selectedClaimStatus,
      updateSelectedClaimStatus,
      claimsLoading: loadingClaims
    }}>
      {children}
    </ClaimsContext.Provider>
  );
};

export const useClaims = () => useContext(ClaimsContext);
