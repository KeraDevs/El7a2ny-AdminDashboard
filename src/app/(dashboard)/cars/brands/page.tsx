"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useCarBrands } from "@/hooks/_useCarBrands";
import { useAuth } from "@/contexts/AuthContext";
import { CarBrand } from "@/types/carTypes";
import { toast } from "react-hot-toast";
import { Loader2, Car, Plus, Settings, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

import { CarBrandsTableHeader } from "@/components/cars/CarBrandsTableHeader";
import { CarBrandsTable } from "@/components/cars/CarBrandsTable";
import { AddCarBrandDialog } from "@/components/cars/AddCarBrandDialog";
import { EditCarBrandDialog } from "@/components/cars/EditCarBrandDialog";
import { ViewCarBrandDialog } from "@/components/cars/ViewCarBrandDialog";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";
import { DataPagination } from "@/components/ui/DataPagination";

// Car Brands Statistics Component
const CarBrandsStats = ({ brands }: { brands: CarBrand[] }) => {
  const totalBrands = brands.length;
  const recentBrands = brands.filter((b) => {
    const createdDate = new Date(b.created_at || Date.now());
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }).length;

  const brandsWithRegions = brands.filter(
    (b) => b.brand_regions && b.brand_regions.length > 0
  ).length;

  const stats = [
    {
      title: "Total Brands",
      value: totalBrands.toString(),
      icon: Car,
      description: "All car brands",
      trend: "+12.5%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "With Regions",
      value: brandsWithRegions.toString(),
      icon: Plus,
      description: "Brands with regions",
      trend: "+8.2%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Without Regions",
      value: (totalBrands - brandsWithRegions).toString(),
      icon: Settings,
      description: "No regions assigned",
      trend: "-2.1%",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
    },
    {
      title: "Recent Additions",
      value: recentBrands.toString(),
      icon: TrendingUp,
      description: "Last 30 days",
      trend: "+15.3%",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`border-0 shadow-md bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className="text-xs text-green-600 font-medium">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export type CarBrandColumnVisibility = {
  name: boolean;
  regionsCount: boolean;
  regions: boolean;
  createdAt: boolean;
};

export type CarBrandSortConfig = {
  key: keyof CarBrand | null;
  direction: "asc" | "desc";
};

const CarBrandsList: React.FC = () => {
  const { currentUser, isAuthorized, loading: authLoading } = useAuth();
  const {
    brands,
    loading,
    error,
    fetchBrands,
    selectedBrands,
    handleSelectAll,
    handleSelectBrand,
    handleDeleteBrands,
    handleDeleteSingle,
    handleEditBrand,
    handleAddBrand,
  } = useCarBrands();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility] = useState<CarBrandColumnVisibility>({
    name: true,
    regionsCount: true,
    regions: true,
    createdAt: true,
  });

  const [sortConfig, setSortConfig] = useState<CarBrandSortConfig>({
    key: null,
    direction: "asc",
  });
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBrandForEdit, setSelectedBrandForEdit] =
    useState<CarBrand | null>(null);
  const [selectedBrandForView, setSelectedBrandForView] =
    useState<CarBrand | null>(null);

  // Confirmation dialog states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch brands on component mount
  useEffect(() => {
    if (currentUser && isAuthorized) {
      fetchBrands();
    }
  }, [currentUser, isAuthorized, fetchBrands]); // Filter and sort brands
  const filteredAndSortedBrands = useMemo(() => {
    const filtered = brands.filter((brand) => {
      const matchesSearch = brand.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    }); // Sort brands
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [brands, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBrands.length / rowsPerPage);
  const paginatedBrands = filteredAndSortedBrands.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key: keyof CarBrand) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleEditClick = (brand: CarBrand) => {
    setSelectedBrandForEdit(brand);
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (brand: CarBrand) => {
    setSelectedBrandForView(brand);
    setIsViewDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    fetchBrands();
  };

  const handleRefresh = () => {
    fetchBrands();
    toast.success("Brands refreshed successfully");
  };
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedBrandForEdit(null);
    fetchBrands();
  };

  // Confirmation handlers for delete operations
  const handleDeleteSingleClick = (brandId: string) => {
    setBrandToDelete(brandId);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedBrands.length === 0) {
      toast.error("No brands selected");
      return;
    }
    setIsBulkDeleteConfirmOpen(true);
  };

  const confirmSingleDelete = async () => {
    if (!brandToDelete) return;
    setDeleteLoading(true);
    try {
      await handleDeleteSingle(brandToDelete);
      toast.success("Brand deleted successfully");
    } catch {
      toast.error("Failed to delete brand");
    } finally {
      setDeleteLoading(false);
      setIsDeleteConfirmOpen(false);
      setBrandToDelete(null);
    }
  };

  const confirmBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      await handleDeleteBrands();
      toast.success(`${selectedBrands.length} brand(s) deleted successfully`);
    } catch {
      toast.error("Failed to delete brands");
    } finally {
      setDeleteLoading(false);
      setIsBulkDeleteConfirmOpen(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access car brands management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Car Brands Management
          </h1>
          <p className="text-muted-foreground">
            Manage car brands, their details and availability
          </p>
        </div>
      </div>
      {/* Statistics */}
      <CarBrandsStats brands={brands} /> {/* Table Header */}
      <CarBrandsTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCount={selectedBrands.length}
        onDelete={handleBulkDeleteClick}
        onAdd={() => setIsAddDialogOpen(true)}
        onRefresh={handleRefresh}
      />
      {/* Table */}
      <CarBrandsTable
        brands={paginatedBrands}
        selectedBrands={selectedBrands}
        onSelectAll={handleSelectAll}
        onSelectBrand={handleSelectBrand}
        onEdit={handleEditClick}
        onView={handleViewClick}
        onDeleteSingle={handleDeleteSingleClick}
        columnVisibility={columnVisibility}
        onSort={handleSort}
        sortConfig={sortConfig}
        loading={loading}
      />
      {/* Pagination */}
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAndSortedBrands.length}
        itemsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setRowsPerPage}
        itemType="brands"
        loading={loading}
      />
      {/* Dialogs */}
      <AddCarBrandDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
        onAdd={handleAddBrand}
      />
      <EditCarBrandDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedBrandForEdit(null);
        }}
        onSuccess={handleEditSuccess}
        onEdit={handleEditBrand}
        brand={selectedBrandForEdit}
      />
      <ViewCarBrandDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedBrandForView(null);
        }}
        brand={selectedBrandForView}
      />
      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setBrandToDelete(null);
        }}
        onConfirm={confirmSingleDelete}
        title="Delete Car Brand"
        description="Are you sure you want to delete this car brand? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteLoading}
      />
      <ConfirmationDialog
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Selected Brands"
        description={`Are you sure you want to delete ${selectedBrands.length} selected brand(s)? This action cannot be undone and will remove all associated data.`}
        confirmText={`Delete ${selectedBrands.length} Brand(s)`}
        cancelText="Cancel"
        variant="destructive"
        loading={deleteLoading}
      />
      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={paginatedBrands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          description: brand.description || "",
          regionsCount: brand.brand_regions?.length || 0,
          createdDate: brand.created_at
            ? new Date(brand.created_at).toLocaleDateString()
            : "",
          updatedDate: brand.updated_at
            ? new Date(brand.updated_at).toLocaleDateString()
            : "",
        }))}
        filename={`car-brands-page-${currentPage}`}
        columnVisibility={{
          id: true,
          name: columnVisibility.name,
          description: true,
          regionsCount: columnVisibility.regionsCount,
          createdDate: columnVisibility.createdAt,
          updatedDate: true,
        }}
        headers={[
          { label: "ID", key: "id" },
          { label: "Brand Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Regions Count", key: "regionsCount" },
          { label: "Created Date", key: "createdDate" },
          { label: "Updated Date", key: "updatedDate" },
        ]}
      />
    </div>
  );
};

export default CarBrandsList;
