import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  Group as GroupIcon,
  RequestPage as RequestPageIcon,
  Storefront as StorefrontIcon,
  Chat as ChatIcon,
  History as HistoryIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { TOTAL_USERS_API, API_KEY } from "../../config/config";
import { DashboardMetrics } from "../../types/types";

const KeyMetrics: React.FC = () => {
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 270,
    activeWorkshops: 124,
    pendingRequests: 18,
    totalRevenue: "$45,289",
    completedServices: 1893,
    activeChats: 27,
  });

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(TOTAL_USERS_API, {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch total users");
        }

        const data = await response.json();
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          totalUsers: data.total_users,
        }));
      } catch (error) {
        console.error("Error fetching total users:", error);
      } finally {
        setIsMetricsLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <Grid container spacing={3}>
      {[
        {
          title: "Total Users",
          value: metrics.totalUsers,
          icon: <GroupIcon sx={{ fontSize: 40 }} />,
          link: "/users",
        },
        {
          title: "Active Workshops",
          value: metrics.activeWorkshops,
          icon: <StorefrontIcon sx={{ fontSize: 40 }} />,
          link: "/workshops",
        },
        {
          title: "Pending Requests",
          value: metrics.pendingRequests,
          icon: <RequestPageIcon sx={{ fontSize: 40 }} />,
          link: "/requests",
        },
        {
          title: "Total Revenue",
          value: metrics.totalRevenue,
          icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
          link: "/revenue",
        },
        {
          title: "Completed Services",
          value: metrics.completedServices,
          icon: <HistoryIcon sx={{ fontSize: 40 }} />,
          link: "/history",
        },
        {
          title: "Active Chats",
          value: metrics.activeChats,
          icon: <ChatIcon sx={{ fontSize: 40 }} />,
          link: "/chats",
        },
      ].map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
          <Card className={`h-full border-3 shadow-l`}>
            <CardContent className="h-full flex flex-col items-center justify-center">
              {isMetricsLoading ? (
                <>
                  <Skeleton variant="circular" width={60} height={60} />
                  <Skeleton variant="text" className="mt-2" />
                  <Skeleton variant="text" width="60%" />
                </>
              ) : (
                <>
                  <Box className="flex flex-col items-center">
                    <IconButton
                      component="a"
                      href={metric.link}
                      size="large"
                      className="text-gray-400"
                    >
                      {metric.icon}
                    </IconButton>
                    <Typography
                      variant="h4"
                      className="font-medium mb-1 text-center"
                    >
                      {metric.value}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      className="text-center"
                    >
                      {metric.title}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KeyMetrics;
