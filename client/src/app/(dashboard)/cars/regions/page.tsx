"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useCarRegions } from "@/hooks/_useCarRegions";
import { useAuth } from "@/contexts/AuthContext";
import { CarRegion } from "@/types/carTypes";
import { toast } from "react-hot-toast";
import { Loader2, MapPin, Plus, Settings, TrendingUp } from "lucide-react";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconRefresh, IconFilter } from "@tabler/icons-react";

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

export type CarRegionColumnVisibility = {
  name: boolean;
  description: boolean;
  country: boolean;
  continent: boolean;
  is_active: boolean;
  created_at: boolean;
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
    handleEditRegion,
    handleAddRegion,
    setSelectedRegions,
  } = useCarRegions();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [continentFilter, setContinentFilter] = useState("");

  const [columnVisibility, setColumnVisibility] =
    useState<CarRegionColumnVisibility>({
      name: true,
      description: true,
      country: true,
      continent: true,
      is_active: true,
      created_at: true,
    });

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

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && region.is_active) ||
        (statusFilter === "inactive" && !region.is_active);

      const matchesContinent =
        !continentFilter ||
        (region.continent
          ?.toLowerCase()
          .includes(continentFilter.toLowerCase()) ??
          false);

      return matchesSearch && matchesStatus && matchesContinent;
    }); // Sort regions
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
  }, [regions, searchQuery, statusFilter, continentFilter, sortConfig]);

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
  const handleDeleteSingle = async (regionId: string) => {
    try {
      // Save current selection
      const originalSelection = [...selectedRegions];

      // Select only the target region
      setSelectedRegions([regionId]);

      // Use the existing delete function
      await handleDeleteRegions();

      // Restore original selection (minus the deleted region)
      setSelectedRegions(originalSelection.filter((id) => id !== regionId));
    } catch (error) {
      console.error("Failed to delete region:", error);
      toast.error("Failed to delete region");

      // Restore original selection on error
      setSelectedRegions(selectedRegions);
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Car Regions Management
          </h1>
          <p className="text-muted-foreground">
            Manage car regions, their details and availability
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <IconRefresh className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Region
          </Button>
        </div>
      </div>
      {/* Statistics */}
      <CarRegionsStats regions={regions} />
      {/* Table Header */}
      <CarRegionsTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        continentFilter={continentFilter}
        setContinentFilter={setContinentFilter}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        selectedCount={selectedRegions.length}
        onDelete={handleDeleteRegions}
        onRefresh={handleRefresh}
        loading={loading}
      />
      {/* Table */}
      <CarRegionsTable
        regions={paginatedRegions}
        selectedRegions={selectedRegions}
        onSelectAll={handleSelectAll}
        onSelectRegion={handleSelectRegion}
        onEdit={handleEditClick}
        onView={handleViewClick}
        onDelete={handleDeleteRegions}
        onDeleteSingle={handleDeleteSingle}
        columnVisibility={columnVisibility}
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
      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default CarRegionsList;
