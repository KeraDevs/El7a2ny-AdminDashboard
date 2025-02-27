import { User as FirebaseAuthUser } from "firebase/auth";
import { User } from "./userTypes";

export interface LoginFormProps {
  onLoginSuccess: (authUser: FirebaseAuthUser, user: User) => void;
}

export interface AuthContextType {
  authUser: FirebaseAuthUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export interface AuthState {
  authUser: FirebaseAuthUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface FirebaseRegistrationData {
  email: string;
  password: string;
}
