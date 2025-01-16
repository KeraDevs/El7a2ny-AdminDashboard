import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip,
} from "@mui/material";
import { User, UserFormProps } from "../../types/types";

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: user ? user.fullName.split(" ")[0] : "",
    lastName: user ? user.fullName.split(" ").slice(1).join(" ") : "",
    gender: user?.gender || "Male",
    userType: user?.userType || "customer",
    isActive: user?.isActive ?? true,
    labels: user?.labels || [],
  });

  const [labelInput, setLabelInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleLabelAdd = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && labelInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        labels: [...(prev.labels || []), labelInput.trim()],
      }));
      setLabelInput("");
    }
  };

  const handleDeleteLabel = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels?.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleSubmit = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    onSubmit({ ...formData, fullName });
  };

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        fullWidth
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />

      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select value={formData.gender} onChange={handleSelectChange("gender")}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>User Type</InputLabel>
        <Select
          value={formData.userType}
          onChange={handleSelectChange("userType")}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="workshopAdmin">Workshop Admin</MenuItem>
          <MenuItem value="worker">Worker</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Add Labels"
        value={labelInput}
        onChange={(e) => setLabelInput(e.target.value)}
        onKeyDown={handleLabelAdd}
        helperText="Press Enter to add labels"
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {formData.labels?.map((label, index) => (
          <Chip
            key={index}
            label={label}
            onDelete={() => handleDeleteLabel(index)}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {user ? "Update" : "Add"} User
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
