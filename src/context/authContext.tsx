import React, {createContext, useEffect, useReducer} from 'react';
import cafeApi from '../api/cafeApi';
import {
  Usuario,
  LoginResponse,
  LoginData,
  RegisterData,
} from '../types/appInterfaces';
import {authReducer, AuthState} from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  singUp: (registerData: RegisterData) => void;
  signIn: (loginData: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
};

const initialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    // traer el token del storage (que se persistio)
    const token = await AsyncStorage.getItem('token');

    // no hay token, no esta autenticado
    if (!token) {
      dispatch({type: 'notAuthenticated'});
    }

    // hay token
    const {data} = await cafeApi.get('/auth');

    await AsyncStorage.setItem('token', data.token);

    dispatch({
      type: 'signUp',
      payload: {token: data.token, user: data.usuario},
    });
  };

  const signIn = async ({correo, password}: LoginData) => {
    try {
      const {data} = await cafeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });
      dispatch({
        type: 'signUp',
        payload: {token: data.token, user: data.usuario},
      });

      //guardar el token de manera persistente
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Informacion incorrecta',
      });
    }
  };

  const singUp = async ({nombre, correo, password}: RegisterData) => {
    try {
      const {data} = await cafeApi.post<LoginResponse>('/usuarios', {
        nombre,
        correo,
        password,
      });
      dispatch({
        type: 'signUp',
        payload: {token: data.token, user: data.usuario},
      });

      //guardar el token de manera persistente
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Revise los datos',
      });
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'logout'});
  };

  const removeError = () => {
    dispatch({type: 'removeError'});
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        singUp,
        signIn,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
