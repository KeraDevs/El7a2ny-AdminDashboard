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
  userType: "Customer" | "Admin" | "Staff";
  labels: string[];
  isActive: boolean;
  cars: Car[];
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
}

export interface ApiUser {
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
}

export interface ApiResponse {
  users: ApiUser[];
  message?: string;
  status?: number;
}
