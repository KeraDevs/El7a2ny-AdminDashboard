import React, { useState } from "react";

import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import SectionFooter from "./SectionFooter";
const workshopData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  services: [45, 52, 49, 60, 55, 65],
  revenue: [16000, 18000, 19500, 20000, 10000, 21000],
  completed: [15000, 17000, 10000, 10000, 50000, 20000],
};

const WorkshopsPerformance: React.FC = () => {
  const [isWorkshopDataLoading, setIsWorkshopDataLoading] = useState(true);

  // Simulate data loading
  React.useEffect(() => {
    const loadData = async () => {
      setTimeout(() => setIsWorkshopDataLoading(false), 2000);
    };
    loadData();
  }, []);

  return (
    <>
      <Grid item xs={12} lg={8}>
        <Card className="border border-gray-200">
          <CardContent>
            <Typography variant="h6" className="mb-6">
              Workshop Performance
            </Typography>
            {isWorkshopDataLoading ? (
              <Box className="flex justify-center items-center h-[300px]">
                <CircularProgress />
              </Box>
            ) : (
              <LineChart
                xAxis={[{ data: workshopData.months, scaleType: "band" }]}
                series={[
                  {
                    data: workshopData.services,
                    label: "Requests",
                    color: "#ffc107",
                  },
                  {
                    data: workshopData.completed.map((val) => val / 1000),
                    label: "Completed",
                    color: "#6c757d",
                  },
                  {
                    data: workshopData.revenue.map((val) => val / 1000),
                    label: "Revenue",
                    color: "#28a745",
                  },
                ]}
                width={800}
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

export default WorkshopsPerformance;
