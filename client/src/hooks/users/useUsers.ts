import { useState } from "react";
import { mapApiUserToFrontend } from "@utils/users/usersApi";
import { ApiResponse, User, UseUsersReturn } from "../../types/userTypes";
import { useAuth } from "src/contexts/AuthContext";
import { API_KEY, VITE_API_RAIL_WAY } from "@config/config";

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);

  //Auth
  const getAuth = useAuth();
  const token = getAuth.currentUser?.getIdToken();

  // fetching users
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${VITE_API_RAIL_WAY}/users`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${await token}`,
        },
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

  const handleEditUser = async (userData: Partial<User>): Promise<void> => {
    if (!userData.id) {
      throw new Error("User ID is required for editing");
    }

    try {
      setLoading(true);
      const apiData = {
        id: userData.id,
        email: userData.email,
        first_name: userData.firstName || userData.fullName?.split(" ")[0],
        last_name: userData.lastName || userData.fullName?.split(" ")[1],
        national_id: userData.nationalNumber,
        phone: userData.phone,
        gender: userData.gender?.toLowerCase(),
        type: userData.userType?.toLowerCase(),
      };

      const response = await fetch(
        `${VITE_API_RAIL_WAY}/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${await token}`,
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update user: ${errorData.message || response.statusText}`
        );
      }
      setOpenUserDialog(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update user"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      await Promise.all(
        selectedUsers.map(async (userId) =>
          fetch(`${VITE_API_RAIL_WAY}/users/${userId}`, {
            method: "DELETE",
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${await token}`,
            },
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
  };
};
