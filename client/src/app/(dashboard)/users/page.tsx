"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useUsers } from "@/hooks/_useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/userTypes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { UsersTableHeader } from "@/components/users/UsersTableHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { UsersPagination } from "@/components/users/UsersPagination";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { ViewUserDialog } from "@/components/users/ViewUserDialog";

export type ColumnVisibility = {
  name: boolean;
  email: boolean;
  phone: boolean;
  gender: boolean;
  userType: boolean;
  labels: boolean;
  joinDate?: boolean;
};

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

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    phone: true,
    gender: true,
    userType: true,
    labels: true,
    joinDate: true,
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewUserData, setViewUserData] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthorized && currentUser) {
      fetchUsers().catch((err) => {
        toast.error("Failed to fetch users", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      });
    }
  }, [isAuthorized, currentUser, fetchUsers]);

  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error,
      });
    }
  }, [error]);

  const sortedUsers = useMemo(() => {
    const usersCopy = [...users];
    if (sortConfig.key) {
      usersCopy.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];

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
    return usersCopy;
  }, [users, sortConfig]);

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

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

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

  const handleAddUser = async (userData: Partial<User>) => {
    try {
      toast.success("User added successfully!");
      await fetchUsers();
      return Promise.resolve();
    } catch (error) {
      toast.error("Failed to add user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      return Promise.reject(error);
    }
  };

  const handleEdit = (user: User) => {
    setEditUserData(user);
    setIsEditDialogOpen(true);
  };

  const handleView = (user: User) => {
    setViewUserData(user);
    setIsViewDialogOpen(true);
  };

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
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage your users and their permissions
        </p>
      </div>

      <UsersTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        onAddUser={handleAddUser}
        refreshData={fetchUsers}
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
        onDelete={handleDelete}
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
