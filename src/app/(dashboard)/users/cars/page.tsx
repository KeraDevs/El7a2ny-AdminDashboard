"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useUsersCars } from "@/hooks/_useUsersCars";
import { useAuth } from "@/contexts/AuthContext";
import {
  CarWithDetails,
  ColumnVisibility,
  defaultColumnVisibility,
} from "@/types/carTypes";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

import { UsersCarsTableHeader } from "@/components/users/UsersCarsTableHeader";
import { UsersCarsTable } from "@/components/users/UsersCarsTable";
import { UsersCarsPagination } from "@/components/users/UsersCarsPagination";
import { UsersCarsStats } from "@/components/users/UsersCarsStats";
import { ViewCarDialog } from "@/components/users/ViewCarDialog";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

interface SortConfig {
  key: keyof CarWithDetails | "owner" | "brand";
  direction: "asc" | "desc";
}

const UsersCarsPage: React.FC = () => {
  const { usersCars, loading, fetchUserCars } = useUsersCars();
  const { currentUser, isAuthorized, loading: authLoading } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    defaultColumnVisibility
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "desc",
  });
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewCarData, setViewCarData] = useState<CarWithDetails | null>(null);

  // Initialize data
  useEffect(() => {
    if (currentUser && !loading && usersCars.length === 0) {
      fetchUserCars();
    }
  }, [currentUser, loading, usersCars.length, fetchUserCars]);

  // Sorted cars
  const sortedCars = useMemo(() => {
    if (!usersCars || !Array.isArray(usersCars)) {
      return [];
    }

    return [...usersCars].sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      // Handle nested properties
      if (sortConfig.key === "owner") {
        aValue = `${a.owner?.first_name || ""} ${
          a.owner?.last_name || ""
        }`.trim();
        bValue = `${b.owner?.first_name || ""} ${
          b.owner?.last_name || ""
        }`.trim();
      } else if (sortConfig.key === "brand") {
        aValue = a.brand?.name || "";
        bValue = b.brand?.name || "";
      } else {
        aValue = a[sortConfig.key] as string | number | undefined;
        bValue = b[sortConfig.key] as string | number | undefined;
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

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

      return 0;
    });
  }, [usersCars, sortConfig]);

  // Filtered cars
  const filteredCars = useMemo(() => {
    if (!searchQuery) return sortedCars;

    return sortedCars.filter((car) => {
      const searchFields = [
        car.model,
        car.license_plate,
        car.vin_number,
        car.year?.toString(),
        car.brand?.name,
        car.owner?.first_name,
        car.owner?.last_name,
        car.owner?.email,
        car.owner?.phone,
      ];

      return searchFields.some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [sortedCars, searchQuery]);

  // Paginated cars
  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCars.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCars, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredCars.length / rowsPerPage);

  // Event handlers
  const handleSort = (key: keyof CarWithDetails | "owner" | "brand") => {
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

  const handleSelectCar = (carId: string) => {
    setSelectedCars((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(paginatedCars.map((car) => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  // Prepare data for CSV export
  const csvData = useMemo(() => {
    return filteredCars.map((car) => ({
      owner_name: `${car.owner?.first_name || ""} ${
        car.owner?.last_name || ""
      }`.trim(),
      owner_email: car.owner?.email || "",
      owner_phone: car.owner?.phone || "",
      model: car.model || "",
      year: car.year || "",
      license_plate: car.license_plate || "",
      vin_number: car.vin_number || "",
      brand_name: car.brand?.name || "",
      region_name: car.region?.name || "",
      turbo: car.turbo ? "Yes" : "No",
      exotic: car.exotic ? "Yes" : "No",
      created_at: car.created_at || "",
      updated_at: car.updated_at || "",
    }));
  }, [filteredCars]);

  // Column visibility for CSV
  const csvColumnVisibility = useMemo(() => {
    return {
      owner_name: columnVisibility.owner_name,
      owner_email: columnVisibility.owner_email,
      owner_phone: true, // Always include phone in export
      model: columnVisibility.model,
      year: columnVisibility.year,
      license_plate: columnVisibility.license_plate,
      vin_number: columnVisibility.vin_number,
      brand_name: columnVisibility.brand_name,
      region_name: columnVisibility.region_name,
      turbo: columnVisibility.turbo,
      exotic: columnVisibility.exotic,
      created_at: true,
      updated_at: true,
    };
  }, [columnVisibility]);

  const handleView = (car: CarWithDetails) => {
    setViewCarData(car);
    setIsViewDialogOpen(true);
  };

  // Loading states
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
            Users Cars Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all user vehicles
          </p>
        </div>
      </motion.div>

      <UsersCarsStats cars={usersCars as CarWithDetails[]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Card className="overflow-hidden">
          <UsersCarsTableHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            refreshData={fetchUserCars}
            // selectedCars prop removed
          />
          <UsersCarsTable
            cars={usersCars as CarWithDetails[]}
            selectedCars={selectedCars}
            onSelectCar={handleSelectCar}
            handleSelectAll={handleSelectAll}
            columnVisibility={columnVisibility}
            handleView={handleView}
            handleSort={handleSort}
            searchQuery={searchQuery}
            loading={loading}
            paginatedCars={paginatedCars}
            sortConfig={sortConfig}
            handleSelectCar={handleSelectCar}
          />
          <div className="p-4 pt-0">
            <UsersCarsPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              filteredCars={filteredCars}
              selectedCars={selectedCars}
            />
          </div>
        </Card>
      </motion.div>

      <ViewCarDialog
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        car={viewCarData}
      />

      <FloatingDownloadButton
        data={csvData}
        filename="users-cars"
        columnVisibility={csvColumnVisibility}
      />
    </div>
  );
};

export default UsersCarsPage;
