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
  Checkbox,
  Avatar,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Refresh,
  Edit,
  Delete,
  Add,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useUsers } from "@hooks/users/useUsers";
import { dialogStyles } from "@config/styles";
import { User } from "../../../../types/userTypes";
import AddUserForm from "@components/Users/users/AddUserForm";
import EditUserForm from "@components/Users/users/EditUserForm";
import DeleteUsers from "@components/Users/users/DeleteUsers";

const UsersList: React.FC = () => {
  const {
    users,
    selectedUsers,
    loading,
    error,
    editingUser,
    openUserDialog,
    fetchUsers,
    handleEditUser,
    handleSelectAll,
    handleSelectUser,
    setEditingUser,
    setOpenUserDialog,
    setError,
    setSelectedUsers,
  } = useUsers();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addConfirmOpen, setAddConfirmOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [pendingAddData, setPendingAddData] = useState<Partial<User> | null>(
    null
  );
  const [pendingEditData, setPendingEditData] = useState<Partial<User> | null>(
    null
  );
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddFormSubmit = async (userData: Partial<User>) => {
    setPendingAddData(userData);
    setAddConfirmOpen(true);
  };

  const handleEditFormSubmit = async (userData: Partial<User>) => {
    setPendingEditData(userData);
    setEditConfirmOpen(true);
  };

  const handleConfirmAdd = async () => {
    try {
      await fetchUsers();
      setOpenUserDialog(false);
      setAddConfirmOpen(false);
      setPendingAddData(null);
    } catch (error) {
      console.error("Error adding user:", error);
      setError(error instanceof Error ? error.message : "Failed to add user");
    }
  };

  const handleConfirmEdit = async () => {
    try {
      if (pendingEditData) {
        await handleEditUser(pendingEditData);
      }
      setEditConfirmOpen(false);
      setEditingUser(null);
      setPendingEditData(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update user"
      );
    }
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      {/* Header Section */}
      <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="500">
            Customer List
          </Typography>
          <Box display="flex" gap={1}>
            <IconButton
              onClick={fetchUsers}
              disabled={loading}
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <Refresh />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenUserDialog(true)}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={selectedUsers.length === 0 || loading}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Delete Selected
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 3, py: 2 }}>
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Table Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer sx={{ p: 3 }}>
          <Table sx={{ minWidth: 800 }}>
            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{ borderBottom: "2px solid #eee" }}
                >
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
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar
                      src={user.profilePic || ""}
                      alt={user.fullName}
                      sx={{ width: 40, height: 40, border: "2px solid #eee" }}
                    />
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.nationalNumber}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>
                    {user.labels && user.labels.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {user.labels.map((label, index) => (
                          <Tooltip key={index} title={`Label: ${label}`}>
                            <Chip
                              label={label}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                borderRadius: "4px",
                                "& .MuiChip-label": { px: 1, py: 0.25 },
                              }}
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
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {user.cars.map((car) => (
                          <Tooltip
                            key={car.id}
                            title={
                              <Box>
                                <Typography variant="caption">
                                  VIN: {car.vin_number}
                                </Typography>
                                <br />
                                <Typography variant="caption">
                                  Model: {car.model}
                                </Typography>
                              </Box>
                            }
                          >
                            <Chip
                              label={car.license_plate}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                borderRadius: "4px",
                                "& .MuiChip-label": { px: 1, py: 0.25 },
                              }}
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
                        setPendingEditData(null);
                      }}
                      disabled={loading}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add User Dialog */}
      <Dialog
        open={openUserDialog}
        onClose={() => {
          setOpenUserDialog(false);
          setError(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
        sx={dialogStyles}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Add New User</Typography>
            <IconButton onClick={() => setOpenUserDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <AddUserForm
            onSubmit={handleAddFormSubmit}
            onClose={() => setOpenUserDialog(false)}
            loading={loading}
            open={openUserDialog}
            isEdit={false}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={!!editingUser}
        onClose={() => {
          setEditingUser(null);
          setError(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
        sx={dialogStyles}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Edit User</Typography>
            <IconButton onClick={() => setEditingUser(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingUser && (
            <EditUserForm
              user={editingUser}
              onSubmit={handleEditFormSubmit}
              onClose={() => setEditingUser(null)}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Confirmation Dialog */}
      <Dialog
        open={addConfirmOpen}
        onClose={() => setAddConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Confirm Add User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to add this new user?</Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setAddConfirmOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmAdd}
            sx={{ borderRadius: 2 }}
          >
            Add User
          </Button>
        </Box>
      </Dialog>

      {/* Edit Confirmation Dialog */}
      <Dialog
        open={editConfirmOpen}
        onClose={() => setEditConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update this user's information?
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setEditConfirmOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmEdit}
            sx={{ borderRadius: 2 }}
          >
            Update
          </Button>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteUsers
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        selectedUsers={selectedUsers}
        onSuccess={() => {
          fetchUsers();
          setSelectedUsers([]);
        }}
      />
    </Card>
  );
};

export default UsersList;
