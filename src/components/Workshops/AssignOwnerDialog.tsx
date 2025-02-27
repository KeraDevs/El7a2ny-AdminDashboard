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
import { User } from "../../types/userTypes";
import { ApiUserResponse } from "../../types/apiTypes";
import { AssignOwnerDialogProps } from "../../types/workshopTypes";

import { VITE_API_RAIL_WAY, API_KEY } from "../../config/config";
import { dialogStyles } from "../../config/styles";
import { convertApiUserToUser } from "@utils/workshops/workshopsApi";
import { useAuth } from "src/contexts/AuthContext";

export const AssignOwnerDialog: React.FC<AssignOwnerDialogProps> = ({
  open,
  onClose,
  onSelect,
  currentOwnerId,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Auth
  const getAuth = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      if (!open) return;

      setLoading(true);
      try {
        const token = await getAuth.currentUser?.getIdToken();

        const response = await fetch(
          `${VITE_API_RAIL_WAY}/users?type=workshopAdmin`,
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
        if (isMounted) {
          const mappedUsers = data.users.map(convertApiUserToUser);
          setUsers(mappedUsers);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch workshop admins"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [open, getAuth.currentUser]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={dialogStyles}
      aria-labelledby="assign-owner-dialog-title"
      disableRestoreFocus
    >
      <DialogTitle id="assign-owner-dialog-title">
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
