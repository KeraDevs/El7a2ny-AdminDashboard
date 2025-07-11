"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkshopServices } from "@/hooks/_useWorkshopServices";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { WorkshopServicesTableHeader } from "@/components/workshops/workshop-services/WorkshopServicesTableHeader";
import { WorkshopServicesTable } from "@/components/workshops/workshop-services/WorkshopServicesTable";
import { WorkshopServicesStatsCards } from "@/components/workshops/workshop-services/WorkshopServicesStatsCards";
import { AddWorkshopServiceDialog } from "@/components/workshops/workshop-services/AddWorkshopServiceDialog";
import { BatchCreateWorkshopServiceDialog } from "@/components/workshops/workshop-services/BatchCreateWorkshopServiceDialog";
import { EditWorkshopServiceDialog } from "@/components/workshops/workshop-services/EditWorkshopServiceDialog";
import { ViewWorkshopServiceDialog } from "@/components/workshops/workshop-services/ViewWorkshopServiceDialog";

import { DataPagination } from "@/components/ui/DataPagination";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

import {
  WorkshopService,
  WorkshopServiceColumnVisibility,
  WorkshopServiceSortConfig,
} from "@/types/workshopServiceTypes";

const WorkshopServicesPage: React.FC = () => {
  const { currentUser, isAuthorized, loading: authLoading } = useAuth();
  const {
    workshopServices,
    loading,
    error,
    pagination,
    stats,
    selectedWorkshopServices,
    fetchWorkshopServices,
    handleAddWorkshopService,
    handleBatchCreateServices,
    handleEditWorkshopService,
    handleDeleteWorkshopService,
    handleDeleteWorkshopServices,
    handleSelectAll,
    handleSelectWorkshopService,
    refreshData,
  } = useWorkshopServices();

  // Local state for UI
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<WorkshopServiceColumnVisibility>({
      workshop_name: true,
      service_name: true,
      percentage: true,
      is_active: true,
      created_at: true,
      updated_at: false,
    });
  const [sortConfig, setSortConfig] = useState<WorkshopServiceSortConfig>({
    key: null,
    direction: "asc",
  });

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBatchCreateDialogOpen, setIsBatchCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<WorkshopService | null>(null);

  // Initial data load
  useEffect(() => {
    if (isAuthorized && currentUser) {
      fetchWorkshopServices(1, 10);
    }
  }, [isAuthorized, currentUser, fetchWorkshopServices]);

  // Handle errors
  useEffect(() => {
    if (error && !error.includes("404") && !error.includes("API Error: 404")) {
      toast.error(error);
    }
  }, [error]);

  // Apply client-side filtering and sorting
  const filteredAndSortedServices = useMemo(() => {
    let filtered = [...workshopServices];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.workshop?.name?.toLowerCase().includes(query) ||
          service.service_type?.name?.toLowerCase().includes(query) ||
          service.percentage.toString().includes(query) ||
          service.service_type?.service_category?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof WorkshopService];
        let bValue: any = b[sortConfig.key as keyof WorkshopService];

        // Handle nested properties
        if (sortConfig.key === "workshop_name") {
          aValue = a.workshop?.name || "";
          bValue = b.workshop?.name || "";
        } else if (sortConfig.key === "service_name") {
          aValue = a.service_type?.name || "";
          bValue = b.service_type?.name || "";
        }

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [workshopServices, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedServices.length / rowsPerPage);
  const paginatedServices = filteredAndSortedServices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle sorting
  const handleSort = (key: keyof WorkshopService | string) => {
    setSortConfig((prev) => ({
      key: key as keyof WorkshopService,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    const filterValue = searchQuery.trim();
    fetchWorkshopServices(1, rowsPerPage, filterValue);
    setCurrentPage(1);
  };

  // Handle adding service
  const handleAddService = () => {
    setIsAddDialogOpen(true);
  };

  // Handle batch create
  const handleBatchCreate = () => {
    setIsBatchCreateDialogOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: WorkshopService) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  // Handle view service
  const handleViewService = (service: WorkshopService) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
  };

  // Handle delete single service
  const handleDeleteSingle = async (serviceId: string) => {
    const service = workshopServices.find((s) => s.id === serviceId);
    if (service) {
      try {
        await handleDeleteWorkshopService(
          service.workshop_id,
          service.service_type_id
        );
        toast.success("Service deleted successfully");
      } catch (error) {
        toast.error("Failed to delete service");
      }
    }
  };

  // Handle delete multiple services
  const handleDeleteMultiple = async () => {
    if (selectedWorkshopServices.length === 0) return;

    try {
      await handleDeleteWorkshopServices(selectedWorkshopServices);
      toast.success(
        `${selectedWorkshopServices.length} services deleted successfully`
      );
    } catch (error) {
      toast.error("Failed to delete services");
    }
  };

  // Handle edit from view dialog
  const handleEditFromView = () => {
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show unauthorized state
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Workshop Services
            </h1>
            <p className="text-muted-foreground">
              Manage services offered by workshops and their pricing
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <WorkshopServicesStatsCards stats={stats} loading={loading} />

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
          <WorkshopServicesTableHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            onDelete={handleDeleteMultiple}
            onRefresh={handleRefresh}
            onAddService={handleAddService}
            onBatchCreate={handleBatchCreate}
            selectedCount={selectedWorkshopServices.length}
            loading={loading}
          />

          <WorkshopServicesTable
            loading={loading}
            paginatedWorkshopServices={paginatedServices}
            columnVisibility={columnVisibility}
            sortConfig={sortConfig}
            handleSort={handleSort}
            selectedWorkshopServices={selectedWorkshopServices}
            handleSelectAll={handleSelectAll}
            handleSelectWorkshopService={handleSelectWorkshopService}
            handleEdit={handleEditService}
            handleView={handleViewService}
            searchQuery={searchQuery}
            workshopServices={filteredAndSortedServices}
            onDelete={handleDeleteSingle}
          />

          {/* Pagination */}
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedServices.length}
            itemsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setRowsPerPage}
            itemType="workshop services"
            loading={loading}
          />
        </div>

        {/* Dialogs */}
        <AddWorkshopServiceDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAddWorkshopService}
        />

        <BatchCreateWorkshopServiceDialog
          isOpen={isBatchCreateDialogOpen}
          onClose={() => setIsBatchCreateDialogOpen(false)}
          onSave={handleBatchCreateServices}
        />

        <EditWorkshopServiceDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          service={selectedService}
          onSave={handleEditWorkshopService}
        />

        <ViewWorkshopServiceDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          service={selectedService}
          onEdit={handleEditFromView}
        />

        {/* Floating Download Button */}
        <FloatingDownloadButton
          data={paginatedServices.map((service) => ({
            id: service.id,
            workshop_name: service.workshop?.name || "Unknown",
            workshop_address: service.workshop?.address || "",
            service_name: service.service_type?.name || "Unknown",
            service_category: service.service_type?.service_category || "",
            percentage: service.percentage,
            is_active: service.is_active ? "Active" : "Inactive",
            created_at: new Date(service.created_at).toLocaleDateString(),
            updated_at: new Date(service.updated_at).toLocaleDateString(),
          }))}
          filename={`workshop-services-page-${currentPage}`}
          headers={[
            { label: "ID", key: "id" },
            { label: "Workshop Name", key: "workshop_name" },
            { label: "Workshop Address", key: "workshop_address" },
            { label: "Service Name", key: "service_name" },
            { label: "Service Category", key: "service_category" },
            { label: "Percentage", key: "percentage" },
            { label: "Status", key: "is_active" },
            { label: "Created Date", key: "created_at" },
            { label: "Updated Date", key: "updated_at" },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default WorkshopServicesPage;
