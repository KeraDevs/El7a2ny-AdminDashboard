import { Vehicle } from "./vehicleTypes";
import { CarBrand } from "./carTypes";

// Define interfaces for workshop-related data
export interface WorkshopBranch {
  id: string;
  parent_id: string;
  name: string;
  address: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OperatingHour {
  id: string;
  workshop_id: string;
  day: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkshopWorker {
  id: string;
  user_id: string;
  workshop_id: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_pic: string | null;
  };
}

export interface ApiResponse {
  total: boolean;
  hasMore: boolean;
  users: ApiUser[];
  message?: string;
  status?: number;
  workshops: ApiWorkshopsList[];
}

export interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  national_id: string;
  profile_pic?: string;
  gender: string;
  type: string;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

export interface ApiWorkshopsList {
  id: string;
  parent_id: string | null;
  owner_id: string;
  name: string;
  address: string;
  latitude: string; // Backend sends as string
  longitude: string; // Backend sends as string
  profile_pic: string | null;
  active_status: "pending" | "active" | "deactivated";
  status: "Open" | "Busy" | "Closed";
  created_at: string;
  updated_at: string;
  car_regionsId: string | null;
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
  branches: WorkshopBranch[];
  phone_numbers: {
    id: string;
    workshop_id: string;
    phone_number: string;
    type: string;
    is_primary: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  }[];
  operating_hours: {
    id: string;
    workshop_id: string;
    day: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
    created_at: string;
    updated_at: string;
  }[];
  workers: WorkshopWorker[];
  supported_brands: CarBrand[];
  labels: {
    workshop_id: string;
    label_id: string;
    created_at: string;
    label: {
      id: string;
      name: string;
      created_at: string;
      updated_at: string;
    };
  }[];
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
