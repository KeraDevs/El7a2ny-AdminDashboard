import { useState, useCallback } from "react";
import { User } from "@/types/userTypes";
import { useAuth } from "@/contexts/AuthContext";
import { mapApiUserToFrontend } from "@/utils/usersApi";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { ApiResponse } from "@/types/apiTypes";
import { UseUsersReturn } from "@/types/hookTypes";
import toast from "react-hot-toast";

export const useUsers = (): UseUsersReturn => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);

  // Fetching All Users with proper pagination
  const fetchUsers = useCallback(async () => {
    if (!currentUser) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await currentUser.getIdToken();
      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      let allUsers: User[] = [];
      let hasMore = true;
      let offset = 0;
      const pageSize = 50;

      console.log("Starting to fetch users with pagination...");

      // Fetch all users in batches
      while (hasMore) {
        console.log(`Fetching users batch: skip=${offset}, take=${pageSize}`);

        const response = await fetch(
          `${API_BASE_URL}/users?skip=${offset}&take=${pageSize}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch users: ${response.status} ${response.statusText}`
          );
        }

        const result: ApiResponse = await response.json();
        const batchUsers = (result.users || []).map(mapApiUserToFrontend);

        console.log(`Fetched ${batchUsers.length} users in this batch`);

        allUsers = [...allUsers, ...batchUsers];
        hasMore = result.hasMore;
        offset += pageSize;

        // Safety check to prevent infinite loops
        if (batchUsers.length === 0) {
          console.log("No more users returned, stopping pagination");
          break;
        }

        // If we got less than the page size, we've reached the end
        if (batchUsers.length < pageSize) {
          console.log("Received less than page size, assuming end reached");
          hasMore = false;
        }
      }

      console.log(`Total users fetched: ${allUsers.length}`);
      setUsers(allUsers);
    } catch (error) {
      toast.error("Error fetching users!");
      setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchWorkers = useCallback(async () => {
    if (!currentUser) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await currentUser.getIdToken();
      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      let allWorkers: User[] = [];
      let hasMore = true;
      let offset = 0;
      const pageSize = 50;

      console.log("Starting to fetch workers with pagination...");

      while (hasMore) {
        console.log(`Fetching workers batch: skip=${offset}, take=${pageSize}`);

        const response = await fetch(
          `${API_BASE_URL}/users?type=worker&skip=${offset}&take=${pageSize}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch workers: ${response.status} ${response.statusText}`
          );
        }

        const result: ApiResponse = await response.json();
        const batchWorkers = (result.users || []).map(mapApiUserToFrontend);

        console.log(`Fetched ${batchWorkers.length} workers in this batch`);

        allWorkers = [...allWorkers, ...batchWorkers];
        hasMore = result.hasMore;
        offset += pageSize;

        // Safety check to prevent infinite loops
        if (batchWorkers.length === 0) {
          console.log("No more workers returned, stopping pagination");
          break;
        }

        // If we got less than the page size, we've reached the end
        if (batchWorkers.length < pageSize) {
          console.log("Received less than page size, assuming end reached");
          hasMore = false;
        }
      }

      console.log(`Total workers fetched: ${allWorkers.length}`);
      setUsers(allWorkers);
    } catch (err) {
      toast.error("Error fetching workers:");
      setError(err instanceof Error ? err.message : "Failed to fetch workers");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleEditUser = async (userData: Partial<User>): Promise<void> => {
    if (!userData.id) {
      throw new Error("User ID is required for editing");
    }

    if (!currentUser) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      const firstName =
        userData.first_name || userData.fullName?.split(" ")[0] || "";
      const lastName =
        userData.last_name || userData.fullName?.split(" ")[1] || "";

      const apiData = {
        id: userData.id,
        email: userData.email,
        first_name: firstName,
        last_name: lastName,
        national_id: userData.nationalNumber,
        phone: userData.phone,
        gender: userData.gender?.toLowerCase(),
        type: userData.userType,
      };

      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit user, status: ${response.status}`);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userData.id
            ? {
                ...user,
                ...userData,
                fullName: `${firstName} ${lastName}`,
              }
            : user
        )
      );
    } catch (error) {
      toast.error("Error editing user");
      setError(error instanceof Error ? error.message : "Failed to edit user");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete Users
  const handleDeleteUsers = async (): Promise<void> => {
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    if (selectedUsers.length === 0) {
      throw new Error("No users selected for deletion");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      const deletePromises = selectedUsers.map(async (userId) => {
        // Use the specified API endpoint
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: "DELETE",
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to delete user ${userId}: ${response.status}`
          );
        }
      });

      await Promise.all(deletePromises);

      // Update the local state to remove deleted users
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.id))
      );

      // Clear selection after successful deletion
      setSelectedUsers([]);

      toast.success(`Successfully deleted ${selectedUsers.length} user(s)`);
    } catch (error) {
      toast.error(
        "Error deleting users: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setError(
        error instanceof Error ? error.message : "Failed to delete users"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map((user) => user.id) : []);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return {
    users,
    selectedUsers,
    loading,
    error,
    editingUser,
    openUserDialog,
    fetchUsers,
    fetchWorkers,
    handleEditUser,
    handleDeleteUsers,
    handleSelectAll,
    handleSelectUser,
    setEditingUser,
    setOpenUserDialog,
    setError,
    setSelectedUsers,
  };
};
