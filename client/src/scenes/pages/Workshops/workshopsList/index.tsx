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
  Paper,
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
  LocationOn,
  RemoveRedEye as RemoveRedEyeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Workshop,
  ApiWorkshopsList,
  ApiResponse,
  PhoneNumber,
} from "../../../../types/types";
import WorkShopForm from "../../../../components/Workshops/WorkShopForm";

const API_BASE_URL = import.meta.env.VITE_API_RAIL_WAY;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = import.meta.env.VITE_TOKEN;

if (!API_BASE_URL || !API_KEY) {
  throw new Error("Missing API environment variables");
}

const mapApiWorkshopToFrontend = (apiWorkshop: ApiWorkshopsList): Workshop => ({
  id: apiWorkshop.id,
  parentId: apiWorkshop.parent_id,
  ownerId: apiWorkshop.owner_id,
  email: apiWorkshop.email,
  name: apiWorkshop.name,
  address: apiWorkshop.address,
  latitude: Number(apiWorkshop.latitude),
  longitude: Number(apiWorkshop.longitude),
  profilePic: apiWorkshop.profile_pic,
  isActive: apiWorkshop.is_active,
  status: apiWorkshop.status,
  createdAt: apiWorkshop.created_at,
  updatedAt: apiWorkshop.updated_at,
  users: apiWorkshop.users || [],
  phoneNumbers: apiWorkshop.phone_numbers.map((phone) => ({
    ...phone,
    type: phone.type.toUpperCase() as PhoneNumber["type"],
  })),
  services: [],
  ratings: 0,
  totalReviews: 0,
  labels: [],
});

const mapFrontendToApiWorkshop = (workshop: Partial<Workshop>) => ({
  email: workshop.email,
  name: workshop.name,
  address: workshop.address,
  latitude: workshop.latitude,
  longitude: workshop.longitude,
  profile_pic: workshop.profilePic,
  is_active: workshop.isActive,
  phone_numbers:
    workshop.phoneNumbers?.map((phone) => ({
      phone_number: phone.phone_number,
      type: phone.type,
      is_primary: phone.is_primary,
    })) || [],
});

const WorkshopsList: React.FC = () => {
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [openWorkshopDialog, setOpenWorkshopDialog] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/workshops?limit=10&offset=0&is_active=true`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unauthorized, HTTP error! status: ${response.status} kindly login to access this data`
        );
      }

      const result: ApiResponse = await response.json();
      const mappedWorkshops = (result.workshops || []).map(
        mapApiWorkshopToFrontend
      );
      setWorkshops(mappedWorkshops);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch workshops"
      );
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedWorkshops(
      checked ? workshops.map((workshop) => workshop.id) : []
    );
  };

  const handleSelectWorkshop = (workshopId: string) => {
    setSelectedWorkshops((prev) =>
      prev.includes(workshopId)
        ? prev.filter((id) => id !== workshopId)
        : [...prev, workshopId]
    );
  };
  // Adding Workshop
  const handleAddWorkShop = async (workshopData: Partial<Workshop>) => {
    try {
      setLoading(true);
      const apiData = mapFrontendToApiWorkshop(workshopData);

      const response = await fetch(`${API_BASE_URL}/workshops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to add Workshop! Status Code: ${response.status}`
        );
      }

      await fetchWorkshops();
      setOpenWorkshopDialog(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add Workshop"
      );
    } finally {
      setLoading(false);
    }
  };
  // handle Edit Workshop
  const handleEditWorkshop = async (workshopData: Partial<Workshop>) => {
    if (!editingWorkshop?.id) {
      setError("No workshop selected for editing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiData = mapFrontendToApiWorkshop(workshopData);
      console.log(
        "Sending update request for workshop:",
        editingWorkshop.id,
        apiData
      );

      const response = await fetch(
        `${API_BASE_URL}/workshops/${editingWorkshop.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to update Workshop! Status Code: ${response.status}`
        );
      }

      const updatedWorkshop = await response.json();
      console.log("Workshop updated successfully:", updatedWorkshop);

      await fetchWorkshops();
      setEditingWorkshop(null);
      setOpenWorkshopDialog(false);
    } catch (error) {
      console.error("Error updating workshop:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update Workshop"
      );
    } finally {
      setLoading(false);
    }
  };
  // deleting workshop
  const handleDeleteWorkshops = async () => {
    try {
      setLoading(true);

      await Promise.all(
        selectedWorkshops.map(async (workshopId) => {
          const response = await fetch(
            `${API_BASE_URL}/workshops/${workshopId}`,
            {
              method: "DELETE",
              headers: {
                "x-api-key": API_KEY,
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete workshop ${workshopId}`);
          }
        })
      );

      await fetchWorkshops();
      setSelectedWorkshops([]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete workshops"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  return (
    <Card className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5">Workshops List</Typography>
        <Box className="space-x-2">
          <IconButton onClick={fetchWorkshops} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenWorkshopDialog(true)}
            disabled={loading}
            sx={{ marginRight: "1rem" }}
          >
            Add Workshop
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteWorkshops}
            disabled={selectedWorkshops.length === 0 || loading}
          >
            Delete Selected
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="flex justify-center p-4">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedWorkshops.length === workshops.length}
                    indeterminate={
                      selectedWorkshops.length > 0 &&
                      selectedWorkshops.length < workshops.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell>Picture</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone Numbers</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Ratings</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workshops.map((workshop) => (
                <TableRow key={workshop.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedWorkshops.includes(workshop.id)}
                      onChange={() => handleSelectWorkshop(workshop.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar
                      src={workshop.profilePic || ""}
                      alt={workshop.name}
                    />
                  </TableCell>
                  <TableCell>{workshop.name}</TableCell>
                  <TableCell>
                    <Tooltip
                      title={`${workshop.latitude}, ${workshop.longitude}`}
                    >
                      <Box className="flex items-center">
                        <LocationOn className="mr-1" />
                        {workshop.address}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box className="space-x-1">
                      {workshop.phoneNumbers.map((phone, index) => (
                        <Tooltip
                          key={index}
                          title={`${phone.type} - ${
                            phone.is_verified ? "Verified" : "Unverified"
                          }`}
                        >
                          <Chip
                            label={phone.phone_number}
                            size="small"
                            color={phone.is_primary ? "primary" : "default"}
                            variant="outlined"
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {workshop.users[0]?.fullName || "No owner assigned"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={workshop.status}
                      color={
                        workshop.status === "Open"
                          ? "success"
                          : workshop.status === "Busy"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box className="space-x-1">
                      {workshop.services.map((service, index) => (
                        <Chip
                          key={index}
                          label={service}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${workshop.totalReviews} reviews`}>
                      <Box>{workshop.ratings.toFixed(1)} ⭐</Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => setEditingWorkshop(workshop)}
                      disabled={loading}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" disabled={loading}>
                      <RemoveRedEyeIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit/Add Dialog */}
      <Dialog
        open={openWorkshopDialog || !!editingWorkshop}
        onClose={() => {
          setOpenWorkshopDialog(false);
          setEditingWorkshop(null);
          setError(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              {editingWorkshop ? "Edit Workshop" : "Add New Workshop"}
            </Typography>
            <IconButton
              onClick={() => {
                setOpenWorkshopDialog(false);
                setEditingWorkshop(null);
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <WorkShopForm
            workshop={editingWorkshop || undefined}
            onSubmit={editingWorkshop ? handleEditWorkshop : handleAddWorkShop}
            onClose={() => {
              setOpenWorkshopDialog(false);
              setEditingWorkshop(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WorkshopsList;
