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
import toast from "react-hot-toast";

import { AuthContextValue } from "@/types/userTypes";
type UserType = "workshopAdmin" | "superadmin" | "worker" | "customer";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const router = useRouter();

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const USERS_ROUTE = process.env.NEXT_PUBLIC_USERS_ROUTE;

  // Fetch user details from the API
  const fetchUserDetails = async (userId: string, idToken: string) => {
    try {
      const response = await fetch(`${USERS_ROUTE}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          "x-api-key": API_KEY!,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Authentication failed: ${response.status}`);
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }

      const responseData = await response.json();
      const userData = responseData.user;

      if (!userData) {
        toast.error("User data not found");
        throw new Error("User data not found in API response");
      }

      const userType = userData.type?.toLowerCase() as UserType;
      return { userData, userType };
    } catch (error) {
      toast.error("Error fetching user details");
      throw error;
    }
  };

  // Verify login with backend
  const verifyLogin = async (user: FirebaseUser) => {
    try {
      const idToken = await user.getIdToken();
      const { userData, userType } = await fetchUserDetails(user.uid, idToken);

      if (userType !== "superadmin") {
        toast.error(
          "Access denied. Only superadmins can access this application."
        );
        throw new Error(
          "Access denied. Only superadmins can access this application."
        );
      }

      return { userData, userType };
    } catch (error) {
      // Error toast is already shown in fetchUserDetails
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);

        if (user) {
          try {
            const { userData, userType } = await verifyLogin(user);
            setUserType(userType);
            setUserData(userData);
            setIsAuthorized(true);

            if (window.location.pathname === "/login") {
              router.push("/dashboard");
            }
          } catch (error: any) {
            setError(error.message);
            // Toast is already shown in verifyLogin
            await signOut(auth);
            setIsAuthorized(false);
            router.push("/login");
          }
        } else {
          setUserType(null);
          setUserData(null);
          setIsAuthorized(false);

          if (window.location.pathname !== "/login") {
            router.push("/login");
          }
        }

        setLoading(false);
        setAuthInitialized(true);
      });

      return unsubscribe;
    }
  }, [router]);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const toastId = toast.loading("Signing in...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      try {
        const { userData, userType } = await verifyLogin(user);
        setUserType(userType);
        setUserData(userData);
        setIsAuthorized(true);

        toast.success("Signed in successfully!", { id: toastId });
        router.push("/dashboard");
      } catch (verifyError: any) {
        toast.error(verifyError.message, { id: toastId });
        await signOut(auth);
        setIsAuthorized(false);
        throw verifyError;
      }
    } catch (err: any) {
      let errorMsg = err.message || "Login failed";

      if (
        errorMsg.includes("auth/wrong-password") ||
        errorMsg.includes("auth/user-not-found") ||
        errorMsg.includes("auth/invalid-credential") ||
        errorMsg.includes("auth/invalid-email")
      ) {
        errorMsg = "Invalid email or password";
      } else if (errorMsg.includes("auth/too-many-requests")) {
        errorMsg = "Too many failed login attempts. Please try again later.";
      } else if (errorMsg.includes("auth/network-request-failed")) {
        errorMsg = "Network error. Please check your internet connection.";
      }

      setError(errorMsg);
      toast.error(errorMsg);
      setIsAuthorized(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google sign in
  const googleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const toastId = toast.loading("Signing in with Google...");

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      try {
        const { userData, userType } = await verifyLogin(user);
        setUserType(userType);
        setUserData(userData);
        setIsAuthorized(true);

        toast.success("Signed in successfully!", { id: toastId });
        router.push("/dashboard");
      } catch (verifyError: any) {
        toast.error(verifyError.message, { id: toastId });
        await signOut(auth);
        setIsAuthorized(false);
        throw verifyError;
      }
    } catch (err: any) {
      let errorMsg = err.message || "Google login failed";

      if (errorMsg.includes("auth/popup-closed-by-user")) {
        errorMsg = "Sign-in popup was closed before completion";
      } else if (errorMsg.includes("auth/popup-blocked")) {
        errorMsg = "Sign-in popup was blocked by your browser";
      }

      setError(errorMsg);
      toast.error(errorMsg);
      setIsAuthorized(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out
  const logOut = async () => {
    try {
      const toastId = toast.loading("Logging out...");
      await signOut(auth);
      setUserType(null);
      setUserData(null);
      setIsAuthorized(false);
      toast.success("Logged out successfully", { id: toastId });
      router.push("/login");
    } catch (err: any) {
      const errorMsg = "Logout failed";
      setError(errorMsg);
      toast.error(errorMsg);
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
    googleSignIn,
    logOut,
    clearError,
    isAuthorized,
    authInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
