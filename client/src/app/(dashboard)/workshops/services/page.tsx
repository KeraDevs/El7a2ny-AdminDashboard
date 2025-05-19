"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useServiceTypes } from "@/hooks/_useServices";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { ServiceTypesTableHeader } from "@/components/workshops/services/ServiceTypeHeader";
import { ServiceTypesTable } from "@/components/workshops/services/ServiceTypeTable";
import ServiceTypesPagination from "@/components/workshops/services/ServiceTypePagination";
import EditServiceTypeDialog from "@/components/workshops/services/EditServiceTypeDialog";
import ViewServiceTypeDialog from "@/components/workshops/services/ViewServiceTypeDialog";
import DeleteServiceTypeDialog from "@/components/workshops/services/DeleteServiceTypeDialog";
import SetPercentageDialog from "@/components/workshops/services/SetPercecntageDialog";
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
    fetchServiceTypes,
    selectedServiceTypes,
    handleSelectAll,
    handleSelectServiceType,
    handleDeleteServiceTypes,
    handleEditServiceType,
    handleAddServiceType,
    handleSetPercentage,
  } = useServiceTypes();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [columnVisibility, setColumnVisibility] =
    useState<ServiceTypeColumnVisibility>({
      name: true,
      description: true,
      basePrice: true,
      category: true,
      estimatedDuration: true,
      createdAt: true,
      isActive: true,
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
  const [isSetPercentageDialogOpen, setIsSetPercentageDialogOpen] =
    useState(false);

  // Initial data load when component mounts
  useEffect(() => {
    if (isAuthorized && currentUser) {
      console.log("Authorized, fetching service types");
      fetchServiceTypes().catch((err) => {
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

  // Apply sorting to the service types
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

  // Filter service types based on search query
  const filteredServiceTypes = useMemo(() => {
    if (!searchQuery) return sortedServiceTypes;

    return sortedServiceTypes.filter((serviceType) => {
      const searchFields = [
        serviceType.name,
        serviceType.description,
        serviceType.category,
      ];

      return searchFields.some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [sortedServiceTypes, searchQuery]);

  // Get current page of service types
  const paginatedServiceTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredServiceTypes.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredServiceTypes, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredServiceTypes.length / rowsPerPage);

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
    } catch (error) {
      console.error("Failed to update service type:", error);
      toast.error("Failed to update service type");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      console.log("Deleting service types:", selectedServiceTypes);
      await handleDeleteServiceTypes(selectedServiceTypes);
      toast.success(
        selectedServiceTypes.length > 1
          ? "Service types deleted successfully"
          : "Service type deleted successfully"
      );
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete service types:", error);
      toast.error("Failed to delete service types");
    }
  };

  // Handle percentage update
  const handlePercentageUpdate = async (percentage: number) => {
    try {
      console.log(
        "Updating percentage for service types:",
        selectedServiceTypes,
        percentage
      );
      // Update percentage for all selected service types
      await Promise.all(
        selectedServiceTypes.map((id) =>
          handleSetPercentage(id, Number(percentage.toFixed(2)))
        )
      );
      toast.success(
        selectedServiceTypes.length > 1
          ? "Percentage modifiers updated successfully"
          : "Percentage modifier updated successfully"
      );
      setIsSetPercentageDialogOpen(false);
    } catch (error) {
      console.error("Failed to update percentage modifier:", error);
      toast.error("Failed to update percentage modifier");
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
        refreshData={fetchServiceTypes}
        selectedServiceTypes={selectedServiceTypes}
        onSetPercentage={() => setIsSetPercentageDialogOpen(true)}
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
        onSetPercentage={() => setIsSetPercentageDialogOpen(true)}
      />

      <ServiceTypesPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        filteredServiceTypes={filteredServiceTypes}
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

      {/* Set Percentage Dialog */}
      <SetPercentageDialog
        isOpen={isSetPercentageDialogOpen}
        setIsOpen={setIsSetPercentageDialogOpen}
        serviceTypeIds={selectedServiceTypes}
        onSetPercentage={handlePercentageUpdate}
        ServiceTypes={serviceTypes}
      />
    </div>
  );
};

export default ServiceTypesList;
