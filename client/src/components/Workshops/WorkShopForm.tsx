import React, { useState, KeyboardEvent, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { Workshop, WorkshopFormProps } from "../../types/workshopTypes";
import { AssignOwnerDialog } from "./AssignOwnerDialog";
import { useAuth } from "src/contexts/AuthContext";
import { API_KEY, VITE_API_RAIL_WAY } from "@config/config";

const WorkshopForm: React.FC<WorkshopFormProps> = ({
  workshop,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Workshop>>(
    workshop || {
      name: "",
      activeStatus: "pending",
      address: "",
      latitude: 0,
      longitude: 0,
      status: "open",
      services: [],
      labels: [],
      profilePic: "",
    }
  );
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [selectedOwnerName, setSelectedOwnerName] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const getAuth = useAuth();

  const handleServiceKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && serviceInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        services: [...(prev.services || []), serviceInput.trim()],
      }));
      setServiceInput("");
    }
  };

  const handleLabelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && labelInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        labels: [...(prev.labels || []), labelInput.trim()],
      }));
      setLabelInput("");
    }
  };

  const handleDeleteService = (serviceToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services?.filter((service) => service !== serviceToDelete),
    }));
  };

  const handleDeleteLabel = (labelToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels?.filter((label) => label !== labelToDelete),
    }));
  };

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (workshop?.ownerId) {
        try {
          const token = await getAuth.currentUser?.getIdToken();
          const response = await fetch(
            `${VITE_API_RAIL_WAY}/users/${workshop.ownerId}`,
            {
              headers: {
                "x-api-key": API_KEY,
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch owner details");
          }

          const data = await response.json();
          setSelectedOwnerName(
            data.user.first_name + " " + data.user.last_name
          );
        } catch (error) {
          console.error("Error fetching owner details:", error);
        }
      }
    };

    fetchOwnerDetails();
  }, [workshop]);

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
        label="Workshop Name"
        value={formData.name || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
      <TextField
        fullWidth
        label="Workshop Address"
        value={formData.address || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, address: e.target.value }))
        }
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
      <TextField
        fullWidth
        label="Latitude"
        type="number"
        value={formData.latitude || ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(e.target.value),
          }))
        }
        inputProps={{
          step: "any",
          min: -90,
          max: 90,
        }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
      <TextField
        fullWidth
        label="Longitude"
        type="number"
        value={formData.longitude || ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            longitude: parseFloat(e.target.value),
          }))
        }
        inputProps={{
          step: "any",
          min: -180,
          max: 180,
        }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
      <TextField
        fullWidth
        label="Profile Picture"
        value={formData.profilePic || ""}
        onChange={
          (e) =>
            setFormData((prev) => ({ ...prev, profilePic: e.target.value })) // Fixed field name
        }
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />

      <FormControl fullWidth>
        <InputLabel>Active Status</InputLabel>
        <Select
          value={formData.activeStatus || "pending"}
          label="Active Status"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, activeStatus: e.target.value }))
          }
          sx={{ borderRadius: 2 }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Current Status</InputLabel>
        <Select
          value={formData.status || "pending"}
          label="Active Status"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              status: e.target.value as "open" | "busy" | "closed",
            }))
          }
          sx={{ borderRadius: 2 }}
        >
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="busy">Busy</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        onClick={() => setShowOwnerDialog(true)}
        startIcon={<PersonIcon />}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          justifyContent: "flex-start",
          p: 1.5,
        }}
      >
        {selectedOwnerName || "Select Workshop Owner"}
      </Button>

      {/* <Box>
        <TextField
          fullWidth
          label="Services"
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
          onKeyDown={handleServiceKeyDown}
          helperText="Press Enter to add services"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {formData.services?.map((service) => (
            <Chip
              key={service}
              label={service}
              onDelete={() => handleDeleteService(service)}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box> */}

      {/* <Box>
        <TextField
          fullWidth
          label="Labels"
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          onKeyDown={handleLabelKeyDown}
          helperText="Press Enter to add labels"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {formData.labels?.map((label) => (
            <Chip
              key={label}
              label={label}
              onDelete={() => handleDeleteLabel(label)}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box> */}

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
          onClick={() => onSubmit(formData)}
          disabled={!formData.name || !formData.ownerId}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {workshop ? "Update" : "Add"} Workshop
        </Button>
      </Box>

      <AssignOwnerDialog
        open={showOwnerDialog}
        onClose={() => setShowOwnerDialog(false)}
        onSelect={(userId: any, userName: React.SetStateAction<string>) => {
          setFormData((prev) => ({ ...prev, ownerId: userId }));
          setSelectedOwnerName(userName);
        }}
        currentOwnerId={formData.ownerId}
      />
    </Box>
  );
};

export default WorkshopForm;
