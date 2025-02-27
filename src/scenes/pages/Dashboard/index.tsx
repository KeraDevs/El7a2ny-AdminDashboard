import React from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import WorkshopsPerformance from "../../../components/Dashboard/WorkshopsPerformance";
import RequetsHistory from "../../../components/Dashboard/RequestsHistory";
import ServiceHistory from "../../../components/Dashboard/ServiceHistory";
import KeyMetrics from "../../../components/Dashboard/KeyMetrics";
import SalesChart from "../../../components/Dashboard/SalesCharts";

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box className="p-6 min-h-screen bg-gray-100">
        <Typography variant="h5" className="mb-8 font-medium">
          Dashboard Overview 📈
        </Typography>

        <KeyMetrics />

        <Grid container spacing={4} mt={1} mb={2}>
          <Grid item xs={12} md={6}>
            <WorkshopsPerformance />
          </Grid>
          <Grid item xs={12} md={6}>
            <ServiceHistory />
          </Grid>
          <Grid item xs={12} md={6}>
            <SalesChart />
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
