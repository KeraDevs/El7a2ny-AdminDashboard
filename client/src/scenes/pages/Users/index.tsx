import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import {
  DirectionsCar,
  LabelImportant as LabelImportantIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Users: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.endsWith("/cars")) return 1;
    if (location.pathname.endsWith("/labels")) return 2;
    return 0;
  };

  const [tabValue, setTabValue] = useState(getActiveTab());

  const handleTabChange = (_: any, newValue: number) => {
    setTabValue(newValue);

    switch (newValue) {
      case 0:
        navigate("/users");
        break;
      case 1:
        navigate("/users/cars");
        break;
      case 2:
        navigate("/users/labels");
        break;
    }
  };

  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Users" icon={<GroupIcon />} iconPosition="start" />
          <Tab label="Cars" icon={<DirectionsCar />} iconPosition="start" />
          <Tab
            label="Labels"
            icon={<LabelImportantIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <Outlet />
    </Box>
  );
};

export default Users;
