// WorkshopProfile.tsx
import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import {
  Engineering as EngineeringIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  LabelImportant as LabelImportantIcon,
  Outlet,
} from "@mui/icons-material";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { Workshop } from "../../../../types/workshopTypes";

type ContextType = { workshop: Workshop | null };

const WorkshopProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workshop } = useOutletContext<ContextType>();

  const getActiveTab = () => {
    if (location.pathname.includes("/workers")) return 0;
    if (location.pathname.includes("/owners")) return 1;
    if (location.pathname.includes("/cars")) return 2;
    if (location.pathname.includes("/labels")) return 3;
    return 0;
  };

  const [tabValue, setTabValue] = useState(getActiveTab());

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const id = location.pathname.split("/")[2]; // Get workshop ID from URL
    switch (newValue) {
      case 0:
        navigate(`/workshops/${id}/workers`);
        break;
      case 1:
        navigate(`/workshops/${id}/owners`);
        break;
      case 2:
        navigate(`/workshops/${id}/cars`);
        break;
      case 3:
        navigate(`/workshops/${id}/labels`);
        break;
    }
  };

  return (
    <>
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
        </Tabs>
      </Box>

      <Box sx={{ py: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default WorkshopProfile;
