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
  owner_id: string;
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

export type WorkshopColumnVisibility = {
  name: boolean;
  email: boolean;
  address: boolean;
  phone: boolean;
  status: boolean;
  ratings: boolean;
  services: boolean;
  createdDate?: boolean;
};

export type SortConfig = {
  key: keyof Workshop | null;
  direction: "asc" | "desc";
};

export interface WorkshopsTableProps {
  loading: boolean;
  paginatedWorkshops: Workshop[];
  columnVisibility: WorkshopColumnVisibility;
  sortConfig: SortConfig;
  handleSort: (key: keyof Workshop) => void;
  selectedWorkshops: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectWorkshop: (workshopId: string) => void;
  handleEdit: (workshop: Workshop) => void;
  handleView: (workshop: Workshop) => void;
  searchQuery: string;
  workshops: Workshop[];
  onDelete: () => void;
}

export type ColumnVisibility = {
  name: boolean;
  description: boolean;
  category: boolean;
  price: boolean;
  percentage: boolean;
  active: boolean;
  createdAt: boolean;
  email: boolean;
  address: boolean;
  phone: boolean;
  status: boolean;
  ratings: boolean;
  services: boolean;
  createdDate?: boolean;
};
