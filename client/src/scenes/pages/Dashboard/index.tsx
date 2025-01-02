import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import WorkshopsPerformance from "../../../components/Dashboard/WorkshopsPerformance";
import RequetsHistory from "../../../components/Dashboard/RequestsHistory";
import ServiceHistory from "../../../components/Dashboard/ServiceHistory";
import UserDistribution from "../../../components/Dashboard/UserDistribution";
import KeyMetrics from "../../../components/Dashboard/KeyMetrics";

const Dashboard: React.FC = () => {
  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h5" className="mb-8 font-medium">
        Dashboard Overview
      </Typography>
      {/* Key Metrics */}
      <KeyMetrics />
      {/* Charts and Tables */}
      <Grid container spacing={4} mt={1}>
        {/* Workshop Performance */}
        <WorkshopsPerformance />
        {/* User Distribution */}
        <UserDistribution />
        {/* Service History */}
        <ServiceHistory />
        {/* Recent Activities */}
        <RequetsHistory />
      </Grid>
    </Box>
  );
};

export default Dashboard;
