"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase.config";
import { useRouter } from "next/navigation";

type UserType = "workshopAdmin" | "superadmin" | "worker" | "customer";

interface AuthContextValue {
  currentUser: FirebaseUser | null;
  userType: UserType | null;
  userData: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  // Fetch user type and data from backend
  const fetchUserTypeFromBackend = async (user: FirebaseUser) => {
    try {
      // Get the ID token from Firebase
      const idToken = await user.getIdToken();

      // Make a request to your backend to get user type and data
      const response = await fetch(
        "https://el7a2ny-backend-production.up.railway.app/auth/verify-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify user with backend");
      }

      const data = await response.json();
      return {
        userType: data.userType as UserType,
        userData: data.userData,
      };
    } catch (error) {
      console.error("Error fetching user type:", error);
      return {
        userType: null,
        userData: null,
      };
    }
  };

  useEffect(() => {
    // In Next.js, we need to ensure this only runs on the client side
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);

        if (user) {
          // User is signed in, fetch their type from backend
          const { userType, userData } = await fetchUserTypeFromBackend(user);
          setUserType(userType);
          setUserData(userData);

          // Only authorize if userType is superadmin
          const authorized = userType === "superadmin";
          setIsAuthorized(authorized);

          // Redirect to login if not authorized
          if (!authorized) {
            await signOut(auth); // Sign out unauthorized users
            setError(
              "Access denied. Only superadmins can access this application."
            );
            router.push("/login"); // Redirect to login page
          }
        } else {
          // User is signed out
          setUserType(null);
          setUserData(null);
          setIsAuthorized(false);
        }

        setLoading(false);
      });

      return unsubscribe;
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user type from backend
      const { userType, userData } = await fetchUserTypeFromBackend(user);
      setUserType(userType);
      setUserData(userData);

      // Check if user is superadmin
      if (userType !== "superadmin") {
        setError(
          "Access denied. Only superadmins can access this application."
        );
        await signOut(auth); // Sign out unauthorized users
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsAuthorized(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Fetch user type from backend
      const { userType, userData } = await fetchUserTypeFromBackend(user);
      setUserType(userType);
      setUserData(userData);

      // Check if user is superadmin
      if (userType !== "superadmin") {
        setError(
          "Access denied. Only superadmins can access this application."
        );
        await signOut(auth); // Sign out unauthorized users
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setIsAuthorized(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserType(null);
      setUserData(null);
      setIsAuthorized(false);
      router.push("/login");
    } catch {
      setError("Logout failed");
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextValue = {
    currentUser,
    userType,
    userData,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError,
    isAuthorized,
  };

  // In Next.js, we need to be careful about hydration issues
  return (
    <AuthContext.Provider value={value}>
      {(!loading || typeof window === "undefined") && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
