"use client";
import React, { useEffect } from "react";
import MiniSearchBar from "@/components/Navbar/MiniSearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationComponent from "@/components/users/Pagination";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useUsers } from "@/hooks/_useUsers";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types/userTypes";
// import { useAuth } from "@/contexts/AuthContext";

const UsersList: React.FC = () => {
  // const auth = useAuth();

  const {
    users,
    loading,
    error,
    fetchUsers,
    selectedUsers,
    handleSelectAll,
    handleSelectUser,
    handleDeleteUsers,
    setEditingUser,
    setOpenUserDialog,
  } = useUsers();

  // useEffect(() => {
  // Only fetch users if authenticated
  //   if (auth.currentUser) {
  //     fetchUsers();
  //   } else {
  //     toast.error("Authentication required", {
  //       description: "Please log in to view users",
  //     });
  //   }
  // }, [auth.currentUser]); // Added auth.currentUser as a dependency

  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error,
      });
    }
  }, [error]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setOpenUserDialog(true);
  };

  const handleViewClick = (user: User) => {
    // Implement view functionality
    console.log("Viewing user:", user);
  };

  const handleDelete = async () => {
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
      await handleDeleteUsers();
      toast.success("Success", {
        description: "Selected users have been deleted",
      });
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="p-4 flex justify-between items-center">
        <MiniSearchBar />
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

      <div className="overflow-x-auto flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    selectedUsers.length > 0 &&
                    selectedUsers.length === users.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Phone</TableHead>
              <TableHead className="font-bold">Gender</TableHead>
              <TableHead className="font-bold">User Type</TableHead>
              <TableHead className="font-bold">Labels</TableHead>
              <TableHead className="cursor-pointer w-10">
                <Pencil size={16} />
              </TableHead>
              <TableHead className="cursor-pointer w-10">
                <Eye size={16} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell className="capitalize">{user.gender}</TableCell>
                  <TableCell className="capitalize">{user.userType}</TableCell>
                  <TableCell>
                    {user.labels?.map((label, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 rounded-full px-2 py-1 text-xs mr-1"
                      >
                        {label}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewClick(user)}
                    >
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-auto p-4 flex flex-col items-center">
        <PaginationComponent />
      </div>
    </div>
  );
};

export default UsersList;
