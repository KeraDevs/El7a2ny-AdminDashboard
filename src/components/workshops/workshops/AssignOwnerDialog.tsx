import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/types/userTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { toast } from "react-hot-toast";
import { Search, CheckCircle, UserCog, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mapApiUserToFrontend } from "@/utils/usersApi";
import { ApiResponse } from "@/types/apiTypes";

interface AssignOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (userId: string, userName: string) => void;
  currentOwnerId?: string;
}

export const AssignOwnerDialog: React.FC<AssignOwnerDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
  currentOwnerId,
}) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWorkshopAdmins = useCallback(async () => {
    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await currentUser.getIdToken();

      let allUsers: User[] = [];
      let hasMore = true;
      let offset = 0;
      const pageSize = 50;

      // Fetch all workshop admins in batches
      while (hasMore) {
        const response = await fetch(
          `${API_BASE_URL}/users?type=workshopAdmin&skip=${offset}&take=${pageSize}`,
          {
            headers: {
              "x-api-key": API_KEY || "",
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch workshop admins: ${response.status}`
          );
        }

        const data: ApiResponse = await response.json();
        const mappedUsers = data.users.map(mapApiUserToFrontend);

        allUsers = [...allUsers, ...mappedUsers];
        hasMore = data.hasMore;
        offset += pageSize;

        // Safety check to prevent infinite loops
        if (mappedUsers.length === 0 || mappedUsers.length < pageSize) {
          break;
        }
      }

      setUsers(allUsers);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch workshop admins";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (open) {
      fetchWorkshopAdmins();
    }
  }, [open, fetchWorkshopAdmins]);

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Select Workshop Owner</DialogTitle>
          <DialogDescription>
            Choose a workshop admin to be the owner of this workshop
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-80 overflow-y-auto border rounded-md">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery
                ? "No workshop admins match your search"
                : "No workshop admins found"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={
                      user.id === currentOwnerId
                        ? "bg-primary/5"
                        : "hover:bg-muted/50"
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <UserCog className="h-4 w-4" />
                        </div>
                        {user.fullName}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={
                          user.id === currentOwnerId ? "secondary" : "outline"
                        }
                        onClick={() => onSelect(user.id, user.fullName)}
                        className={
                          user.id === currentOwnerId
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : ""
                        }
                      >
                        {user.id === currentOwnerId ? (
                          <>
                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
