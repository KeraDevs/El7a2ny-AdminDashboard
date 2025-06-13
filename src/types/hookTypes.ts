import { User } from "./userTypes";
import { Workshop } from "./workshopTypes";

export interface SelectionState<T> {
  selected: string[];
  loading: boolean;
  error: string | null;
  editing: T | null;
  openDialog: boolean;
}

export interface UseCrudReturn<T> extends SelectionState<T> {
  fetchItems: () => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelect: (id: string) => void;
  handleAdd?: (data: Partial<T>) => Promise<void>;
  handleEdit: (data: Partial<T>) => Promise<void>;
  handleDelete: () => Promise<void>;
  setEditing: React.Dispatch<React.SetStateAction<T | null>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UseUsersReturn {
  users: User[];
  selectedUsers: string[];
  loading: boolean;
  error: string | null;
  editingUser: User | null;
  openUserDialog: boolean;
  fetchUsers: () => Promise<void>;
  fetchWorkers: () => Promise<void>;
  handleEditUser: (userData: Partial<User>) => Promise<void>;
  handleDeleteUsers: () => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectUser: (userId: string) => void;
  setEditingUser: (user: User | null) => void;
  setOpenUserDialog: (open: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
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

export interface UserState extends SelectionState<User> {
  users: User[];
  selectedUsers: string[];
}

export interface WorkshopState extends SelectionState<Workshop> {
  workshops: Workshop[];
  selectedWorkshops: string[];
}
