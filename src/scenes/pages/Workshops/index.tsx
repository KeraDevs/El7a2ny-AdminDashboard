import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import {
  DirectionsCar,
  LabelImportant as LabelImportantIcon,
  Engineering as EngineeringIcon,
  HomeRepairService as HomeRepairServiceIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";

const Workshop: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isProfilePage = location.pathname.includes(`/workshops/${id}`);
  if (isProfilePage) {
    return <Outlet />;
  }

  const getActiveTab = () => {
    if (isProfilePage) return 2;
    if (location.pathname.endsWith("/worker")) return 1;
    return 0;
  };

  const [tabValue, setTabValue] = useState(getActiveTab());

  const handleTabChange = (_: any, newValue: number) => {
    setTabValue(newValue);

    switch (newValue) {
      case 0:
        navigate("/workshops");
        break;
      case 1:
        navigate("/workshops/workers");
        break;
    }
  };

  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label="workshops"
            icon={<HomeRepairServiceIcon />}
            iconPosition="start"
          />
          <Tab
            label="workers"
            icon={<EngineeringIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Workshop;
