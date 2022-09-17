import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { User, UserRole } from './User.type';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('users');

type AuthContextType = {
  user: User | undefined;
  createUser: (email: string, fullName: string, role: UserRole, password: string) => Promise<void>;
  updateUser: (userId: string, user: Partial<User>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  initializing: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  createUser: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
  login: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  initializing: true,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const loadUserInformationById = async (userId: string) => {
  return await usersCollection.doc(userId).get({ source: 'default' });
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setUser(undefined);
        setInitializing(false);
        return;
      }
      const userInfoResp = await loadUserInformationById(user.uid);
      const userInfo = userInfoResp.data() as User;
      setUser(userInfo);
      setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const createUser = async (email: string, fullName: string, role: UserRole, password: string) => {
    const firebaseAuthCreateResp = await auth().createUserWithEmailAndPassword(email, password);
    const user: User = {
      id: firebaseAuthCreateResp.user?.uid,
      email,
      fullName,
      role,
    }
    await usersCollection.doc(firebaseAuthCreateResp.user.uid).set(user)
  };

  const updateUser = async (userId: string, patchAttr: Partial<User>) => {
    await usersCollection.doc(userId).update({ ...patchAttr });
  };

  const login = async (email: string, password: string) => {
    const loginResp = await auth().signInWithEmailAndPassword(email, password);
    // retieve user data from firestore, first hit server, else cache
    const userInfoResp = await loadUserInformationById(loginResp.user.uid);
    if (!userInfoResp.exists) {
      throw new Error('User not found');
    }
    const userInfo = userInfoResp.data() as User;
    setUser(userInfo);
  };

  const forgotPassword = async (email: string) => {
    await auth().sendPasswordResetEmail(email);
  }

  const logout = async () => {
    await auth().signOut();
    setUser(undefined);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        createUser,
        updateUser,
        login,
        forgotPassword,
        logout,
        initializing
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer;