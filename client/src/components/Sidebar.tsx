import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

import profileImage from "../assets/profile.jpg";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  Group as GroupIcon,
  RequestPage as RequestPageIcon,
  Storefront as StorefrontIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Chat as ChatIcon,
  Discount as DiscountIcon,
  Analytics as AnalyticsIcon,
  HomeRepairService as HomeRepairServiceIcon,
  History as HistoryIcon,
  NotificationsActive as NotificationsActiveIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

interface NavItem {
  text: string;
  icon: React.ReactNode | null;
}

interface SidebarProps {
  drawerWidth: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isNonMobile: boolean;
}

const navItems: NavItem[] = [
  { text: "Dashboard", icon: <HomeOutlined /> },
  { text: "Mangement", icon: null },
  { text: "Users", icon: <GroupIcon /> },
  { text: "Workshops", icon: <HomeRepairServiceIcon /> },
  { text: "Marketplace", icon: <StorefrontIcon /> },
  { text: "Live Support", icon: null },
  { text: "Notifications", icon: <NotificationsActiveIcon /> },
  { text: "Chats", icon: <ChatIcon /> },
  { text: "Requests", icon: <RequestPageIcon /> },
  { text: "History", icon: <HistoryIcon /> },
  { text: "Financials", icon: null },
  { text: "Wallets", icon: <AccountBalanceWalletIcon /> },
  { text: "Revenue", icon: <AttachMoneyIcon /> },
  { text: "Vouchers", icon: <DiscountIcon /> },
  { text: "Analytics", icon: <AnalyticsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              backgroundColor: "#fff",
              color: "#000",
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            },
          }}
        >
          {/* Header Section */}
          <Box>
            <Box m="1.5rem 1rem 1rem 3rem">
              <FlexBetween>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    El7a2ny
                  </Typography>
                </Box>
                <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <ChevronLeft />
                </IconButton>
              </FlexBetween>
            </Box>
          </Box>

          {/* Scrollable Navigation Section */}
          <Box
            flex="1"
            overflow="auto"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText ? "#ddd" : "transparent",
                        color: "#000",
                      }}
                    >
                      <ListItemIcon sx={{ ml: "2rem", color: "#000" }}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Fixed Profile Section */}
          <Box>
            <Divider />
            <FlexBetween
              textTransform="none"
              gap="1rem"
              m="1.5rem 2rem 1.5rem 3rem"
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography fontWeight="bold" fontSize="0.9rem">
                  User Name
                </Typography>
                <Typography fontSize="0.8rem">Occupation</Typography>
              </Box>
              <SettingsOutlined sx={{ fontSize: "25px" }} />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
