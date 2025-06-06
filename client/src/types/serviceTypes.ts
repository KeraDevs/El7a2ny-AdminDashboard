// serviceTypes.ts - Complete Rewrite
// This file defines the expected structure of service types from the API

export interface ServiceTypePercentage {
  id: string;
  service_type_id: string;
  percentage: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  isActive: any;
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  service_category: string;
  created_at: string;
  updated_at: string;
  service_types_percentage?: ServiceTypePercentage;
}

// Column visibility settings for service types table
export interface ServiceTypeColumnVisibility {
  basePrice: any;
  name: boolean;
  description?: boolean;
  percentage?: boolean;
  category?: boolean;
  created_at?: boolean;
  updated_at?: boolean;
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
  onDelete: () => void;
  onSetPercentage: () => void;
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
