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
            <TableHead>Actions</TableHead>
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
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                  />
                </TableCell>
                {columnVisibility.name && (
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                )}
                {columnVisibility.email && <TableCell>{user.email}</TableCell>}
                {columnVisibility.phone && <TableCell>{user.phone}</TableCell>}
                {columnVisibility.gender && (
                  <TableCell className="capitalize">{user.gender}</TableCell>
                )}
                {columnVisibility.userType && (
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.userType}
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.labels && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.labels && user.labels.length > 0 ? (
                        user.labels.map((label, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
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
                {/* Only display join date when visible */}
                {columnVisibility.joinDate && (
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(user)}
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
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
};
