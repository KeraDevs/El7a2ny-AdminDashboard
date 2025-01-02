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
import { mobileAndDesktopOS } from "./webUsagestats";

const UserDistribution: React.FC = () => {
  const [isUserDistributionLoading, setIsUserDistributionLoading] =
    useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setTimeout(() => setIsUserDistributionLoading(false), 1800);
    };
    loadData();
  }, []);

  // Filter only Android, iOS, and Windows data
  const userDistribution = mobileAndDesktopOS.filter(
    (item: { label: string }) =>
      ["Android", "iOS", "Windows"].includes(item.label)
  );

  return (
    <>
      <Grid item xs={12} lg={4}>
        <Card className="border border-gray-200">
          <CardContent>
            <Typography variant="h6" className="mb-6">
              User Distribution
            </Typography>
            {isUserDistributionLoading ? (
              <Box className="flex justify-center items-center h-[300px]">
                <CircularProgress />
              </Box>
            ) : (
              <PieChart
                series={[
                  {
                    data: userDistribution,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                width={400}
                height={300}
              />
            )}
            <SectionFooter link="/users/analytics" />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default UserDistribution;
