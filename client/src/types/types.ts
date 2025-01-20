//Imports
import { User as FirebaseAuthUser } from "firebase/auth";
import { Key } from "react";

// Auth
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

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
export interface FirebaseRegistrationData {
  email: string;
  password: string;
}
export interface BackendUserData {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone: string;
  gender: string;
  type: string;
  profile_pic?: string;
  vehicle?: {
    brand_id: string;
    model: string;
    year: number;
    license_plate: string;
    vin_number: string;
    car_type: string;
  };
}

//Sidebar
export interface NavItem {
  text: string;
  icon: React.ReactNode | null;
}
export interface SidebarProps {
  drawerWidth: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isNonMobile: boolean;
}
//Navbar
export interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}
// Dashboard
export interface DashboardMetrics {
  totalUsers: number;
  activeWorkshops: number;
  pendingRequests: number;
  totalRevenue: string;
  completedServices: number;
  activeChats: number;
}
export interface RecentActivity {
  id: number;
  type: string;
  user: string;
  workshop: string;
  status: string;
  time: string;
}

export interface SalesData {
  day: string;
  amount: number;
  date: string;
}

export interface DetailedSalesData {
  currentWeek: {
    total: number;
    percentageChange: number;
    dailyData: SalesData[];
  };
  previousWeek: {
    total: number;
    dailyData: SalesData[];
  };
}

export interface SectionFooterProps {
  link: string;
}
export interface OSData {
  id: number;
  label: string;
  value: number;
  color: string;
}

// Users
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

export interface Vehicle {
  id: Key | null | undefined;
  brand_id: string;
  model: string;
  year: number;
  license_plate: string;
  vin_number: string;
  car_type: string;
  turbo: boolean;
  exotic: boolean;
}

export interface CarBrand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  brand_regions: Array<{
    id: string;
    brand_id: string;
    region_id: string;
    created_at: string;
    updated_at: string;
    region: {
      id: string;
      name: string;
      created_at: string;
      updated_at: string;
    };
  }>;
}

//Workshops
export interface Workshop {
  id: string;
  parentId: string | null;
  ownerId: string;
  name: string;
  address: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  profilePic: string | null;
  activeStatus: string;
  status: "Open" | "Busy" | "Closed";
  createdAt: string;
  updatedAt: string;
  users: User[];
  phoneNumbers: PhoneNumber[];
  services: string[];
  ratings: number;
  totalReviews: number;
  labels: string[];
}

export interface WorkshopFormProps {
  workshop?: Workshop;
  onSubmit: (data: Partial<Workshop>) => void;
  onClose: () => void;
  open: boolean;
}

export interface ApiWorkshopsList {
  apiWorkshop: User;
  services: never[];
  id: string;
  email: string;
  parent_id: string | null;
  owner_id: string;
  name: string;
  address: string;
  car_region: string;
  latitude: number | null;
  longitude: number | null;
  profile_pic: string | null;
  active_status: string;
  status: "Open" | "Busy" | "Closed";
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    national_id: string;
    phone: string;
    profile_pic: string | null;
    gender: string;
    type: string;
    created_at: string;
    updated_at: string;
  };
  parent: null;
  branches: any[];
  phone_numbers: PhoneNumber[];
  operating_hours: any[];
  workers: any[];
  supported_brands: any[];
  labels: string[];
}

export interface PhoneNumber {
  phone_number: string;
  type: "MOBILE" | string;
  is_primary: boolean;
  is_verified: boolean;
}

export interface Car {
  id: string;
  userId: string;
  licensePlate: string;
  vinNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignOwnerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (userId: string, userName: string) => void;
  currentOwnerId?: string;
}

export interface ApiUserResponse {
  users: {
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
export interface UseWorkshopsReturn {
  workshops: Workshop[];
  selectedWorkshops: string[];
  loading: boolean;
  error: string | null;
  editingWorkshop: Workshop | null;
  openWorkshopDialog: boolean;
  fetchWorkshops: () => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectWorkshop: (workshopId: string) => void;
  handleAddWorkShop: (workshopData: Partial<Workshop>) => Promise<void>;
  handleEditWorkshop: (workshopData: Partial<Workshop>) => Promise<void>;
  handleDeleteWorkshops: () => Promise<void>;
  setEditingWorkshop: React.Dispatch<React.SetStateAction<Workshop | null>>;
  setOpenWorkshopDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
