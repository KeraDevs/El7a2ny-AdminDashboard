import { User } from "firebase/auth";
import { Vehicle } from "./vehicleTypes";
import { PhoneNumber } from "./workshopTypes";

export interface ApiResponse {
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
