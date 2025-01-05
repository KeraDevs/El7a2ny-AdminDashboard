import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { User } from "../../types/types";

interface UserFormProps {
  user?: User;
  onSubmit: (data: Partial<User>) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      gender: "Male",
      userType: "Customer",
      isActive: true,
      labels: [],
    }
  );

  return (
    <Box className="space-y-4">
      <TextField
        fullWidth
        label="Email"
        value={formData.email || ""}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField
        fullWidth
        label="Phone"
        value={formData.phone || ""}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <TextField
        fullWidth
        label="National Number"
        value={formData.nationalNumber || ""}
        onChange={(e) =>
          setFormData({ ...formData, nationalNumber: e.target.value })
        }
      />
      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select
          value={formData.gender || "Male"}
          onChange={(e) =>
            setFormData({
              ...formData,
              gender: e.target.value as "Male" | "Female" | "Other",
            })
          }
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>User Type</InputLabel>
        <Select
          value={formData.userType || "Customer"}
          onChange={(e) =>
            setFormData({
              ...formData,
              userType: e.target.value as "Customer" | "Admin" | "Staff",
            })
          }
        >
          <MenuItem value="Customer">Customer</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Staff">Staff</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Labels (comma separated)"
        value={formData.labels?.join(", ") || ""}
        onChange={(e) => {
          const labels = e.target.value.split(",").map((label) => label.trim());
          setFormData({ ...formData, labels });
        }}
      />
      <Box className="flex justify-end space-x-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSubmit(formData)}>
          {user ? "Update" : "Add"} User
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
