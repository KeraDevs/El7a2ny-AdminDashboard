import React, { useState } from "react";
import {
  LightModeOutlined,
  Menu as MenuIcon,
  Search,
  Notifications as NotificationsIcon,
  MenuOpen as MenuOpenIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import profileImage from "../assets/profile.jpg";
import {
  AppBar,
  Button,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { NavbarProps } from "../types/types";

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isOpen = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "#fff",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexDirection: isMobile && isSearchOpen ? "column" : "row",
          gap: isMobile && isSearchOpen ? 2 : 0,
          padding: isMobile ? "0.5rem" : "0.5rem 1rem",
          position: "relative",
        }}
      >
        {/* LEFT SIDE - Menu Button */}
        <Box
          sx={{
            display: isMobile && isSearchOpen ? "none" : "flex",
            position: isMobile ? "static" : "absolute",
            left: "1rem",
          }}
        >
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ color: "#000" }}
          >
            {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        {/* SEARCH BAR */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            width: isMobile ? "100%" : "40%",
            maxWidth: "600px",
            display: isMobile && !isSearchOpen ? "none" : "block",
            margin: isMobile ? "0" : "0 auto",
            position: isMobile ? "static" : "relative",
            left: isMobile ? 0 : "1rem",
          }}
        >
          <FlexBetween
            borderRadius="9px"
            gap="1rem"
            p="0.1rem 1rem"
            sx={{
              backgroundColor: "#f0f0f0",
              color: "#000",
            }}
          >
            <InputBase
              placeholder="Start Searching..."
              value={searchValue}
              onChange={handleSearch}
              sx={{
                flex: 1,
                color: "#000",
                width: "100%",
              }}
            />
            <IconButton type="submit">
              <Search />
            </IconButton>
            {isMobile && isSearchOpen && (
              <IconButton
                onClick={() => setIsSearchOpen(false)}
                sx={{ padding: "4px" }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </FlexBetween>
        </Box>

        {/* RIGHT SIDE */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            display: isMobile && isSearchOpen ? "none" : "flex",
            position: isMobile ? "static" : "absolute",
            right: "1rem",
          }}
        >
          {isMobile && (
            <IconButton
              onClick={() => setIsSearchOpen(true)}
              sx={{ color: "#000" }}
            >
              <Search />
            </IconButton>
          )}

          <IconButton sx={{ color: "#000" }}>
            <NotificationsIcon />
          </IconButton>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
                padding: "4px",
                minWidth: "unset",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
