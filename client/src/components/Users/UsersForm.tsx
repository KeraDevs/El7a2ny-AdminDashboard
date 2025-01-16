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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
        maxWidth: 600,
        mx: "auto",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
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

      <FormControl fullWidth variant="outlined">
        <InputLabel id="gender-label" shrink={true}>
          Gender
        </InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          label="Gender"
          value={formData.gender}
          onChange={handleSelectChange("gender")}
          displayEmpty
          sx={{ borderRadius: 2 }}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel id="userType-label" shrink={true}>
          User Type
        </InputLabel>
        <Select
          labelId="userType-label"
          id="userType"
          label="User Type"
          value={formData.userType}
          onChange={handleSelectChange("userType")}
          displayEmpty
          sx={{ borderRadius: 2 }}
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
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {formData.labels?.map((label, index) => (
          <Chip
            key={index}
            label={label}
            onDelete={() => handleDeleteLabel(index)}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {user ? "Update" : "Add"} User
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
