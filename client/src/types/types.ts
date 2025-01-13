export interface Car {
  id: string;
  userId: string;
  licensePlate: string;
  vinNumber: string;
  createdAt: string;
  updatedAt: string;
}

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
  cars: Car[];
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
}
export interface Workshop {
  id: string;
  parentId: string | null;
  ownerId: string;
  name: string;
  address: string;
  email: string;
  latitude: number;
  longitude: number;
  profilePic: string | null;
  isActive: boolean;
  status: "Busy" | "Open" | "Closed";
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
}

export interface ApiWorkshopsList {
  id: string;
  parent_id: string | null;
  owner_id: string;
  name: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  profile_pic: string | null;
  is_active: boolean;
  status: "Busy" | "Open" | "Closed";
  created_at: string;
  updated_at: string;
  parent: string | null;
  users: User[];
  phone_numbers: PhoneNumber[];
  services: string[];
  ratings: number;
  totalReviews: number;
}

export interface PhoneNumber {
  phone_number: string;
  type: "MOBILE" | string;
  is_primary: boolean;
  is_verified: boolean;
}

export interface AssignOwnerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (userId: string) => void;
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
