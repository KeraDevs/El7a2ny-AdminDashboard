"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useServiceTypes } from "@/hooks/_useServices";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { ServiceTypesTableHeader } from "@/components/workshops/services/ServiceTypeHeader";
import { ServiceTypesTable } from "@/components/workshops/services/ServiceTypeTable";
import { ServiceTypesPagination } from "@/components/workshops/services/ServiceTypePagination";
import { EditServiceTypeDialog } from "@/components/workshops/services/EditServiceTypeDialog";
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

  useEffect(() => {
    if (isAuthorized && currentUser) {
      fetchServiceTypes().catch((err) => {
        toast.error("Failed to fetch service types");
      });
    }
  }, [isAuthorized, currentUser, fetchServiceTypes]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const sortedServiceTypes = useMemo(() => {
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

  const paginatedServiceTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredServiceTypes.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredServiceTypes, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredServiceTypes.length / rowsPerPage);

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

  const handleEdit = (serviceType: ServiceType) => {
    setEditServiceTypeData(serviceType);
    setIsEditDialogOpen(true);
  };

  const handleView = (serviceType: ServiceType) => {
    setViewServiceTypeData(serviceType);
    setIsViewDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await handleEditServiceType(editServiceTypeData);
      toast.success("Service type updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update service type");
    }
  };

  const handleDelete = async () => {
    try {
      await handleDeleteServiceTypes(selectedServiceTypes);
      toast.success("Service types deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete service types");
    }
  };

  const handlePercentageUpdate = async (percentage: number) => {
    try {
      // If you want to update percentage for multiple service types, call handleSetPercentage for each ID
      await Promise.all(
        selectedServiceTypes.map((id) =>
          handleSetPercentage(id, Number(percentage.toFixed(2)))
        )
      );
      toast.success("Percentage modifier updated successfully");
      setIsSetPercentageDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update percentage modifier");
    }
  };

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

      <EditServiceTypeDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        serviceTypeData={editServiceTypeData}
        setServiceTypeData={setEditServiceTypeData}
        onSave={handleSaveEdit}
        onSuccess={fetchServiceTypes}
      />

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

      <DeleteServiceTypeDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        serviceTypeIds={selectedServiceTypes}
        onDelete={handleDelete}
        ServiceTypes={serviceTypes}
      />

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
