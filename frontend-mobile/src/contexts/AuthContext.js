import React, { createContext, useContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // In a real app, you would make an API call to your backend
      // const response = await api.post('/auth/login', { email, password });
      // const { token, user } = response.data;
      
      // For demo purposes, we'll simulate a successful login
      const token = 'demo-token'; // This would be from your API
      const user = { id: 1, name: 'Demo User', email, role: 'user' };
      
      await AsyncStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      
      return { success: false, message: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      // In a real app, you would make an API call to your backend
      // const response = await api.post('/auth/register', { name, email, password, role });
      
      dispatch({
        type: 'REGISTER_SUCCESS'
      });
      
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage
      });
      
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};