"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useCarRegions } from "@/hooks/_useCarRegions";
import { useAuth } from "@/contexts/AuthContext";
import { CarRegion } from "@/types/carTypes";
import { toast } from "react-hot-toast";
import { Loader2, MapPin, Plus, Settings, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

import { CarRegionsTableHeader } from "@/components/cars/CarRegionsTableHeader";
import { CarRegionsTable } from "@/components/cars/CarRegionsTable";
import { CarRegionsPagination } from "@/components/cars/CarRegionsPagination";
import { AddCarRegionDialog } from "@/components/cars/AddCarRegionDialog";
import { EditCarRegionDialog } from "@/components/cars/EditCarRegionDialog";
import { ViewCarRegionDialog } from "@/components/cars/ViewCarRegionDialog";

// Car Regions Statistics Component
const CarRegionsStats = ({ regions }: { regions: CarRegion[] }) => {
  const totalRegions = regions.length;
  const activeRegions = regions.filter((r) => r.is_active).length;
  const inactiveRegions = totalRegions - activeRegions;
  const recentRegions = regions.filter((r) => {
    const createdDate = new Date(r.created_at || Date.now());
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }).length;

  const stats = [
    {
      title: "Total Regions",
      value: totalRegions.toString(),
      icon: MapPin,
      description: "All car regions",
      trend: "+8.5%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Active Regions",
      value: activeRegions.toString(),
      icon: Plus,
      description: "Currently active",
      trend: "+5.2%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Inactive Regions",
      value: inactiveRegions.toString(),
      icon: Settings,
      description: "Temporarily disabled",
      trend: "-1.1%",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
    },
    {
      title: "Recent Additions",
      value: recentRegions.toString(),
      icon: TrendingUp,
      description: "Last 30 days",
      trend: "+12.3%",
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

export type CarRegionSortConfig = {
  key: keyof CarRegion | null;
  direction: "asc" | "desc";
};

const CarRegionsList: React.FC = () => {
  const { currentUser, isAuthorized, loading: authLoading } = useAuth();
  const {
    regions,
    loading,
    error,
    fetchRegions,
    selectedRegions,
    handleSelectAll,
    handleSelectRegion,
    handleDeleteRegions,
    handleDeleteSingle,
    handleEditRegion,
    handleAddRegion,
    setSelectedRegions,
  } = useCarRegions();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState<CarRegionSortConfig>({
    key: null,
    direction: "asc",
  });
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRegionForEdit, setSelectedRegionForEdit] =
    useState<CarRegion | null>(null);
  const [selectedRegionForView, setSelectedRegionForView] =
    useState<CarRegion | null>(null);

  // Confirmation dialog states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch regions on component mount
  useEffect(() => {
    if (currentUser && isAuthorized) {
      fetchRegions();
    }
  }, [currentUser, isAuthorized, fetchRegions]);

  // Filter and sort regions
  const filteredAndSortedRegions = useMemo(() => {
    let filtered = regions.filter((region) => {
      const matchesSearch =
        region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (region.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);

      return matchesSearch;
    });

    // Sort regions
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
  }, [regions, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRegions.length / rowsPerPage);
  const paginatedRegions = filteredAndSortedRegions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key: keyof CarRegion) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleRefresh = () => {
    fetchRegions();
    toast.success("Car regions refreshed successfully!");
  };

  const handleEditClick = (region: CarRegion) => {
    setSelectedRegionForEdit(region);
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (region: CarRegion) => {
    setSelectedRegionForView(region);
    setIsViewDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    fetchRegions();
  };
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedRegionForEdit(null);
    fetchRegions();
  };

  // Confirmation handlers for delete operations
  const handleDeleteSingleClick = (regionId: string) => {
    setRegionToDelete(regionId);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedRegions.length === 0) {
      toast.error("No regions selected");
      return;
    }
    setIsBulkDeleteConfirmOpen(true);
  };

  const confirmSingleDelete = async () => {
    if (!regionToDelete) return;

    setDeleteLoading(true);
    try {
      await handleDeleteSingle(regionToDelete);
      toast.success("Region deleted successfully");
    } catch (error) {
      toast.error("Failed to delete region");
    } finally {
      setDeleteLoading(false);
      setIsDeleteConfirmOpen(false);
      setRegionToDelete(null);
    }
  };

  const confirmBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      await handleDeleteRegions();
      toast.success(`${selectedRegions.length} region(s) deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete regions");
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
            You don't have permission to access car regions management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Car Regions Management
          </h1>
          <p className="text-muted-foreground">
            Manage car regions, their details and availability
          </p>
        </div>
      </div>
      {/* Statistics */}
      <CarRegionsStats regions={regions} />
      {/* Table Header */}{" "}
      <CarRegionsTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCount={selectedRegions.length}
        onDelete={handleBulkDeleteClick}
        onRefresh={handleRefresh}
        onAddRegion={() => setIsAddDialogOpen(true)}
        loading={loading}
      />{" "}
      {/* Table */}
      <CarRegionsTable
        regions={paginatedRegions}
        selectedRegions={selectedRegions}
        onSelectAll={handleSelectAll}
        onSelectRegion={handleSelectRegion}
        onEdit={handleEditClick}
        onView={handleViewClick}
        onDeleteSingle={handleDeleteSingleClick}
        onSort={handleSort}
        sortConfig={sortConfig}
        loading={loading}
      />
      {/* Pagination */}
      <CarRegionsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={filteredAndSortedRegions.length}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
      {/* Dialogs */}
      <AddCarRegionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
        onAdd={handleAddRegion}
      />
      <EditCarRegionDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedRegionForEdit(null);
        }}
        onSuccess={handleEditSuccess}
        onEdit={handleEditRegion}
        region={selectedRegionForEdit}
      />
      <ViewCarRegionDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedRegionForView(null);
        }}
        region={selectedRegionForView}
      />
      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setRegionToDelete(null);
        }}
        onConfirm={confirmSingleDelete}
        title="Delete Car Region"
        description="Are you sure you want to delete this car region? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteLoading}
      />
      <ConfirmationDialog
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Selected Regions"
        description={`Are you sure you want to delete ${selectedRegions.length} selected region(s)? This action cannot be undone and will remove all associated data.`}
        confirmText={`Delete ${selectedRegions.length} Region(s)`}
        cancelText="Cancel"
        variant="destructive"
        loading={deleteLoading}
      />
      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-sm">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CarRegionsList;
