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
import { User, UserFormProps } from "../../types/types";

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
        label="Full Name"
        value={formData.fullName || ""}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        sx={{ margin: ".3rem 0 .3rem 0" }}
      />
      <TextField
        fullWidth
        label="Email"
        value={formData.email || ""}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        sx={{ margin: ".3rem 0 .3rem 0" }}
      />
      <TextField
        fullWidth
        label="Phone"
        value={formData.phone || ""}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        sx={{ margin: ".3rem 0 .3rem 0" }}
      />
      <TextField
        fullWidth
        label="National Number"
        value={formData.nationalNumber || ""}
        onChange={(e) =>
          setFormData({ ...formData, nationalNumber: e.target.value })
        }
        sx={{ margin: ".3rem 0 .3rem 0" }}
      />
      <InputLabel>Gender</InputLabel>
      <FormControl fullWidth>
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
      <InputLabel>User Type</InputLabel>
      <FormControl fullWidth>
        <Select
          value={formData.userType || "Customer"}
          onChange={(e) =>
            setFormData({
              ...formData,
              userType: e.target.value as
                | "Customer"
                | "Admin"
                | "Staff"
                | "SuperAdmin",
            })
          }
        >
          <MenuItem value="Customer">Customer</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Staff">Staff</MenuItem>
          <MenuItem value="SuperAdmin">Super Admin</MenuItem>
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
        sx={{ margin: ".3rem 0 .3rem 0" }}
      />
      <TextField
        fullWidth
        label="Cars VIN List"
        value={formData.labels?.join(", ") || ""}
        onChange={(e) => {
          const labels = e.target.value.split(",").map((label) => label.trim());
          setFormData({ ...formData, labels });
        }}
        sx={{ margin: ".3rem 0 .3rem 0" }}
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
