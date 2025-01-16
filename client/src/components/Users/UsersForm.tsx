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
  const [formData, setFormData] = useState<Partial<User>>(() => {
    if (user) {
      const [firstName, ...lastNameParts] = user.fullName.split(" ");
      return {
        ...user,
        firstName,
        lastName: lastNameParts.join(" "),
      };
    }
    return {
      gender: "Male",
      userType: "customer",
      isActive: true,
      labels: [],
    };
  });

  const handleSubmit = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    onSubmit({
      ...formData,
      fullName,
    });
  };
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        label="First Name"
        value={formData.firstName || ""}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        sx={{ margin: ".3rem 0 .3rem 0" }}
      />
      <TextField
        fullWidth
        label="Last Name"
        value={formData.firstName || ""}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        sx={{ margin: ".3rem 0 .3rem 0" }}
      />

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
          value={formData.userType || "customer"}
          onChange={(e) =>
            setFormData({
              ...formData,
              userType: e.target.value as
                | "customer"
                | "workshopAdmin"
                | "worker"
                | "superadmin",
            })
          }
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="workshopAdmin">Workshop Admin</MenuItem>
          <MenuItem value="worker">Worker</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
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

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ borderRadius: 2 }}
        >
          {user ? "Update" : "Add"} User
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
