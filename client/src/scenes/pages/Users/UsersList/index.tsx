import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Refresh, Edit, Delete, Add } from "@mui/icons-material";
import UserForm from "../../../../components/Users/UsersForm";
import { User, ApiUser, ApiResponse } from "../../../../types/types";

const API_BASE_URL = import.meta.env.VITE_API_RAIL_WAY;
const API_KEY = import.meta.env.VITE_API_RAIL_WAY;
const token = import.meta.env.VITE_TOKEN;

const mapApiUserToFrontend = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  fullName: apiUser.first_name + " " + apiUser.last_name,
  email: apiUser.email,
  phone: apiUser.phone,
  nationalNumber: apiUser.national_id,
  profilePic:
    apiUser.profile_pic ||
    "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
  gender: (apiUser.gender.charAt(0).toUpperCase() + apiUser.gender.slice(1)) as
    | "Male"
    | "Female",
  userType: (apiUser.type.charAt(0).toUpperCase() + apiUser.type.slice(1)) as
    | "customer"
    | "workshopAdmin"
    | "worker"
    | "superadmin",
  labels: [],
  isActive: true,
  cars: [],
  createdAt: apiUser.created_at,
  updatedAt: apiUser.updated_at,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
});

const UsersList: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
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

  const handleAddUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const apiData = {
        email: userData.email,
        first_name: userData.firstName || "",
        last_name: userData.lastName || "",
        national_id: userData.nationalNumber,
        phone: userData.phone,
        gender: userData.gender?.toLowerCase(),
        type: userData.userType?.toLowerCase(),
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add User! status: ${response.status}`);
      }

      await fetchUsers();
      setOpenUserDialog(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userData: Partial<User>) => {
    if (!editingUser) return;

    try {
      setLoading(true);
      const apiData = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        national_id: userData.nationalNumber,
        phone: userData.phone,
        gender: userData.gender?.toLowerCase(),
        type: userData.userType?.toLowerCase(),
      };

      const response = await fetch(`${API_BASE_URL}/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Response error! share status code: ${response.status} with your technical team`
        );
      }

      await fetchUsers();
      setEditingUser(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <Card className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5">Customer List</Typography>
        <Box className="space-x-2">
          <IconButton onClick={fetchUsers} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenUserDialog(true)}
            disabled={loading}
          >
            Add User
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            disabled={selectedUsers.length === 0 || loading}
          >
            Delete Selected
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="flex justify-center p-4">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.length === users.length}
                    indeterminate={
                      selectedUsers.length > 0 &&
                      selectedUsers.length < users.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell>Profile</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>National Number</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Labels</TableCell>
                <TableCell>Cars</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar src={user.profilePic || ""} alt={user.fullName} />
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.nationalNumber}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>
                    {user.labels && user.labels.length > 0 ? (
                      <Box className="space-x-1">
                        {user.labels.map((label, index) => (
                          <Tooltip key={index} title={`Label: ${label}`}>
                            <Chip
                              label={label}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No labels
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.cars && user.cars.length > 0 ? (
                      <Box className="space-x-1">
                        {user.cars.map((car) => (
                          <Tooltip key={car.id} title={`VIN: ${car.vinNumber}`}>
                            <Chip
                              label={car.licensePlate}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No cars
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? "Active" : "Inactive"}
                      color={user.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingUser(user);
                      }}
                      disabled={loading}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit/Add Dialog */}
      <Dialog
        open={openUserDialog || !!editingUser}
        onClose={() => {
          setOpenUserDialog(false);
          setEditingUser(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <UserForm
            user={editingUser || undefined}
            onSubmit={editingUser ? handleEditUser : handleAddUser}
            onClose={() => {
              setOpenUserDialog(false);
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UsersList;
