import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, Card, CircularProgress } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
import { Workshop } from "../../types/workshopTypes";
import { VITE_API_RAIL_WAY, API_KEY } from "@config/config";
import { useAuth } from "src/contexts/AuthContext";

const ProfileLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getAuth = useAuth();
  const token = getAuth.currentUser?.getIdToken();

  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${VITE_API_RAIL_WAY}/workshops/${id}`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${await token}`,
          },
        });
        const data = await response.json();
        setWorkshop(data);
      } catch (err) {
        setError("Failed to fetch workshop data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkshopData();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            src={workshop?.profilePic || undefined}
            alt={workshop?.name}
            sx={{
              width: 120,
              height: 120,
              border: "3px solid #eee",
              mb: 2,
            }}
          />
          <Typography variant="h5" fontWeight="500">
            {workshop?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {workshop?.address}
          </Typography>
        </Box>
        <Outlet context={{ workshop }} />
      </Box>
    </Card>
  );
};

export default ProfileLayout;
