import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { API_KEY, VITE_API_RAIL_WAY } from "@config/config";
import { useAuth } from "src/contexts/AuthContext";
import { deleteUser } from "firebase/auth";

interface DeleteUsersProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: string[];
  onSuccess: () => void;
}

const DeleteUsers: React.FC<DeleteUsersProps> = ({
  open,
  onClose,
  selectedUsers,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const errors: string[] = [];

      for (const userId of selectedUsers) {
        try {
          const backendResponse = await fetch(
            `${VITE_API_RAIL_WAY}/users/${userId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!backendResponse.ok) {
            throw new Error(`Failed to delete user from backend: ${userId}`);
          }

          if (currentUser && currentUser.uid === userId) {
            await deleteUser(currentUser);
          }
        } catch (error) {
          console.error(`Error deleting user ${userId}:`, error);
          errors.push(
            error instanceof Error
              ? error.message
              : `Failed to delete user ${userId}`
          );
          continue;
        }
      }

      if (errors.length > 0) {
        setError(`Some users could not be deleted: ${errors.join(", ")}`);
      } else {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting users:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete users"
      );
    } finally {
      setLoading(false);
    }
  };

  const isCurrentUserSelected =
    currentUser && selectedUsers.includes(currentUser.uid);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete {selectedUsers.length} selected
          user(s)? This action cannot be undone.
        </Typography>

        {isCurrentUserSelected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Warning: You are about to delete your own account. This will log you
            out of the system.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteUsers}
          disabled={loading}
          sx={{
            borderRadius: 2,
            minWidth: 100,
            position: "relative",
          }}
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                color: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          ) : (
            "Delete"
          )}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteUsers;
