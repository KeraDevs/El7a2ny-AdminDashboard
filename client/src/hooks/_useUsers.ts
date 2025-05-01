import { useState, useCallback } from "react";
import { User } from "@/types/userTypes";
import { useAuth } from "@/contexts/AuthContext";
import { mapApiUserToFrontend } from "@/utils/usersApi";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { ApiResponse } from "@/types/apiTypes";
import { UseUsersReturn } from "@/types/hookTypes";

export const useUsers = (): UseUsersReturn => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);

  // Fetching All Users
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

      // Initial fetch to get the first batch
      const response = await fetch(`${API_BASE_URL}/users?take=50`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch users: ${response.status} ${response.statusText}`
        );
      }

      const initialResult: ApiResponse = await response.json();
      let allUsers = (initialResult.users || []).map(mapApiUserToFrontend);

      // Keep fetching until hasMore is false
      let hasMore = initialResult.hasMore;
      let offset = 50; // First skip will be 50

      while (hasMore) {
        const nextPageResponse = await fetch(
          `${API_BASE_URL}/users?skip=${offset}&take=50`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!nextPageResponse.ok) {
          throw new Error(
            `Failed to fetch users page: ${nextPageResponse.status}`
          );
        }

        const nextPageResult: ApiResponse = await nextPageResponse.json();
        const nextPageUsers = (nextPageResult.users || []).map(
          mapApiUserToFrontend
        );

        allUsers = [...allUsers, ...nextPageUsers];
        hasMore = nextPageResult.hasMore;
        offset += 50;

        // Safety check - if no users returned but hasMore is true, break to avoid infinite loop
        if (nextPageUsers.length === 0) {
          break;
        }
      }

      console.log(`Fetched all ${allUsers.length} users successfully`);
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetching Workers
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

      // Fetch all workers using the same approach
      let allWorkers: User[] = [];
      let hasMore = true;
      let offset = 0;

      while (hasMore) {
        const response = await fetch(
          `${API_BASE_URL}/users?type=worker&skip=${offset}&take=50`,
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
        const mappedUsers = (result.users || []).map(mapApiUserToFrontend);

        allWorkers = [...allWorkers, ...mappedUsers];
        hasMore = result.hasMore;
        offset += 50;

        // Safety check
        if (mappedUsers.length === 0) {
          break;
        }
      }

      console.log(`Fetched all ${allWorkers.length} workers successfully`);
      setUsers(allWorkers);
    } catch (err) {
      console.error("Error fetching workers:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch workers");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Edit UserData
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
        type: userData.userType?.toLowerCase(),
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

      // Update the user in the current state
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
      console.error("Error editing user:", error);
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

      // Process all deletion requests in parallel
      const deletePromises = selectedUsers.map(async (userId) => {
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

      // Wait for all deletions to complete
      await Promise.all(deletePromises);

      // Remove deleted users from the current state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.id))
      );

      // Clear selection
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting users:", error);
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
