import React from "react";
import { Card, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const ProfileLayout: React.FC = () => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ p: 4 }}>
        <Outlet />
      </Box>
    </Card>
  );
};

export default ProfileLayout;
