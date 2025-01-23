import React, { useState, KeyboardEvent } from "react";
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
import { Person as PersonIcon } from "@mui/icons-material";
import { Workshop, WorkshopFormProps } from "../../types/types";
import { AssignOwnerDialog } from "./AssignOwnerDialog";

const WorkshopForm: React.FC<WorkshopFormProps> = ({
  workshop,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Workshop>>(
    workshop || {
      name: "",
      activeStatus: "pending",
      status: "Open",
      services: [],
      labels: [],
    }
  );
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [selectedOwnerName, setSelectedOwnerName] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [labelInput, setLabelInput] = useState("");

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

      <Box>
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
      </Box>

      <Box>
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
        onSelect={(userId, userName) => {
          setFormData((prev) => ({ ...prev, ownerId: userId }));
          setSelectedOwnerName(userName);
        }}
        currentOwnerId={formData.ownerId}
      />
    </Box>
  );
};

export default WorkshopForm;
