"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useUsers } from "@/hooks/_useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/userTypes";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import modular components
import { UsersTableHeader } from "@/components/users/UsersTableHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { UsersPagination } from "@/components/users/UsersPagination";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { ViewUserDialog } from "@/components/users/ViewUserDialog";

// Column visibility type
export type ColumnVisibility = {
  name: boolean;
  email: boolean;
  phone: boolean;
  gender: boolean;
  userType: boolean;
  labels: boolean;
};

// Define a sorting state
export type SortConfig = {
  key: keyof User | null;
  direction: "asc" | "desc";
};

const UsersList: React.FC = () => {
  const { currentUser, isAuthorized, loading: authLoading } = useAuth();
  const {
    users,
    loading,
    error,
    fetchUsers,
    selectedUsers,
    handleSelectAll,
    handleSelectUser,
    handleDeleteUsers,
    handleEditUser,
  } = useUsers();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    phone: true,
    gender: true,
    userType: true,
    labels: true,
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  // Dialog states
  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewUserData, setViewUserData] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    if (isAuthorized && currentUser) {
      fetchUsers().catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      });
    }
  }, [isAuthorized, currentUser, fetchUsers]);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error,
      });
    }
  }, [error]);

  // Sort users based on current sort config
  const sortedUsers = useMemo(() => {
    const usersCopy = [...users];
    if (sortConfig.key) {
      usersCopy.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];

        // Handle different data types
        if (aValue === bValue) return 0;
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        // String comparison for string values
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Numeric comparison for numbers
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Default comparison for other types
        return sortConfig.direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return usersCopy;
  }, [users, sortConfig]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return sortedUsers;

    return sortedUsers.filter((user) => {
      const searchFields = [
        user.fullName,
        user.email,
        user.phone,
        user.gender,
        user.userType,
      ];

      return searchFields.some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [sortedUsers, searchQuery]);

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Handle sort
  const handleSort = (key: keyof User) => {
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

  // Handle edit user
  const handleEdit = (user: User) => {
    setEditUserData(user);
    setIsEditDialogOpen(true);
  };

  // Handle view user
  const handleView = (user: User) => {
    setViewUserData(user);
    setIsViewDialogOpen(true);
  };

  // Handle save edited user
  const handleSaveEdit = async () => {
    try {
      await handleEditUser(editUserData);
      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Handle delete selected users
  const handleDelete = async () => {
    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("No users selected", {
        description: "Please select at least one user to delete",
      });
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedUsers.length} user(s)?`
      )
    ) {
      try {
        await handleDeleteUsers();
        toast.success("Users deleted successfully");
      } catch (error) {
        toast.error("Failed to delete users", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  };

  // Show loading state while waiting for auth
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

  // Show auth error state if not authorized
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
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage your users and their permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
          {selectedUsers.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
        </div>
      </div>

      <UsersTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      />

      <UsersTable
        loading={loading}
        paginatedUsers={paginatedUsers}
        columnVisibility={columnVisibility}
        sortConfig={sortConfig}
        handleSort={handleSort}
        selectedUsers={selectedUsers}
        handleSelectAll={handleSelectAll}
        handleSelectUser={handleSelectUser}
        handleEdit={handleEdit}
        handleView={handleView}
        searchQuery={searchQuery}
        users={users}
      />

      <UsersPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        filteredUsers={filteredUsers}
        selectedUsers={selectedUsers}
      />

      <EditUserDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        userData={editUserData}
        setUserData={setEditUserData}
        onSave={handleSaveEdit}
      />

      <ViewUserDialog
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        userData={viewUserData}
        onEdit={() => {
          setIsViewDialogOpen(false);
          if (viewUserData) {
            handleEdit(viewUserData);
          }
        }}
      />
    </div>
  );
};

export default UsersList;
