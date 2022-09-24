import React, { createContext, FC, useContext, useEffect, useReducer, useState } from 'react';
import { User, UserRole } from './User.type';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usersCollection = firestore().collection('users');

const darkModeLocalKey = 'darkMode';

interface State {
  user: User | undefined;
  initializing: boolean;
}

const initialState: State = {
  user: undefined,
  initializing: true,
}

interface AuthContextType extends State {
  createUser: (email: string, fullName: string, role: UserRole, password: string) => Promise<void>;
  updateUser: (userId: string, user: Partial<User>) => Promise<void>;
  updateProfilePicture: (userId: string, filePath: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateNicPhoto: (userId: string, filePath: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  createUser: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
  login: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  updateProfilePicture: () => Promise.resolve(),
  updateNicPhoto: () => Promise.resolve(),
});

type INITIALIZE_USER_ACTION = {
  type: 'INITIALIZE_USER';
  payload: User | undefined;
}

type UPDATE_USER_ACTION = {
  type: 'UPDATE_USER';
  payload: Partial<User>;
}

type CLEAR_USER_ACTION = {
  type: 'CLEAR_USER';
}

type INITIALIZING_USER_ACTION = {
  type: 'INITIALIZING_USER';
  payload: boolean;
}

type Action = INITIALIZE_USER_ACTION | UPDATE_USER_ACTION | CLEAR_USER_ACTION | INITIALIZING_USER_ACTION;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INITIALIZE_USER':
      return {
        ...state,
        user: action.payload,
        initializing: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: {
          ...state.user && { ...state.user },
          ...action.payload as User,
        },
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: undefined,
        initializing: false,
      }
    case 'INITIALIZING_USER':
      return {
        ...state,
        initializing: action.payload,
      }
    default:
      return state;
  }
}
interface AuthProviderProps {
  children: React.ReactNode;
}

const loadUserInformationById = async (userId: string) => {
  return await usersCollection.doc(userId).get({ source: 'default' });
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [profilePhotoUploaded, setProfilePhotoUploaded] = useState<boolean>(false);
  const [nicUploaded, setNicUploaded] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadMode = async () => {
      const darkMode = await AsyncStorage.getItem(darkModeLocalKey) || 'false';
      dispatch(
        {
          type: 'UPDATE_USER',
          payload: state.user ?
            { ...state.user, preferredMode: darkMode === 'true' ? 'dark' : 'light' }
            : { preferredMode: darkMode === 'true' ? 'dark' : 'light' }
        }
      );
    }
    loadMode();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (!user) {
        dispatch({ type: 'CLEAR_USER' });
      } else {
        const userInfoResp = await loadUserInformationById(user.uid);
        const userInfo = userInfoResp.data() as User;
        // if the color mode changed from another device, sync it here.
        dispatch({ type: 'INITIALIZE_USER', payload: userInfo });
      }
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
    dispatch({ type: 'UPDATE_USER', payload: patchAttr });
  };

  const login = async (email: string, password: string) => {
    const loginResp = await auth().signInWithEmailAndPassword(email, password);
    // retieve user data from firestore, first hit server, else cache
    const userInfoResp = await loadUserInformationById(loginResp.user.uid);
    if (!userInfoResp.exists) {
      throw new Error('User not found');
    }
    const userInfo = userInfoResp.data() as User;
    dispatch({ type: 'INITIALIZE_USER', payload: userInfo });
  };

  const forgotPassword = async (email: string) => {
    await auth().sendPasswordResetEmail(email);
  }

  const logout = async () => {
    await auth().signOut();
    dispatch({ type: 'CLEAR_USER' });
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
    dispatch({ type: 'UPDATE_USER', payload: { profilePictureUrl: url } });
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
    dispatch({ type: 'UPDATE_USER', payload: { nicImageUrl: url } });
    setNicUploaded(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        createUser,
        updateUser,
        login,
        forgotPassword,
        logout,
        initializing: state.initializing,
        updateProfilePicture,
        updateNicPhoto
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer;