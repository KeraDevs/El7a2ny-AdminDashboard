import React, { useState } from "react";
import { Box, Container, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Layout: React.FC = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(isNonMobile);

  return (
    <Container maxWidth="xl">
      <Box
        display={isNonMobile ? "flex" : "block"}
        width="100%"
        height="100%"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
        }}
      >
        <Sidebar
          drawerWidth={250}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isNonMobile={isNonMobile}
        />
        <Box flexGrow={1}>
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};

export default Layout;
