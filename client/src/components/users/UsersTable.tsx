import React from "react";
import { User } from "@/types/userTypes";
import { ChevronsUpDown, Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnVisibility, SortConfig } from "@/app/(dashboard)/users/page";

interface UsersTableProps {
  loading: boolean;
  paginatedUsers: User[];
  columnVisibility: ColumnVisibility;
  sortConfig: SortConfig;
  handleSort: (key: keyof User) => void;
  selectedUsers: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectUser: (userId: string) => void;
  handleEdit: (user: User) => void;
  handleView: (user: User) => void;
  searchQuery: string;
  users: User[];
  onDelete: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  loading,
  paginatedUsers,
  columnVisibility,
  sortConfig,
  handleSort,
  selectedUsers,
  handleSelectAll,
  handleSelectUser,
  handleEdit,
  handleView,
  searchQuery,
  users,
  onDelete,
}) => {
  const visibleColumnCount =
    Object.values(columnVisibility).filter(Boolean).length + 2;

  // Function to get user type badge with appropriate color
  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case "superadmin":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            Super Admin
          </Badge>
        );
      case "workshopAdmin":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Workshop Admin
          </Badge>
        );
      case "worker":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Worker
          </Badge>
        );
      case "customer":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            Customer
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300 capitalize">
            {userType}
          </Badge>
        );
    }
  };

  // Function to get gender badge with appropriate color
  const getGenderBadge = (gender: string) => {
    return (
      <Badge
        className={
          gender === "male"
            ? "bg-sky-100 text-sky-800 border-sky-300"
            : "bg-pink-100 text-pink-800 border-pink-300"
        }
      >
        {gender === "male" ? "Male" : "Female"}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedUsers.length > 0 &&
                  selectedUsers.length === users.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {columnVisibility.name && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center gap-1">
                  Name
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "fullName" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.email && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "email" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.phone && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                <div className="flex items-center gap-1">
                  Phone
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "phone" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.gender && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("gender")}
              >
                <div className="flex items-center gap-1">
                  Gender
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "gender" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.userType && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("userType")}
              >
                <div className="flex items-center gap-1">
                  User Type
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "userType" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.labels && <TableHead>Labels</TableHead>}
            {columnVisibility.joinDate && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Join Date
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "createdAt" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumnCount}
                className="h-24 text-center"
              >
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Loading users...
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumnCount}
                className="h-24 text-center"
              >
                <div className="text-muted-foreground">
                  {searchQuery
                    ? "No users match your search"
                    : "No users found"}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                  />
                </TableCell>
                {columnVisibility.name && (
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {user.fullName.charAt(0)}
                      </div>
                      {user.fullName}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell>
                    <span className="text-blue-600 dark:text-blue-400 hover:underline">
                      {user.email}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.phone && (
                  <TableCell>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-xs font-mono">
                      {user.phone}
                    </code>
                  </TableCell>
                )}
                {columnVisibility.gender && (
                  <TableCell>{getGenderBadge(user.gender)}</TableCell>
                )}
                {columnVisibility.userType && (
                  <TableCell>{getUserTypeBadge(user.userType)}</TableCell>
                )}
                {columnVisibility.labels && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.labels && user.labels.length > 0 ? (
                        user.labels.map((label, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-800 border-gray-300"
                          >
                            {label}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          None
                        </span>
                      )}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.joinDate && (
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                      className="hover:bg-blue-100 hover:text-blue-800"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(user)}
                      className="hover:bg-green-100 hover:text-green-800"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {selectedUsers.length} users selected
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={loading}
            className="transition-all hover:bg-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
};
