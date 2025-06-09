import React from "react";
import {
  ChevronsUpDown,
  Eye,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";
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
import { getGenderBadge, getUserTypeBadge } from "@/utils/usersStyles";

import { UsersTableProps } from "@/types/userTypes";

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
        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
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
              <TableRow
                key={user.id}
                className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 transition-all duration-200"
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
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {user.fullName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.fullName}
                      </span>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell>
                    <a
                      href={`mailto:${user.email}`}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline w-fit transition-colors duration-200"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </a>
                  </TableCell>
                )}
                {columnVisibility.phone && (
                  <TableCell>
                    <a
                      href={`tel:${user.phone}`}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline w-fit transition-colors duration-200"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <code className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-2 py-0.5 rounded-md text-xs font-mono border border-gray-200 dark:border-gray-600">
                        {user.phone}
                      </code>
                    </a>
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                      className="hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all duration-200"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(user)}
                      className="hover:bg-gradient-to-br hover:from-green-100 hover:to-green-200 hover:text-green-800 transition-all duration-200"
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
        <div className="w-full bg-gray-100 dark:bg-gray-800 border-t">
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {selectedUsers.length}
              </span>
              users selected
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
