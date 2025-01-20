import { User } from "firebase/auth";

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
