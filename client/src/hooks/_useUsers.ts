import { useState, useEffect } from "react";
import { User } from "@/types/userTypes";
// import { useAuth } from "@/contexts/AuthContext";
import { mapApiUserToFrontend } from "@/utils/usersApi";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { ApiResponse } from "../types/apiTypes";
import { UseUsersReturn } from "@/types/hookTypes";
import { auth } from "@/firebase.config";

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  // const { currentUser } = useAuth();

  //Auth
  // const getAuth = useAuth();
  // const token = getAuth.currentUser?.getIdToken();

  // Fetching Users
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const authToken = await token;
      if (!API_KEY || !authToken) {
        throw new Error("API key or token is missing");
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(
          `Unauthorized, HTTP error! status: ${response.status} kindly login to access this data`
        );
      }

      const result: ApiResponse = await response.json();
      const mappedUsers = (result.users || []).map(mapApiUserToFrontend);
      setUsers(mappedUsers);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetching Workers
  const fetchWorkers = async () => {
    setLoading(true);

    try {
      const authToken = await token;
      if (!API_KEY || !authToken) {
        throw new Error("API key or token is missing");
      }

      const response = await fetch(`${API_BASE_URL}/users?type=worker`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(
          `Unauthorized, HTTP error! status: ${response.status} kindly login to access this data`
        );
      }

      const result: ApiResponse = await response.json();
      const mappedUsers = (result.users || []).map(mapApiUserToFrontend);
      setUsers(mappedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Edit UserData
  const handleEditUser = async (userData: Partial<User>): Promise<void> => {
    if (!userData.id) {
      throw new Error("User ID is required for editing");
    }

    try {
      setLoading(true);
      const authToken = await currentUser?.getIdToken();
      if (!API_KEY || !authToken) {
        throw new Error("API key or token is missing");
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
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to edit user");
    } finally {
      setLoading(false);
    }
  };

  // Delete Users
  const handleDeleteUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const authToken = await token;
      if (!API_KEY || !authToken) {
        throw new Error("API key or token is missing");
      }

      await Promise.all(
        selectedUsers.map(async (userId) =>
          fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          })
        )
      );
      setSelectedUsers([]);
      await fetchUsers();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete users"
      );
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
    handleEditUser,
    handleDeleteUsers,
    handleSelectAll,
    handleSelectUser,
    setEditingUser,
    setOpenUserDialog,
    setError,
    setSelectedUsers,
    fetchWorkers,
  };
};
