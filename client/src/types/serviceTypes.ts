export interface ServiceType {
  percentage: any;
  id: string;
  name: string;
  description: string;
  basePrice: number;
  percentageModifier?: number;
  category: "maintenance" | "repair" | "inspection" | "custom";
  estimatedDuration: number; 
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  requiresSpecialist?: boolean;
  compatibleVehicleTypes?: string[];
  price: number;
  duration: number;
  tags: string[];
}

export interface ServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => Promise<void>;
}

export interface AddServiceTypeDialogProps extends ServiceTypeDialogProps {
  onAddServiceType: (serviceTypeData: Partial<ServiceType>) => Promise<void>;\
  isOpen: boolean;
setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditServiceTypeDialogProps extends ServiceTypeDialogProps {
  serviceTypeData: Partial<ServiceType>;
  setServiceTypeData: React.Dispatch<
    React.SetStateAction<Partial<ServiceType>>
  >;
  onSave: () => Promise<void>;
  loading?: boolean;
}

export interface ViewServiceTypeDialogProps extends ServiceTypeDialogProps {
  serviceTypeData: ServiceType | null;
  onEdit: () => void;
}

export interface DeleteServiceTypeDialogProps extends ServiceTypeDialogProps {
  serviceTypeIds: string[];
  onDelete: () => Promise<void>;
  loading?: boolean;
  ServiceTypes: ServiceType[];
}

export interface SetPercentageDialogProps extends ServiceTypeDialogProps {
  serviceTypeIds: string[];
  onSetPercentage: (percentage: number) => Promise<void>;
  loading?: boolean;
  ServiceTypes: ServiceType[];

}

export interface ServiceTypeColumnVisibility {
  name: boolean;
  description: boolean;
  basePrice: boolean;
  category: boolean;
  estimatedDuration: boolean;
  createdAt?: boolean;
  isActive: boolean;
}

export interface SortConfig {
  key: keyof ServiceType | null;
  direction: "asc" | "desc";
}

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

// For hook to manage service types
export interface UseServiceTypesReturn {
  serviceTypes: ServiceType[];
  selectedServiceTypes: string[];
  loading: boolean;
  error: string | null;
  editingServiceType: ServiceType | null;
  openServiceTypeDialog: boolean;
  fetchServiceTypes: () => Promise<void>;
  handleAddServiceType: (
    serviceTypeData: Partial<ServiceType>
  ) => Promise<void>;
  handleEditServiceType: (
    serviceTypeData: Partial<ServiceType>
  ) => Promise<void>;
  handleDeleteServiceTypes: () => Promise<void>;
  handleSetPercentage: (percentage: number) => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectServiceType: (serviceTypeId: string) => void;
  setEditingServiceType: React.Dispatch<
    React.SetStateAction<ServiceType | null>
  >;
  setOpenServiceTypeDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default ServiceType;
