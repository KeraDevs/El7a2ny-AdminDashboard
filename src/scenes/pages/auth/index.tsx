import React from "react";
import { Box, Container, Paper } from "@mui/material";
import LoginForm from "@components/auth/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
