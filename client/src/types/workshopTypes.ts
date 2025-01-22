import { User } from "./userTypes";

export interface Workshop {
  id: string;
  parentId: string | null;
  ownerId: string;
  name: string;
  users: User[];
  address: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  profilePic: string | null;
  active_status: "pending" | "active" | "deactivated";
  status: "open" | "busy" | "closed";
  createdAt: string;
  updatedAt: string;
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

export interface AssignOwnerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (userId: string, userName: string) => void;
  currentOwnerId?: string;
}

export interface PhoneNumber {
  phone_number: string;
  type: "MOBILE" | string;
  is_primary: boolean;
  is_verified: boolean;
}
