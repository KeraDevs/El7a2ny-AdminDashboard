import React, { useState } from "react";
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
import { Workshop } from "../../../../types/workshopTypes";
import WorkShopForm from "../../../../components/Workshops/WorkShopForm";
import { dialogStyles } from "../../../../config/styles";
import { useWorkshops } from "../../../../hooks/useWorkshops";

const WorkshopsList: React.FC = () => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [pendingWorkshopData, setPendingWorkshopData] =
    useState<Partial<Workshop> | null>(null);

  const {
    workshops,
    selectedWorkshops,
    loading,
    error,
    fetchWorkshops,
    handleSelectAll,
    handleSelectWorkshop,
    handleAddWorkShop,
    handleEditWorkshop,
    handleDeleteWorkshops,
    setEditingWorkshop,
    setOpenWorkshopDialog,
    editingWorkshop,
    openWorkshopDialog,
    setError,
  } = useWorkshops();

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="500">
            Workshops List
          </Typography>
          <Box display="flex" gap={1}>
            <IconButton
              onClick={fetchWorkshops}
              disabled={loading}
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <Refresh />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenWorkshopDialog(true)}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Add Workshop
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={selectedWorkshops.length === 0 || loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Deactivate Selected
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 3, py: 2 }}>
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Table Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer sx={{ p: 3 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{ borderBottom: "2px solid #eee" }}
                >
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
                <TableCell>Workshop Name</TableCell>
                <TableCell>Main Branch</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workshops.map((workshop) => (
                <TableRow
                  key={workshop.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
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
                      sx={{ width: 40, height: 40, border: "2px solid #eee" }}
                    />
                  </TableCell>
                  <TableCell>{workshop.name}</TableCell>
                  <TableCell>
                    {workshop.parentId ? workshop.parentId : "Main Workshop"}
                  </TableCell>
                  <TableCell>
                    {workshop.users[0]?.first_name
                      ? `${workshop.users[0]?.first_name} ${workshop.users[0]?.last_name}`
                      : "No owner assigned"}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={`${workshop.latitude}, ${workshop.longitude}`}
                    >
                      <Box display="flex" alignItems="center">
                        <LocationOn sx={{ mr: 1 }} />
                        {workshop.address}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={workshop.active_status}
                      color={
                        workshop.active_status === "active"
                          ? "success"
                          : workshop.active_status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                      sx={{ borderRadius: 1, textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(workshop.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "#f5f5f5",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                      onClick={() => setEditingWorkshop(workshop)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "#f5f5f5",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                      onClick={() => setEditingWorkshop(workshop)}
                      disabled={loading}
                    >
                      <RemoveRedEyeIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Workshop Dialog */}
      <Dialog
        open={openWorkshopDialog || !!editingWorkshop}
        onClose={() => {
          setOpenWorkshopDialog(false);
          setEditingWorkshop(null);
          setError(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
        sx={dialogStyles}
        aria-labelledby="workshop-dialog-title"
        disableRestoreFocus
      >
        <DialogTitle id="workshop-dialog-title">
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
            open={false}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
        aria-labelledby="delete-dialog-title"
        disableRestoreFocus
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedWorkshops.length} selected
            workshop(s)? This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setDeleteConfirmOpen(false);
              handleDeleteWorkshops();
            }}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog
        open={updateConfirmOpen}
        onClose={() => setUpdateConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
        aria-labelledby="update-dialog-title"
        disableRestoreFocus
      >
        <DialogTitle id="update-dialog-title">Confirm Update</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update this workshop?
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setUpdateConfirmOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setUpdateConfirmOpen(false);
              if (pendingWorkshopData) {
                handleEditWorkshop(pendingWorkshopData);
              }
              setPendingWorkshopData(null);
            }}
            sx={{ borderRadius: 2 }}
          >
            Update
          </Button>
        </Box>
      </Dialog>
    </Card>
  );
};

export default WorkshopsList;
