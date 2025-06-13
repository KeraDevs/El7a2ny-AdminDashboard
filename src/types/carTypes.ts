// Car brands and regions types - Updated to match actual API structure
export interface CarBrand {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  country?: string;
  is_active?: boolean;
  regionIds?: string[];
  created_at: string;
  updated_at: string;
  brand_regions?: Array<{
    id: string;
    brand_id: string;
    region_id: string;
    created_at: string;
    updated_at: string;
    region: CarRegion;
  }>;
}

export interface CarRegion {
  id: string;
  name: string;
  description?: string;
  country?: string;
  continent?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  brand_regions?: Array<{
    id: string;
    brand_id: string;
    region_id: string;
    created_at: string;
    updated_at: string;
    brand: CarBrand;
  }>;
}

export interface BrandRegionAssociation {
  id: string;
  brand_id: string;
  region_id: string;
  created_at: string;
  updated_at: string;
}

// Column visibility types
export interface CarBrandColumnVisibility {
  name: boolean;
  regionsCount: boolean;
  regions: boolean;
  createdAt: boolean;
}

export interface CarRegionColumnVisibility {
  name: boolean;
  description: boolean;
  country: boolean;
  continent: boolean;
  is_active: boolean;
  created_at: boolean;
}

// Sort configuration
export interface SortConfig {
  key: string | null;
  direction: "asc" | "desc";
}

// Table props
export interface CarBrandsTableProps {
  loading: boolean;
  paginatedBrands: CarBrand[];
  columnVisibility: CarBrandColumnVisibility;
  sortConfig: SortConfig;
  handleSort: (key: keyof CarBrand) => void;
  selectedBrands: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectBrand: (brandId: string) => void;
  handleEdit: (brand: CarBrand) => void;
  handleView: (brand: CarBrand) => void;
  searchQuery: string;
  brands: CarBrand[];
  onDelete: () => void;
}

export interface CarRegionsTableProps {
  loading: boolean;
  paginatedRegions: CarRegion[];
  columnVisibility: CarRegionColumnVisibility;
  sortConfig: SortConfig;
  handleSort: (key: keyof CarRegion) => void;
  selectedRegions: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectRegion: (regionId: string) => void;
  handleEdit: (region: CarRegion) => void;
  handleView: (region: CarRegion) => void;
  searchQuery: string;
  regions: CarRegion[];
  onDelete: () => void;
}

// Header props
export interface CarBrandsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: CarBrandColumnVisibility;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<CarBrandColumnVisibility>
  >;
  onAddBrand: (brandData: Partial<CarBrand>) => Promise<void>;
  refreshData?: () => Promise<void>;
  selectedBrands: string[];
  onDelete: () => void;
}

export interface CarRegionsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: CarRegionColumnVisibility;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<CarRegionColumnVisibility>
  >;
  onAddRegion: (regionData: Partial<CarRegion>) => Promise<void>;
  refreshData?: () => Promise<void>;
  selectedRegions: string[];
  onDelete: () => void;
}

// API response types
export interface CarBrandsResponse {
  brands: CarBrand[];
  total: number;
  hasMore: boolean;
}

export interface CarRegionsResponse {
  regions: CarRegion[];
  total: number;
  hasMore: boolean;
}

// Dialog props
export interface AddCarBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onAdd: (brandData: Partial<CarBrand>) => Promise<void>;
}

export interface AddCarRegionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onAdd: (regionData: Partial<CarRegion>) => Promise<void>;
}

export interface EditCarBrandDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  brandData: CarBrand | null;
  setBrandData: React.Dispatch<React.SetStateAction<CarBrand | null>>;
  onSave: () => Promise<void>;
  regions: CarRegion[];
}

export interface EditCarRegionDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  regionData: CarRegion | null;
  setRegionData: React.Dispatch<React.SetStateAction<CarRegion | null>>;
  onSave: () => Promise<void>;
  brands: CarBrand[];
}

export interface ViewCarBrandDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  brand: CarBrand | null;
  onEdit: () => void;
}

export interface ViewCarRegionDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  region: CarRegion | null;
  onEdit: () => void;
}

// Form data types
export interface CreateCarBrandData {
  name: string;
  region_ids?: string[];
}

export interface CreateCarRegionData {
  name: string;
  brand_ids?: string[];
}
