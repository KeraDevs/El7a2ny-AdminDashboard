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

const API_BASE_URL = "http://localhost:5000/api/v1/users/total-users";
const API_KEY = "el7a2ny-test-key-123";

interface DashboardMetrics {
  totalUsers: number;
  activeWorkshops: number;
  pendingRequests: number;
  totalRevenue: string;
  completedServices: number;
  activeChats: number;
}

const KeyMetrics: React.FC = () => {
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    activeWorkshops: 124,
    pendingRequests: 18,
    totalRevenue: "$45,289",
    completedServices: 1893,
    activeChats: 27,
  });

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(API_BASE_URL, {
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
    <>
      <Grid container spacing={4} className="mb-5 ml-2">
        {[
          {
            title: "Total Users",
            value: metrics.totalUsers,
            icon: <GroupIcon fontSize="large" />,
            link: "/users",
          },
          {
            title: "Active Workshops",
            value: metrics.activeWorkshops,
            icon: <StorefrontIcon fontSize="large" />,
            link: "/workshops",
          },
          {
            title: "Pending Requests",
            value: metrics.pendingRequests,
            icon: <RequestPageIcon fontSize="large" />,
            link: "/requests",
          },
          {
            title: "Total Revenue",
            value: metrics.totalRevenue,
            icon: <AttachMoneyIcon fontSize="large" />,
            link: "/revenue",
          },
          {
            title: "Completed Services",
            value: metrics.completedServices,
            icon: <HistoryIcon fontSize="large" />,
            link: "/history",
          },
          {
            title: "Active Chats",
            value: metrics.activeChats,
            icon: <ChatIcon fontSize="large" />,
            link: "/chats",
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card className={`h-full border-2`}>
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
    </>
  );
};

export default KeyMetrics;
