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
import UserForm from "@components/Users/UsersForm";
import { useUsers } from "@hooks/useUsers";
import { dialogStyles } from "@config/styles";
import { User } from "../../../../types/types";

const UsersList: React.FC = () => {
  const {
    users,
    selectedUsers,
    loading,
    error,
    editingUser,
    openUserDialog,
    fetchUsers,
    handleAddUser,
    handleEditUser,
    handleDeleteUsers,
    handleSelectAll,
    handleSelectUser,
    setEditingUser,
    setOpenUserDialog,
    setError,
  } = useUsers();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<Partial<User> | null>(
    null
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                                "& .MuiChip-label": {
                                  px: 1,
                                  py: 0.25,
                                },
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
                                  VIN: {car.vinNumber}
                                </Typography>
                                <br />
                                <Typography variant="caption">
                                  Model: {car.model}
                                </Typography>
                              </Box>
                            }
                          >
                            <Chip
                              label={car.licensePlate}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                borderRadius: "4px",
                                "& .MuiChip-label": {
                                  px: 1,
                                  py: 0.25,
                                },
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
                        setPendingUserData(null);
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openUserDialog || !!editingUser}
        onClose={() => {
          setOpenUserDialog(false);
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
            <Typography>
              {editingUser ? "Edit User" : "Add New User"}
            </Typography>
            <IconButton
              onClick={() => {
                setOpenUserDialog(false);
                setEditingUser(null);
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <UserForm
            user={editingUser || undefined}
            onSubmit={(formData) => {
              setPendingUserData(formData);
              setOpenUserDialog(false);
              setUpdateConfirmOpen(true);
            }}
            onClose={() => {
              setOpenUserDialog(false);
              setEditingUser(null);
            }}
            open={openUserDialog || !!editingUser}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUsers.length} selected
            user(s)? This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setDeleteConfirmOpen(false);
              handleDeleteUsers();
            }}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog
        open={updateConfirmOpen}
        onClose={() => setUpdateConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          {editingUser ? "Update User" : "Add New User"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {`Are you sure you want to ${
              editingUser ? "update User information?" : "add New User?"
            }`}
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setUpdateConfirmOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setUpdateConfirmOpen(false);
              if (pendingUserData) {
                handleEditUser(pendingUserData);
              }
              setPendingUserData(null);
            }}
            sx={{ borderRadius: 2 }}
          >
            Update
          </Button>
        </Box>
      </Dialog>
    </Card>
  );
};

export default UsersList;
