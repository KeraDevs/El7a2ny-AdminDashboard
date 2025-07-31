import { ServiceType } from "./serviceTypes";

export interface WorkshopService {
  id: string;
  workshop_id: string;
  service_type_id: string;
  percentage: number | null;
  created_at: string;
  updated_at: string;
  service_type: ServiceType;
  workshop?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface CreateWorkshopServiceData {
  workshop_id: string;
  service_type_id: string;
  percentage: number;
}

export interface UpdateWorkshopServiceData {
  percentage?: number;
}

export interface BatchCreateWorkshopServiceData {
  workshop_id: string;
  services: Array<{
    service_type_id: string;
    percentage: number;
  }>;
}

export interface WorkshopServicesPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface WorkshopServicesResponse {
  services: WorkshopService[];
  pagination?: WorkshopServicesPagination;
}

export interface WorkshopServiceColumnVisibility {
  workshop_name: boolean;
  service_name: boolean;
  percentage: boolean;
  created_at: boolean;
  updated_at: boolean;
}

export interface WorkshopServiceSortConfig {
  key: keyof WorkshopService | "workshop_name" | "service_name" | null;
  direction: "asc" | "desc";
}

export interface WorkshopServicesTableProps {
  loading: boolean;
  paginatedWorkshopServices: WorkshopService[];
  columnVisibility: WorkshopServiceColumnVisibility;
  sortConfig: WorkshopServiceSortConfig;
  handleSort: (key: keyof WorkshopService | string) => void;
  selectedWorkshopServices: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectWorkshopService: (serviceId: string) => void;
  handleEdit: (service: WorkshopService) => void;
  handleView: (service: WorkshopService) => void;
  searchQuery: string;
  workshopServices: WorkshopService[];
  onDelete: (id: string) => void;
}

export interface WorkshopServicesTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: WorkshopServiceColumnVisibility;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<WorkshopServiceColumnVisibility>
  >;
  onDelete: () => void;
  onRefresh: () => void;
  onAddService: () => void;
  onBatchCreate: () => void;
  selectedCount: number;
  loading: boolean;
}

export interface WorkshopServicesStats {
  totalServices: number;
  averagePercentage: number | null;
  workshopsWithServices: number;
}
