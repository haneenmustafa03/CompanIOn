import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Platform } from "react-native";

const API_BASE_URL = Platform.select({
  ios: "http://localhost:5001/api",
  android: "http://10.0.2.2:5001/api",
  default: "http://localhost:5001/api",
});

interface User {
  _id: string;
  email: string;
  name: string;
  accountType: "parent" | "child";
  age?: number;
  parentEmail?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  accountType: "parent" | "child";
  age?: number;
  parentEmail?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        // Verify token by fetching user data
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setToken(storedToken);
            setUser(data.user);
            return;
          }
        }
        // Token is invalid, clear it
        await AsyncStorage.removeItem("authToken");
      }
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Auth check error:", error);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        setToken(data.token);
        setUser(data.user);

        // Redirect based on account type
        if (data.user.accountType === "parent") {
          router.replace("/(tabs)/parentHome");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (data.success && data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        setToken(data.token);
        setUser(data.user);
        router.replace("/(tabs)");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
