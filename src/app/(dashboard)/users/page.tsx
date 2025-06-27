"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useUsers } from "@/hooks/_useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/userTypes";
import { toast } from "react-hot-toast";
import { Loader2, Users, UserPlus, Settings, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { UsersTableHeader } from "@/components/users/UsersTableHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { UsersPagination } from "@/components/users/UsersPagination";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { ViewUserDialog } from "@/components/users/ViewUserDialog";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

// Users Statistics Component
const UsersStats = ({ users }: { users: User[] }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.userType === "customer").length;
  const adminUsers = users.filter(
    (u) => u.userType === "superadmin" || u.userType === "workshopAdmin"
  ).length;
  const recentUsers = users.filter((u) => {
    const joinDate = new Date(u.createdAt || Date.now());
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate > thirtyDaysAgo;
  }).length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      description: "All registered users",
      trend: "+12.5%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Active Customers",
      value: activeUsers.toString(),
      icon: UserPlus,
      description: "Customer accounts",
      trend: "+8.2%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Admin Users",
      value: adminUsers.toString(),
      icon: Settings,
      description: "Admin accounts",
      trend: "+2.1%",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Recent Joins",
      value: recentUsers.toString(),
      icon: TrendingUp,
      description: "Last 30 days",
      trend: "+15.3%",
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
      fetchUsers().catch(() => {
        toast.error("Failed to fetch users");
      });
    }
  }, [isAuthorized, currentUser, fetchUsers]);

  useEffect(() => {
    if (error) {
      toast.error("Error");
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

  const handleAddUser = async () => {
    try {
      toast.success("User added successfully!");
      await fetchUsers();
      return Promise.resolve();
    } catch (error) {
      toast.error("Failed to add user");
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
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("No users selected");
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
      } catch {
        toast.error("Failed to delete users");
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
            Users Management
          </h1>
          <p className="text-muted-foreground">
            Manage your users and their permissions
          </p>
        </div>
      </motion.div>
      <UsersStats users={users} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Card className="overflow-hidden">
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
          <div className="p-4 pt-0">
            <UsersPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              filteredUsers={filteredUsers}
              selectedUsers={selectedUsers}
            />
          </div>
        </Card>
      </motion.div>
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
      
      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={paginatedUsers.map(user => ({
          id: user.id,
          name: user.fullName || `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone ? `+${String(user.phone)}` : '',
          gender: user.gender,
          userType: user.userType,
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
          isActive: user.isActive ? 'Active' : 'Inactive',
          nationalNumber: String(user.nationalNumber || ''),
          labels: user.labels?.join(', ') || ''
        }))}
        filename={`users-page-${currentPage}`}
        pageName="Users Management"
        headers={[
          { label: 'ID', key: 'id' },
          { label: 'Full Name', key: 'name' },
          { label: 'Email', key: 'email' },
          { label: 'Phone', key: 'phone' },
          { label: 'Gender', key: 'gender' },
          { label: 'User Type', key: 'userType' },
          { label: 'Join Date', key: 'joinDate' },
          { label: 'Status', key: 'isActive' },
          { label: 'National Number', key: 'nationalNumber' },
          { label: 'Labels', key: 'labels' }
        ]}
      />
    </div>
  );
};

export default UsersList;
