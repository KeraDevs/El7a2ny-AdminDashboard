import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import {
  DirectionsCar,
  LabelImportant as LabelImportantIcon,
  Engineering as EngineeringIcon,
  HomeRepairService as HomeRepairServiceIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Workshop: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.endsWith("/worker")) return 1;
    if (location.pathname.endsWith("/cars")) return 2;
    if (location.pathname.endsWith("/labels")) return 3;
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
        navigate("/workshops/worker");
        break;
      case 2:
        navigate("/workshops/cars");
        break;
      case 3:
        navigate("/workshops/labels");
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
          <Tab label="worker" icon={<EngineeringIcon />} iconPosition="start" />
          <Tab label="cars" icon={<DirectionsCar />} iconPosition="start" />
          <Tab
            label="labels"
            icon={<LabelImportantIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Workshop;
