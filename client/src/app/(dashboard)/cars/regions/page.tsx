"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { CarRegion, SortConfig } from "@/types/carTypes";
import { useCarRegions } from "@/hooks/_useCarRegions";
import { CarRegionsTableHeader } from "@/components/cars/CarRegionsTableHeader";
import { CarRegionsTable } from "@/components/cars/CarRegionsTable";
import { CarRegionsPagination } from "@/components/cars/CarRegionsPagination";
import { AddCarRegionDialog } from "@/components/cars/AddCarRegionDialog";
import { EditCarRegionDialog } from "@/components/cars/EditCarRegionDialog";
import { ViewCarRegionDialog } from "@/components/cars/ViewCarRegionDialog";
import { toast } from "sonner";
import { Loader2, MapPin, Globe, TrendingUp, Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Regions Statistics Component
const RegionsStats = ({ regions }: { regions: CarRegion[] }) => {
  const totalRegions = regions.length;
  const activeRegions = regions.filter((r) => r.is_active).length;
  const inactiveRegions = totalRegions - activeRegions;
  const regionsWithBrands = regions.filter(
    (r) => r.brand_regions && r.brand_regions.length > 0
  ).length;

  const stats = [
    {
      title: "Total Regions",
      value: totalRegions.toString(),
      icon: MapPin,
      description: "All car regions",
      trend: "+5.2%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Active Regions",
      value: activeRegions.toString(),
      icon: Globe,
      description: "Currently active",
      trend: "+3.1%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "With Brands",
      value: regionsWithBrands.toString(),
      icon: Building2,
      description: "Have associated brands",
      trend: "+8.7%",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Inactive",
      value: inactiveRegions.toString(),
      icon: TrendingUp,
      description: "Not currently active",
      trend: "-2.4%",
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const CarRegionsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "desc",
  });

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<CarRegion | null>(null);
  const {
    regions,
    selectedRegions,
    loading,
    error,
    fetchRegions,
    handleDeleteRegions,
    handleDeleteSingle,
    handleAddRegion,
    handleEditRegion,
    handleSelectAll,
    handleSelectRegion,
    setSelectedRegions,
  } = useCarRegions();

  // Auto-load regions on mount
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Filter and sort regions
  const filteredAndSortedRegions = useMemo(() => {
    let filtered = regions;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = regions.filter((region) =>
        region.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof CarRegion];
      const bValue = b[sortConfig.key as keyof CarRegion];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [regions, searchQuery, sortConfig]);
  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRegions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRegions = filteredAndSortedRegions.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handlers
  const handleSort = (column: keyof CarRegion) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEdit = (region: CarRegion) => {
    setSelectedRegion(region);
    setIsEditDialogOpen(true);
  };

  const handleView = (region: CarRegion) => {
    setSelectedRegion(region);
    setIsViewDialogOpen(true);
  };
  const handleDeleteSelected = async () => {
    if (selectedRegions.length === 0) {
      toast.error("No regions selected");
      return;
    }

    try {
      await handleDeleteRegions();
      setSelectedRegions([]);
      toast.success(`${selectedRegions.length} region(s) deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete regions");
    }
  };

  const handleRefresh = () => {
    fetchRegions();
    setSelectedRegions([]);
    toast.success("Regions refreshed");
  };

  const handleExport = () => {
    // Simple CSV export
    const csvData = filteredAndSortedRegions
      .map(
        (region) =>
          `"${region.name}","${region.country || ""}","${
            region.continent || ""
          }","${region.is_active ? "Active" : "Inactive"}","${
            region.created_at
          }"`
      )
      .join("\n");

    const csvContent = `"Name","Country","Continent","Status","Created At"\n${csvData}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "car-regions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Regions exported successfully");
  };
  const handleDialogSuccess = () => {
    fetchRegions();
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedRegion(null);
  };

  if (loading && regions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Loading car regions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load car regions</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto p-4 space-y-4 overflow-y-auto"
      style={{ scrollbarGutter: "stable" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Car Regions Management
          </h1>
          <p className="text-muted-foreground">
            Manage car regions and their associated brands
          </p>
        </div>
      </motion.div>

      <RegionsStats regions={regions} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Card className="overflow-hidden">
          <CarRegionsTableHeader
            onAddRegion={() => setIsAddDialogOpen(true)}
            onRefresh={handleRefresh}
            onExport={handleExport}
            onDelete={handleDeleteSelected}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCount={selectedRegions.length}
            loading={loading}
          />

          <CarRegionsTable
            regions={currentRegions}
            selectedRegions={selectedRegions}
            onSelectAll={handleSelectAll}
            onSelectRegion={handleSelectRegion}
            onEdit={handleEdit}
            onView={handleView}
            onDeleteSingle={handleDeleteSingle}
            onSort={handleSort}
            sortConfig={sortConfig}
            loading={loading}
          />

          <div className="p-4 pt-0">
            <CarRegionsPagination
              currentPage={currentPage}
              totalPages={Math.max(1, totalPages)}
              onPageChange={setCurrentPage}
              totalItems={filteredAndSortedRegions.length}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </div>
        </Card>
      </motion.div>

      {/* Dialogs */}
      <AddCarRegionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleDialogSuccess}
        onAdd={handleAddRegion}
      />

      <EditCarRegionDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedRegion(null);
        }}
        region={selectedRegion}
        onSuccess={handleDialogSuccess}
        onEdit={handleEditRegion}
      />

      <ViewCarRegionDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedRegion(null);
        }}
        region={selectedRegion}
      />
    </div>
  );
};

export default CarRegionsPage;
