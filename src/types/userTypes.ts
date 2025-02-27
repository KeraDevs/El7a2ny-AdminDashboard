import { Vehicle } from "./vehicleTypes";
export interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
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

export interface UserFormProps {
  user?: User;
  onSubmit: (data: Partial<User>) => void;
  onClose: () => void;
  open: boolean;
  isEdit: boolean;
  loading?: boolean;
}
export interface AddUserFormProps {
  user?: User;
  onSubmit: (userData: Partial<User>) => void;
  onClose: () => void;
  loading?: boolean;
  open: boolean;
  isEdit: boolean;
}
export interface EditUserFormProps {
  user: User;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}
