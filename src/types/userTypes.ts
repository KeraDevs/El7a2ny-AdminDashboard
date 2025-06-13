import { ColumnVisibility, SortConfig } from "@/app/(dashboard)/users/page";
import { Vehicle } from "./vehicleTypes";
import { User as FirebaseUser } from "firebase/auth";

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

// Define user data interface for authentication context
export interface UserData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  type?: string;
  [key: string]: unknown; // Allow additional properties
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

export interface UsersTableProps {
  loading: boolean;
  paginatedUsers: User[];
  columnVisibility: ColumnVisibility;
  sortConfig: SortConfig;
  handleSort: (key: keyof User) => void;
  selectedUsers: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectUser: (userId: string) => void;
  handleEdit: (user: User) => void;
  handleView: (user: User) => void;
  searchQuery: string;
  users: User[];
  onDelete: () => void;
}

export interface UsersPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  filteredUsers: User[];
  selectedUsers: string[];
}

export interface AddUserDialogProps {
  onAddUser: (userData: Partial<User>) => Promise<void>;
}

export interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: Partial<User>;
  setUserData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  onSave: () => Promise<void>;
  loading?: boolean;
}

export interface AuthContextValue {
  currentUser: FirebaseUser | null;
  userType: "customer" | "workshopAdmin" | "worker" | "superadmin" | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  clearError: () => void;
  isAuthorized: boolean;
  authInitialized: boolean;
}

export interface UsersTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  onAddUser: (userData: Partial<User>) => Promise<void>;
  refreshData?: () => Promise<void>;
}

export interface ViewUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: User | null;
  onEdit: () => void;
}
