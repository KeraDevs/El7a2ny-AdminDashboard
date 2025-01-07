import React from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import WorkshopsPerformance from "../../../components/Dashboard/WorkshopsPerformance";
import RequetsHistory from "../../../components/Dashboard/RequestsHistory";
import ServiceHistory from "../../../components/Dashboard/ServiceHistory";
import UserDistribution from "../../../components/Dashboard/UserDistribution";
import KeyMetrics from "../../../components/Dashboard/KeyMetrics";

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box className="p-6 min-h-screen bg-gray-100 container">
        <Typography variant="h5" className="mb-8 font-medium">
          Dashboard Overview 📈
        </Typography>

        {/* Key Metrics */}
        <KeyMetrics />

        {/* Charts and Tables */}
        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={6}>
            <WorkshopsPerformance />
          </Grid>
          <Grid item xs={12} md={6}>
            <UserDistribution />
          </Grid>
          <Grid item xs={12} md={6}>
            <ServiceHistory />
          </Grid>
          <Grid item xs={12} md={6}>
            <RequetsHistory />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
