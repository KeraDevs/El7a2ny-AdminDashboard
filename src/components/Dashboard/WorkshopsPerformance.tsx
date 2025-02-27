import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SectionFooter from "./SectionFooter";
import { cardStyles } from "../../config/styles";

const workshopData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  services: [45, 52, 49, 60, 55, 65],
  revenue: [16000, 18000, 19500, 20000, 10000, 21000],
  completed: [15000, 17000, 10000, 10000, 50000, 20000],
};

const WorkshopsPerformance: React.FC = () => {
  const [isWorkshopDataLoading, setIsWorkshopDataLoading] = useState(true);
  const theme = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  // Handle resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth - 48); // Subtract padding
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Simulate data loading
  React.useEffect(() => {
    const loadData = async () => {
      setTimeout(() => setIsWorkshopDataLoading(false), 2000);
    };
    loadData();
  }, []);

  return (
    <Grid>
      <Card
        sx={{
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
          width: "100%",
          cardStyles,
        }}
      >
        <CardContent
          ref={containerRef}
          sx={{
            padding: "24px",
            "&:last-child": { paddingBottom: "24px" },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: "1.5rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Workshops Performance
          </Typography>

          {isWorkshopDataLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 300,
                overflow: "hidden",
              }}
            >
              {chartWidth > 0 && (
                <LineChart
                  xAxis={[
                    {
                      data: workshopData.months,
                      scaleType: "band",
                      tickLabelStyle: {
                        fontSize: 12,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: workshopData.services,
                      label: "Requests",
                      color: theme.palette.warning.main,
                      curve: "natural",
                    },
                    {
                      data: workshopData.completed.map((val) => val / 1000),
                      label: "Completed",
                      color: theme.palette.grey[600],
                      curve: "natural",
                    },
                    {
                      data: workshopData.revenue.map((val) => val / 1000),
                      label: "Revenue",
                      color: theme.palette.success.main,
                      curve: "natural",
                    },
                  ]}
                  width={chartWidth}
                  height={300}
                  sx={{
                    ".MuiLineElement-root": {
                      strokeWidth: 2,
                    },
                    ".MuiMarkElement-root": {
                      stroke: "white",
                      scale: "0.6",
                      fill: "white",
                    },
                  }}
                  margin={{ left: 60, right: 20, top: 20, bottom: 30 }}
                />
              )}
            </Box>
          )}
          <SectionFooter link="/analytics" />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WorkshopsPerformance;
