import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { Workshop } from "../../../types/workshopTypes";

type ContextType = {
  workshop: Workshop;
};

const Data: React.FC = () => {
  const { workshop } = useOutletContext<ContextType>();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Workshop Information
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {workshop.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Address:</strong> {workshop.address}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Details
            </Typography>
            {workshop.phoneNumbers && (
              <Typography variant="body1" gutterBottom>
                {/* <strong>Phone:</strong> {workshop.phone} */}
              </Typography>
            )}
            {workshop.email && (
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {workshop.email}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Data;
