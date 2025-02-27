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
  Switch,
  FormControlLabel,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { User, EditUserFormProps } from "../../../types/userTypes";
import { API_KEY, VITE_API_RAIL_WAY } from "@config/config";
import { useAuth } from "src/contexts/AuthContext";

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onSubmit,
  onClose,
  loading,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    id: user?.id,
    first_name: user ? user.fullName.split(" ")[0] : "",
    last_name: user ? user.fullName.split(" ").slice(1).join(" ") : "",
    email: user?.email || "",
    phone: user?.phone || "",
    nationalNumber: user?.nationalNumber || "",
    gender: user?.gender || "male",
    userType: user?.userType || "worker",
    isActive: user?.isActive ?? true,
    labels: user?.labels || [],
    vehicle: user?.vehicle
      ? {
          id: user.vehicle.id,
          brand_id: user.vehicle.brand_id,
          model: user.vehicle.model,
          year: user.vehicle.year,
          license_plate: user.vehicle.license_plate,
          vin_number: user.vehicle.vin_number,
          car_type: user.vehicle.car_type,
          turbo: Boolean(user.vehicle.turbo),
          exotic: Boolean(user.vehicle.exotic),
        }
      : undefined,
  });

  const [labelInput, setLabelInput] = useState("");
  const getAuth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleCheckboxChange =
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (formData.vehicle) {
        setFormData((prev) => ({
          ...prev,
          vehicle: {
            ...prev.vehicle!,
            [fieldName]: event.target.checked,
          },
        }));
      }
    };

  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (formData.vehicle) {
      const { name, value } = e.target;
      const fieldName = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle!,
          [fieldName]: value,
        },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await getAuth.currentUser?.getIdToken();
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();

      const apiData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        national_id: formData.nationalNumber,
        phone: formData.phone,
        gender: formData.gender?.toLowerCase(),
        type: formData.userType?.toLowerCase(),
        vehicle:
          formData.userType === "customer" ? formData.vehicle : undefined,
      };

      const response = await fetch(`${VITE_API_RAIL_WAY}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      onSubmit({ ...formData, fullName });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
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
        value={formData.first_name}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="lastName"
        label="Last Name"
        value={formData.last_name}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="phone"
        label="Phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="nationalNumber"
        label="National Number"
        value={formData.nationalNumber}
        onChange={handleChange}
      />

      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select
          id="gender"
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleSelectChange}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>User Type</InputLabel>
        <Select
          id="userType"
          label="User Type"
          name="userType"
          value={formData.userType?.toLowerCase()}
          onChange={handleSelectChange}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="worker">Worker</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
          <MenuItem value="workshopAdmin">Workshop Admin</MenuItem>
        </Select>
      </FormControl>

      {/* <TextField
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
      </Box> */}

      {formData.userType === "customer" && formData.vehicle && (
        <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Vehicle Information
          </Typography>

          <TextField
            fullWidth
            name="vehicle.model"
            label="Vehicle Model"
            value={formData.vehicle.model}
            onChange={handleVehicleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="vehicle.license_plate"
            label="License Plate"
            value={formData.vehicle.license_plate}
            onChange={handleVehicleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="vehicle.vin_number"
            label="VIN Number"
            value={formData.vehicle.vin_number}
            onChange={handleVehicleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="number"
            name="vehicle.year"
            label="Year"
            value={formData.vehicle.year}
            onChange={handleVehicleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="vehicle.car_type"
            label="Car Type"
            value={formData.vehicle.car_type}
            onChange={handleVehicleChange}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.vehicle.turbo}
                  onChange={handleCheckboxChange("turbo")}
                />
              }
              label="Turbo"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.vehicle.exotic}
                  onChange={handleCheckboxChange("exotic")}
                />
              }
              label="Exotic"
            />
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Update User
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserForm;
