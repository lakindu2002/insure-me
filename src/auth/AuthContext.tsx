import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { User, UserRole } from './User.type';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usersCollection = firestore().collection('users');

const darkModeLocalKey = 'darkMode';

type AuthContextType = {
  user: User | undefined;
  createUser: (email: string, fullName: string, role: UserRole, password: string) => Promise<void>;
  updateUser: (userId: string, user: Partial<User>) => Promise<void>;
  updateProfilePicture: (userId: string, filePath: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateNicPhoto: (userId: string, filePath: string) => Promise<void>;
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
  updateProfilePicture: () => Promise.resolve(),
  updateNicPhoto: () => Promise.resolve(),
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
  const [profilePhotoUploaded, setProfilePhotoUploaded] = useState<boolean>(false);
  const [nicUploaded, setNicUploaded] = useState<boolean>(false);

  useEffect(() => {
    const loadMode = async () => {
      const darkMode = await AsyncStorage.getItem(darkModeLocalKey) || 'false';
      setUser((prevUser) => prevUser ? { ...prevUser, preferredMode: darkMode === 'true' ? 'dark' : 'light' } : { preferredMode: darkMode === 'true' ? 'dark' : 'light' } as User);
    }
    loadMode();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setUser(undefined);
        setInitializing(false);
        return;
      }
      const userInfoResp = await loadUserInformationById(user.uid);
      const userInfo = userInfoResp.data() as User;
      setUser(userInfo); // if the color mode changed from another device, sync it here.
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
      preferredMode: Appearance.getColorScheme() as 'light' | 'dark',
    }
    await usersCollection.doc(firebaseAuthCreateResp.user.uid).set(user)
  };

  const updateUser = async (userId: string, patchAttr: Partial<User>) => {
    if (patchAttr.preferredMode) {
      await AsyncStorage.setItem(darkModeLocalKey, patchAttr.preferredMode === 'dark' ? 'true' : 'false');
    }
    await usersCollection.doc(userId).update({ ...patchAttr });
    setUser({ ...user, ...(patchAttr as User) });
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

  const updateProfilePicture = async (userId: string, filePath: string) => {
    const path = `profilePictures/${userId}`;
    const ref = storage().ref(path);
    if (!profilePhotoUploaded) {
      await ref.putFile(filePath);
      setProfilePhotoUploaded(true);
    }
    const url = await ref.getDownloadURL();
    await usersCollection.doc(userId).update({ profilePictureUrl: url });
    setUser({ ...user as User, profilePictureUrl: url });
    setProfilePhotoUploaded(false);
  }

  const updateNicPhoto = async (userId: string, filePath: string) => {
    const path = `nic/${userId}`;
    const ref = storage().ref(path);
    if (!nicUploaded) {
      await ref.putFile(filePath);
      setNicUploaded(true);
    }
    const url = await ref.getDownloadURL();
    await usersCollection.doc(userId).update({ nicImageUrl: url });
    setUser({ ...user as User, nicImageUrl: url });
    setNicUploaded(false);
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
        initializing,
        updateProfilePicture,
        updateNicPhoto
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer;