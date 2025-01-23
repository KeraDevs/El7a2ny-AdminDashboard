import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  User,
  ApiUserResponse,
  AssignOwnerDialogProps,
} from "../../types/types";
import { API_BASE_URL, API_KEY, token } from "../../config/config";
import { dialogStyles } from "../../config/styles";
import { convertApiUserToUser } from "../../utils/workshopsApi";

export const AssignOwnerDialog: React.FC<AssignOwnerDialogProps> = ({
  open,
  onClose,
  onSelect,
  currentOwnerId,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/users?type=workshopAdmin`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data: ApiUserResponse = await response.json();
        const mappedUsers = data.users.map(convertApiUserToUser);
        setUsers(mappedUsers);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch workshop admins"
        );
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open, API_BASE_URL, API_KEY, token]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={dialogStyles}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Select Workshop Owner</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" p={2}>
            {error}
          </Typography>
        ) : (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    selected={user.id === currentOwnerId}
                  >
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color={
                          user.id === currentOwnerId ? "success" : "primary"
                        }
                        onClick={() => onSelect(user.id, user.fullName)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          boxShadow: "none",
                        }}
                      >
                        {user.id === currentOwnerId ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};
