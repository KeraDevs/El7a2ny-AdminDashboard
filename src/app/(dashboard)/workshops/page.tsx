"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useWorkshops } from "@/hooks/_useWorkshops";
import { useAuth } from "@/contexts/AuthContext";
import { Workshop } from "@/types/workshopTypes";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { WorkshopsTableHeader } from "@/components/workshops/workshops/WorkshopsTableHeader";
import { WorkshopsTable } from "@/components/workshops/workshops/WorkShopsTable";
import { WorkshopsPagination } from "@/components/workshops/workshops/WorkshopsPagination";
import { EditWorkshopDialog } from "@/components/workshops/workshops/EditWorkshopDialog";
import { ViewWorkshopDialog } from "@/components/workshops/workshops/ViewWorkshopDialog";
import { WorkshopColumnVisibility } from "@/types/workshopTypes";
import { SortConfig } from "@/types/workshopTypes";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

const WorkshopsList: React.FC = () => {
  const { currentUser, isAuthorized, loading: authLoading } = useAuth();
  const {
    workshops,
    loading,
    error,
    fetchWorkshops,
    selectedWorkshops,
    handleSelectAll,
    handleSelectWorkshop,
    handleDeleteWorkshops,
    handleEditWorkshop,
    handleAddWorkShop,
  } = useWorkshops();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [columnVisibility, setColumnVisibility] =
    useState<WorkshopColumnVisibility>({
      name: true,
      email: true,
      address: true,
      phone: true,
      status: true,
      createdDate: true,
      ratings: true,
      services: true,
    });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const [editWorkshopData, setEditWorkshopData] = useState<Partial<Workshop>>(
    {}
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewWorkshopData, setViewWorkshopData] = useState<Workshop | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthorized && currentUser) {
      fetchWorkshops().catch(() => {
        toast.error("Failed to fetch workshops");
      });
    }
  }, [isAuthorized, currentUser, fetchWorkshops]);

  useEffect(() => {
    if (error) {
      toast.error("Error");
    }
  }, [error]);

  const sortedWorkshops = useMemo(() => {
    const workshopsCopy = [...workshops];
    if (sortConfig.key) {
      workshopsCopy.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Workshop];
        const bValue = b[sortConfig.key as keyof Workshop];

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
    return workshopsCopy;
  }, [workshops, sortConfig]);

  const filteredWorkshops = useMemo(() => {
    if (!searchQuery) return sortedWorkshops;

    return sortedWorkshops.filter((workshop) => {
      const searchFields = [
        workshop.name,
        workshop.email,
        workshop.address,
        workshop.status,
      ];

      return searchFields.some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [sortedWorkshops, searchQuery]);

  const paginatedWorkshops = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredWorkshops.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredWorkshops, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredWorkshops.length / rowsPerPage);

  const handleSort = (key: keyof Workshop) => {
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

  const handleEdit = (workshop: Workshop) => {
    setEditWorkshopData(workshop);
    setIsEditDialogOpen(true);
  };

  const handleView = (workshop: Workshop) => {
    setViewWorkshopData(workshop);
    setIsViewDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await handleEditWorkshop(editWorkshopData);
      toast.success("Workshop updated successfully");
      setIsEditDialogOpen(false);
    } catch {
      toast.error("Failed to update workshop");
    }
  };

  const handleDelete = async () => {
    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    if (selectedWorkshops.length === 0) {
      toast.error("No workshops selected");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedWorkshops.length} workshop(s)?`
      )
    ) {
      try {
        await handleDeleteWorkshops();
        toast.success("Workshops deleted successfully");
      } catch {
        toast.error("Failed to delete workshops");
      }
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
        <h1 className="text-2xl font-semibold tracking-tight">Workshops</h1>
        <p className="text-muted-foreground">
          Manage workshops and their details
        </p>
      </div>

      <WorkshopsTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        onAddWorkshop={handleAddWorkShop}
        refreshData={fetchWorkshops}
      />

      <WorkshopsTable
        loading={loading}
        paginatedWorkshops={paginatedWorkshops}
        columnVisibility={columnVisibility}
        sortConfig={sortConfig}
        handleSort={handleSort}
        selectedWorkshops={selectedWorkshops}
        handleSelectAll={handleSelectAll}
        handleSelectWorkshop={handleSelectWorkshop}
        handleEdit={handleEdit}
        handleView={handleView}
        searchQuery={searchQuery}
        workshops={workshops}
        onDelete={handleDelete}
      />

      <WorkshopsPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        filteredWorkshops={filteredWorkshops}
        selectedWorkshops={selectedWorkshops}
      />

      <EditWorkshopDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        workshopData={editWorkshopData}
        setWorkshopData={setEditWorkshopData}
        onSave={handleSaveEdit}
      />

      <ViewWorkshopDialog
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        workshopData={viewWorkshopData}
        onEdit={() => {
          setIsViewDialogOpen(false);
          if (viewWorkshopData) {
            handleEdit(viewWorkshopData);
          }
        }}
      />

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={paginatedWorkshops.map((workshop) => ({
          id: workshop.id,
          name: workshop.name,
          email: workshop.email,
          phone: workshop.phoneNumbers?.[0]?.phone_number
            ? `+${String(workshop.phoneNumbers[0].phone_number)}`
            : "",
          address: workshop.address,
          status: workshop.active_status,
          createdDate: workshop.createdAt
            ? new Date(workshop.createdAt).toLocaleDateString()
            : "",
          rating: workshop.ratings || "Not rated",
          services: workshop.services?.length || 0,
          totalReviews: workshop.totalReviews || 0,
        }))}
        filename={`workshops-page-${currentPage}`}
        pageName="Workshops Management"
        headers={[
          { label: "ID", key: "id" },
          { label: "Workshop Name", key: "name" },
          { label: "Email", key: "email" },
          { label: "Phone", key: "phone" },
          { label: "Address", key: "address" },
          { label: "Status", key: "status" },
          { label: "Created Date", key: "createdDate" },
          { label: "Rating", key: "rating" },
          { label: "Services Count", key: "services" },
          { label: "Total Reviews", key: "totalReviews" },
        ]}
      />
    </div>
  );
};

export default WorkshopsList;
