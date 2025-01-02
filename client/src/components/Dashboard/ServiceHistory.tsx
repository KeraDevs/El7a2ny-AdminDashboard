import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import SectionFooter from "./SectionFooter";

const ServiceHistory: React.FC = () => {
  const [isServiceHistoryLoading, setIsServiceHistoryLoading] = useState(true);
  React.useEffect(() => {
    const loadData = async () => {
      setTimeout(() => setIsServiceHistoryLoading(false), 2200);
    };
    loadData();
  }, []);

  const serviceHistory = [
    { label: "Repairs", value: 40 },
    { label: "Maintenance", value: 30 },
    { label: "Tuning", value: 20 },
    { label: "Inspection", value: 10 },
  ];
  return (
    <>
      <Grid item xs={12} md={6}>
        <Card className="border border-gray-200">
          <CardContent>
            <Typography variant="h6" className="mb-6">
              Service History Distribution
            </Typography>
            {isServiceHistoryLoading ? (
              <Box className="flex justify-center items-center h-[300px]">
                <CircularProgress />
              </Box>
            ) : (
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: serviceHistory.map((item) => item.label),
                  },
                ]}
                series={[
                  {
                    data: serviceHistory.map((item) => item.value),
                    color: "#673AB7",
                  },
                ]}
                width={500}
                height={300}
              />
            )}
            <SectionFooter link="/analytics" />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ServiceHistory;
