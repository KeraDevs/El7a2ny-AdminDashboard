import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Engineering as EngineeringIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  LabelImportant as LabelImportantIcon,
  Info as InfoIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams, Outlet } from "react-router-dom";
import { Workshop } from "../../../../types/workshopTypes";
import { VITE_API_RAIL_WAY, API_KEY } from "@config/config";
import { useAuth } from "src/contexts/AuthContext";

const WorkshopProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getAuth = useAuth();
  const token = getAuth.currentUser?.getIdToken();

  const getActiveTab = () => {
    if (location.pathname.includes("/data")) return 0;
    if (location.pathname.includes("/workers")) return 1;
    if (location.pathname.includes("/owners")) return 2;
    if (location.pathname.includes("/cars")) return 3;
    if (location.pathname.includes("/labels")) return 4;
    if (location.pathname.includes("/history")) return 5;
    return 0;
  };

  const [tabValue, setTabValue] = useState(getActiveTab());

  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${VITE_API_RAIL_WAY}/workshops/${id}`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${await token}`,
          },
        });
        const data = await response.json();
        setWorkshop(data);
      } catch (err) {
        setError("Failed to fetch workshop data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkshopData();
    }
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        navigate(`/workshops/${id}/data`);
        break;
      case 1:
        navigate(`/workshops/${id}/workers`);
        break;
      case 2:
        navigate(`/workshops/${id}/owners`);
        break;
      case 3:
        navigate(`/workshops/${id}/cars`);
        break;
      case 4:
        navigate(`/workshops/${id}/labels`);
        break;
      case 5:
        navigate(`/workshops/${id}/history`);
        break;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Avatar
          src={workshop?.profilePic || undefined}
          alt={workshop?.name}
          sx={{
            width: 120,
            height: 120,
            border: "3px solid #eee",
            mb: 2,
          }}
        />
        <Typography variant="h5" fontWeight="500">
          {workshop?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {workshop?.address}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            "& .MuiTab-root": {
              minWidth: 120,
              textTransform: "none",
            },
          }}
        >
          <Tab icon={<InfoIcon />} iconPosition="start" label="data" />
          <Tab
            icon={<EngineeringIcon />}
            iconPosition="start"
            label="Workers"
          />
          <Tab icon={<PersonIcon />} iconPosition="start" label="Owners" />
          <Tab icon={<DirectionsCarIcon />} iconPosition="start" label="Cars" />
          <Tab
            icon={<LabelImportantIcon />}
            iconPosition="start"
            label="Labels"
          />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="History" />
        </Tabs>
      </Box>

      <Box sx={{ py: 3 }}>
        <Outlet context={{ workshop }} />
      </Box>
    </>
  );
};

export default WorkshopProfile;
