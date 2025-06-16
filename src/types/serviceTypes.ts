import { ColumnVisibility } from "../app/(dashboard)/users/page";
export interface ServiceTypePercentage {
  id: string;
  service_type_id: string;
  percentage: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  service_category: string;
  category: string;
  basePrice: number;
  estimatedDuration: number;
  percentageModifier?: number;
  requiresSpecialist?: boolean;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  service_types_percentage?: ServiceTypePercentage;
  compatibleVehicleTypes?: string[];
  createdAt: string;
  percentage?: number;
  price: number;
}

// Column visibility settings for service types table
export interface ServiceTypeColumnVisibility {
  basePrice: boolean;
  name: boolean;
  description?: boolean;
  percentage?: boolean;
  category?: boolean;
  created_at?: boolean;
  updated_at?: boolean;
  estimatedDuration?: boolean;
  isActive: boolean;
  createdAt?: boolean; // Add this for compatibility
}

// Sort configuration for service types
export interface SortConfig {
  key: keyof ServiceType | null;
  direction: "asc" | "desc";
}

// Props interface for the ServiceTypesTable component
export interface ServiceTypesTableProps {
  loading: boolean;
  paginatedServiceTypes: ServiceType[];
  columnVisibility: ServiceTypeColumnVisibility;
  sortConfig: SortConfig;
  handleSort: (key: keyof ServiceType) => void;
  selectedServiceTypes: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectServiceType: (serviceTypeId: string) => void;
  handleEdit: (serviceType: ServiceType) => void;
  handleView: (serviceType: ServiceType) => void;
  searchQuery: string;
  serviceTypes: ServiceType[];
  onDelete: (id: string) => void;
  onSetPercentage: () => void;
}

export interface ServiceTypesTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ColumnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<ServiceTypeColumnVisibility>
  >;
  onDelete: () => void;
  onRefresh: () => void;
  onAddBrand: (brandData: Partial<ServiceType>) => Promise<void>;
  selectedCount: number;
  onAddServiceType: () => void;
  loading: boolean;
}

// API response structure for service types
export interface ServiceTypesResponse {
  serviceTypes: ServiceType[];
  total: number;
  hasMore: boolean;
}

// New service type submission data structure
export interface CreateServiceTypeData {
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  service_category: string;
}

// Update service type data structure
export interface UpdateServiceTypeData {
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  service_category?: string;
}

// Set percentage request data structure
export interface SetPercentageData {
  percentage: number;
}

// Props interface for the EditServiceTypeDialog component
export interface EditServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceTypeData: Partial<ServiceType>;
  setServiceTypeData: React.Dispatch<
    React.SetStateAction<Partial<ServiceType>>
  >;
  onSave: () => Promise<void>;
  loading?: boolean;
  onSuccess?: () => Promise<void>;
}

// Props interface for the AddServiceTypeDialog component
export interface AddServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddServiceType: (serviceTypeData: CreateServiceTypeData) => Promise<void>;
  onSuccess?: () => Promise<void>;
}

// Props interface for the ViewServiceTypeDialog component
export interface ViewServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceType: ServiceType | null;
  onEdit: () => void;
}

// Props interface for the DeleteServiceTypeDialog component
export interface DeleteServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceTypeIds: string[];
  ServiceTypes: ServiceType[];
  onDelete: () => Promise<void>;
}

// Props interface for the SetPercentageDialog component
export interface SetPercentageDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceTypeIds: string[];
  ServiceTypes: ServiceType[];
  onSetPercentage: (percentage: number) => Promise<void>;
}
