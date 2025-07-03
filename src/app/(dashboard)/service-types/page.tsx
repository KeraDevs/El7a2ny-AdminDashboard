"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useServiceTypes } from "@/hooks/_useServices";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

import { ServiceTypesTableHeader } from "@/components/workshops/services/ServiceTypeHeader";
import { ServiceTypesTable } from "@/components/workshops/services/ServiceTypeTable";
import ServiceTypesPagination from "@/components/workshops/services/ServiceTypePagination";
import EditServiceTypeDialog from "@/components/workshops/services/EditServiceTypeDialog";
import ViewServiceTypeDialog from "@/components/workshops/services/ViewServiceTypeDialog";
import DeleteServiceTypeDialog from "@/components/workshops/services/DeleteServiceTypeDialog";
import {
  ServiceTypeColumnVisibility,
  SortConfig,
  ServiceType,
} from "@/types/serviceTypes";

const ServiceTypesList: React.FC = () => {
  const { currentUser, isAuthorized, loading: authLoading } = useAuth();
  const {
    serviceTypes,
    loading,
    error,
    pagination,
    fetchServiceTypes,
    selectedServiceTypes,
    handleSelectAll,
    handleSelectServiceType,
    handleDeleteServiceTypes,
    checkServiceTypesCanBeDeleted,
    handleEditServiceType,
    handleAddServiceType,
  } = useServiceTypes();

  // Remove local pagination states since we're using server-side pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // Use pagination from hooks
  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<ServiceTypeColumnVisibility>({
      name: true,
      name_ar: true,
      description: true,
      description_ar: true,
      service_category: true,
      created_at: true,
      updated_at: false,
    });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const [editServiceTypeData, setEditServiceTypeData] = useState<
    Partial<ServiceType>
  >({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewServiceTypeData, setViewServiceTypeData] =
    useState<ServiceType | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Initial data load when component mounts
  useEffect(() => {
    if (isAuthorized && currentUser) {
      console.log("Authorized, fetching service types");
      fetchServiceTypes(1, 10).catch((err) => {
        console.error("Error fetching service types:", err);
        toast.error("Failed to fetch service types");
      });
    }
  }, [isAuthorized, currentUser, fetchServiceTypes]);

  // Make sure table re-renders when serviceTypes changes
  useEffect(() => {
    console.log(`ServiceTypes updated: ${serviceTypes.length} items`);
  }, [serviceTypes]);

  // Display any errors from the API
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Apply sorting to the service types (keep client-side sorting for better UX)
  const sortedServiceTypes = useMemo(() => {
    console.log("Sorting service types:", serviceTypes.length);
    const serviceTypesCopy = [...serviceTypes];
    if (sortConfig.key) {
      serviceTypesCopy.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ServiceType];
        const bValue = b[sortConfig.key as keyof ServiceType];

        if (aValue === bValue) return 0;
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return sortConfig.direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return serviceTypesCopy;
  }, [serviceTypes, sortConfig]);

  // Handle search query changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isAuthorized && currentUser) {
        fetchServiceTypes(1, pagination.limit, searchQuery);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    isAuthorized,
    currentUser,
    fetchServiceTypes,
    pagination.limit,
  ]);

  // Use server-side data directly - no client-side filtering needed
  const paginatedServiceTypes = sortedServiceTypes;

  // Pagination handlers
  const handlePageChange = (page: React.SetStateAction<number>) => {
    const newPage = typeof page === "function" ? page(pagination.page) : page;
    fetchServiceTypes(newPage, pagination.limit, searchQuery);
  };

  const handleLimitChange = (limit: React.SetStateAction<number>) => {
    const newLimit =
      typeof limit === "function" ? limit(pagination.limit) : limit;
    fetchServiceTypes(1, newLimit, searchQuery);
  };

  // Handle sorting
  const handleSort = (key: keyof ServiceType) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle edit button click
  const handleEdit = (serviceType: ServiceType) => {
    console.log("Editing service type:", serviceType);
    setEditServiceTypeData(serviceType);
    setIsEditDialogOpen(true);
  };

  // Handle view button click
  const handleView = (serviceType: ServiceType) => {
    console.log("Viewing service type:", serviceType);
    setViewServiceTypeData(serviceType);
    setIsViewDialogOpen(true);
  };

  // Handle edit save
  const handleSaveEdit = async () => {
    try {
      await handleEditServiceType(editServiceTypeData);
      toast.success("Service type updated successfully");
      setIsEditDialogOpen(false);
    } catch {
      toast.error("Failed to update service type");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      console.log("Selected service types for deletion:", selectedServiceTypes);
      console.log(
        "Available service types:",
        serviceTypes.map((st) => ({ id: st.id, name: st.name }))
      );

      if (selectedServiceTypes.length === 0) {
        toast.error("No service types selected for deletion");
        return;
      }

      // Show loading toast while checking
      const loadingToast = toast.loading(
        "🔍 Checking which service types can be deleted..."
      );

      try {
        // Pre-check which service types can be deleted
        const { canDelete, cannotDelete } = await checkServiceTypesCanBeDeleted(
          selectedServiceTypes
        );

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        console.log("Pre-check results:", { canDelete, cannotDelete });

        if (cannotDelete.length > 0) {
          const cannotDeleteNames = cannotDelete
            .map((item) => item.name)
            .join(", ");

          if (canDelete.length > 0) {
            // Mixed case: some can be deleted, some cannot
            const canDeleteNames = canDelete
              .map((id) => {
                const serviceType = serviceTypes.find((st) => st.id === id);
                return serviceType?.name || id;
              })
              .join(", ");

            const proceed = window.confirm(
              `⚠️ Some service types cannot be deleted because they are being used by workshops.\n\n` +
                `❌ Cannot delete: ${cannotDeleteNames}\n\n` +
                `✅ Can delete: ${canDeleteNames}\n\n` +
                `Would you like to proceed with deleting only the available ones?`
            );

            if (!proceed) {
              return;
            }

            // Proceed with only deletable ones
            await handleDeleteServiceTypes(canDelete);
            toast.success(
              `Successfully deleted ${canDelete.length} service type(s)`
            );
          } else {
            // All selected items cannot be deleted
            toast.error(
              `❌ Cannot delete any selected service types: ${cannotDeleteNames}.\nThey are currently being used by workshops.`,
              { duration: 6000 }
            );
            return;
          }
        } else {
          // All can be deleted, proceed normally
          await handleDeleteServiceTypes(selectedServiceTypes);
          toast.success(
            selectedServiceTypes.length === 1
              ? "Service type deleted successfully"
              : `${selectedServiceTypes.length} service types deleted successfully`
          );
        }

        // Close dialog and refresh data after successful deletion
        setIsDeleteDialogOpen(false);
        await fetchServiceTypes(pagination.page, pagination.limit, searchQuery);
      } catch (checkError) {
        // Dismiss loading toast if still showing
        toast.dismiss(loadingToast);
        throw checkError;
      }
    } catch (error) {
      console.error("Failed to delete service types:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete service types: ${errorMessage}`);
    }
  };

  // Check if authenticated
  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-muted-foreground">
            You need to be logged in to view this page. Please log in and try
            again.
          </p>
        </div>
      </div>
    );
  }

  console.log(
    "Rendering ServiceTypesList with",
    serviceTypes.length,
    "service types"
  );

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Service Types</h1>
        <p className="text-muted-foreground">
          Manage service types and their pricing structure
        </p>
      </div>

      <ServiceTypesTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        onAddServiceType={handleAddServiceType}
        refreshData={() =>
          fetchServiceTypes(pagination.page, pagination.limit, searchQuery)
        }
        selectedServiceTypes={selectedServiceTypes}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <ServiceTypesTable
        loading={loading}
        paginatedServiceTypes={paginatedServiceTypes}
        columnVisibility={columnVisibility}
        sortConfig={sortConfig}
        handleSort={handleSort}
        selectedServiceTypes={selectedServiceTypes}
        handleSelectAll={handleSelectAll}
        handleSelectServiceType={handleSelectServiceType}
        handleEdit={handleEdit}
        handleView={handleView}
        searchQuery={searchQuery}
        serviceTypes={serviceTypes}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <ServiceTypesPagination
        currentPage={pagination.page}
        setCurrentPage={handlePageChange}
        totalPages={Math.ceil(pagination.total / pagination.limit)}
        rowsPerPage={pagination.limit}
        setRowsPerPage={handleLimitChange}
        totalItems={pagination.total}
        currentItems={paginatedServiceTypes.length}
        selectedServiceTypes={selectedServiceTypes}
      />

      {/* Edit Dialog */}
      <EditServiceTypeDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        serviceTypeData={editServiceTypeData}
        setServiceTypeData={setEditServiceTypeData}
        onSave={handleSaveEdit}
        onSuccess={fetchServiceTypes}
      />

      {/* View Dialog */}
      <ViewServiceTypeDialog
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        serviceType={viewServiceTypeData}
        onEdit={() => {
          setIsViewDialogOpen(false);
          if (viewServiceTypeData) {
            handleEdit(viewServiceTypeData);
          }
        }}
      />

      {/* Delete Dialog */}
      <DeleteServiceTypeDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        serviceTypeIds={selectedServiceTypes}
        onDelete={handleDelete}
        ServiceTypes={serviceTypes}
      />

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={paginatedServiceTypes.map((service) => ({
          name: service.name || "",
          name_ar: service.name_ar || "",
          description: service.description || "",
          description_ar: service.description_ar || "",
          service_category: service.service_category || "",
          created_at: service.created_at || "",
          updated_at: service.updated_at || "",
        }))}
        filename="service-types"
        columnVisibility={{
          name: columnVisibility.name ?? true,
          name_ar: columnVisibility.name_ar ?? true,
          description: columnVisibility.description ?? true,
          description_ar: columnVisibility.description_ar ?? true,
          service_category: columnVisibility.service_category ?? true,
          created_at: columnVisibility.created_at ?? true,
          updated_at: columnVisibility.updated_at ?? true,
        }}
      />
    </div>
  );
};

export default ServiceTypesList;
