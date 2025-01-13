import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import {
  Workshop,
  WorkshopFormProps,
  User,
  ApiUserResponse,
} from "../../types/types";

const API_BASE_URL = import.meta.env.VITE_API_RAIL_WAY;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = import.meta.env.VITE_TOKEN;

interface AssignOwnerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (userId: string) => void;
  currentOwnerId?: string;
}

const AssignOwnerDialog: React.FC<AssignOwnerDialogProps> = ({
  open,
  onClose,
  onSelect,
  currentOwnerId,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_RAIL_WAY;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const token = import.meta.env.VITE_TOKEN;

  const convertApiUserToUser = (
    apiUser: ApiUserResponse["users"][0]
  ): User => ({
    id: apiUser.id,
    email: apiUser.email,
    phone: apiUser.phone,
    nationalNumber: apiUser.national_id,
    profilePic: apiUser.profile_pic || "",
    gender: apiUser.gender as "Male" | "Female" | "Other",
    userType: apiUser.type as
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
    fullName: apiUser.fullName,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/users?type=workshop_admin&limit=100&offset=0`,
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>Assign Workshop Owner (Admin)</Typography>
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
          <Typography color="error">{error}</Typography>
        ) : users.length === 0 ? (
          <Typography color="textSecondary" textAlign="center" py={3}>
            No workshop administrators found
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    selected={user.id === currentOwnerId}
                    hover
                  >
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color={
                          user.id === currentOwnerId ? "success" : "primary"
                        }
                        onClick={() => {
                          onSelect(user.id);
                          onClose();
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

const WorkshopForm: React.FC<WorkshopFormProps> = ({
  workshop,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Workshop>>(
    workshop || {
      name: "",
      address: "",
      isActive: true,
      labels: [],
      services: [],
      phoneNumbers: [],
    }
  );
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);

  const handleServicesChange = (value: string) => {
    const services = value
      .split(",")
      .map((service) => service.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, services }));
  };

  const handleLabelsChange = (value: string) => {
    const labels = value
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, labels }));
  };

  return (
    <Box className="space-y-4 pt-2">
      <TextField
        fullWidth
        label="Workshop Name"
        value={formData.name || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        size="small"
      />

      <TextField
        fullWidth
        label="Address"
        value={formData.address || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, address: e.target.value }))
        }
        size="small"
      />

      <FormControl fullWidth size="small">
        <InputLabel>Status</InputLabel>
        <Select
          value={formData.isActive ? "active" : "inactive"}
          label="Status"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isActive: e.target.value === "active",
            }))
          }
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Services (comma separated)"
        value={formData.services?.join(", ") || ""}
        onChange={(e) => handleServicesChange(e.target.value)}
        size="small"
        helperText="Enter services separated by commas"
      />

      <TextField
        fullWidth
        label="Labels (comma separated)"
        value={formData.labels?.join(", ") || ""}
        onChange={(e) => handleLabelsChange(e.target.value)}
        size="small"
        helperText="Enter labels separated by commas"
      />

      <Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setShowOwnerDialog(true)}
          size="small"
          fullWidth
        >
          {formData.ownerId ? "Change Owner" : "Assign Owner"}
        </Button>
      </Box>

      <Box className="flex justify-end space-x-2 pt-4">
        <Button onClick={onClose} size="small">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(formData)}
          size="small"
        >
          {workshop ? "Update" : "Add"} Workshop
        </Button>
      </Box>

      <AssignOwnerDialog
        open={showOwnerDialog}
        onClose={() => setShowOwnerDialog(false)}
        onSelect={(userId) =>
          setFormData((prev) => ({ ...prev, ownerId: userId }))
        }
        currentOwnerId={formData.ownerId}
      />
    </Box>
  );
};

export default WorkshopForm;
