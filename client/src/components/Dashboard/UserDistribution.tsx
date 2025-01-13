import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import SectionFooter from "./SectionFooter";

// Define proper types
interface OSData {
  id: number;
  label: string;
  value: number;
  color: string;
}

// Sample data with proper structure
const mobileAndDesktopOS: OSData[] = [
  { id: 1, label: "Men", value: 42, color: "#4CAF50" },
  { id: 3, label: "Women", value: 20, color: "#9C27B0" },
  { id: 2, label: "Workers", value: 38, color: "#2196F3" },
];

const UserDistribution: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setTimeout(() => setIsLoading(false), 1000);
    };
    loadData();
  }, []);

  const cardStyles = {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    borderRadius: "8px",
    width: "100%",
    height: "100%",
  };

  return (
    <Grid>
      <Card
        className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
        sx={{ cardStyles }}
      >
        <CardContent className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h6" className="font-semibold text-gray-800">
              User Distribution
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              By User Type
            </Typography>
          </div>

          {isLoading ? (
            <Box className="flex justify-center items-center flex-grow h-[300px]">
              <CircularProgress size={40} thickness={4} />
            </Box>
          ) : (
            <Box className="flex flex-col items-center flex-grow">
              <PieChart
                series={[
                  {
                    data: mobileAndDesktopOS,
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    highlightScope: { faded: "global", highlighted: "item" },
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 45,
                  },
                ]}
                width={400}
                height={300}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "middle" },
                    padding: 0,
                  },
                }}
              />

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                {mobileAndDesktopOS.map((os) => (
                  <div
                    key={os.id}
                    className="text-center p-2 rounded-lg"
                    style={{ backgroundColor: `${os.color}15` }}
                  >
                    <Typography
                      variant="h6"
                      className="font-bold"
                      style={{ color: os.color }}
                    >
                      {os.value}%
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      {os.label}
                    </Typography>
                  </div>
                ))}
              </div>
            </Box>
          )}

          <SectionFooter link="/users/analytics" />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserDistribution;
