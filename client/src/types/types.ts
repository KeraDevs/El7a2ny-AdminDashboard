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
  phone: string;
  nationalNumber: string;
  profilePic: string;
  gender: "Male" | "Female" | "Other";
  userType: "customer" | "workshopAdmin" | "worker" | "superadmin";
  labels: string[];
  isActive: boolean;
  cars: any[];
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  fullName: string;
  national_id: string;
  phone: string;
  profile_pic: string | null;
  gender: string;
  type: string;
  created_at: string;
  updated_at: string;
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
}

export interface UseUsersReturn {
  users: User[];
  selectedUsers: string[];
  loading: boolean;
  error: string | null;
  editingUser: User | null;
  openUserDialog: boolean;
  fetchUsers: () => Promise<void>;
  handleAddUser: (userData: Partial<User>) => Promise<void>;
  handleEditUser: (userData: Partial<User>) => Promise<void>;
  handleDeleteUsers: () => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectUser: (userId: string) => void;
  setEditingUser: (user: User | null) => void;
  setOpenUserDialog: (open: boolean) => void;
  setError: (error: string | null) => void;
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
