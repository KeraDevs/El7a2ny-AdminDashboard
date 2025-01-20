import { Key } from "react";
import { ApiWorkshopsList, Vehicle } from "./types";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  nationalNumber: string;
  profilePic: string;
  gender: "male" | "female";
  userType: "customer" | "workshopAdmin" | "worker" | "superadmin";
  labels: string[];
  isActive: boolean;
  cars: Vehicle[];
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
}
export interface CreateUserData {
  first_name: string;
  last_name: string;
  national_id: string;
  phone: string;
  gender: string;
  type: string;
  profile_pic?: string;
  vehicle?: Vehicle;
}

export interface UserFormData extends Partial<User> {
  password?: string;
  vehicle?: Vehicle;
}
export interface AddUserFormProps {
  user?: User;
  onSubmit: (userData: Partial<User>) => void;
  onClose: () => void;
  loading?: boolean;
  open: boolean;
  isEdit: boolean;
}

export interface ApiUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  national_id: string;
  profile_pic?: string;
  gender: string;
  type: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    id: Key | null | undefined;
    turbo: boolean;
    exotic: boolean;
    brand_id: string;
    model: string;
    year: number;
    license_plate: string;
    vin_number: string;
    car_type: string;
  };
}
export interface ApiResponse {
  users: ApiUser[];
  message?: string;
  status?: number;
  workshops: ApiWorkshopsList[];
}

export interface ApiUserResponse {
  users: {
    password: string;
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    national_id: string;
    profile_pic: string | null;
    gender: string;
    type: string;
    created_at: string;
    updated_at: string;
    fullName: string;
  }[];
}

export interface UserFormProps {
  user?: User;
  onSubmit: (data: Partial<User>) => void;
  onClose: () => void;
  open: boolean;
  isEdit: boolean;
  loading?: boolean;
}

export interface UseUsersReturn {
  users: User[];
  selectedUsers: string[];
  loading: boolean;
  error: string | null;
  editingUser: User | null;
  openUserDialog: boolean;
  fetchUsers: () => Promise<void>;
  handleEditUser: (userData: Partial<User>) => Promise<void>;
  handleDeleteUsers: () => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectUser: (userId: string) => void;
  setEditingUser: (user: User | null) => void;
  setOpenUserDialog: (open: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface EditUserFormProps {
  user: User;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface AddUserFormErrors {
  userType: any;
  gender: any;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  nationalNumber?: string;
  vehicle?: {
    brand_id?: string;
    model?: string;
    license_plate?: string;
    vin_number?: string;
    year?: string;
    car_type?: string;
  };
  general?: string;
}
