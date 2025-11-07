import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  ios: 'http://localhost:5001',
  android: 'http://10.0.2.2:5001',
});

export const API_URL = `${BASE_URL}/api`;

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data;
};

export const signupUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Signup failed');
  }
  
  return data;
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to get user');
  }
  
  return data;
};
