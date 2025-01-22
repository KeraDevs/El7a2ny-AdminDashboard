// App.tsx
import { CssBaseline } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Layout from "./scenes/layout";
import ProfileLayout from "./scenes/layout/ProfileLayout.tsx";

import Dashboard from "./scenes/pages/Dashboard";
import Users from "./scenes/pages/Users";
import Workshops from "./scenes/pages/Workshops";
import Marketplace from "./scenes/pages/Marketplace";
import Notifications from "./scenes/pages/Notifications";
import Chats from "./scenes/pages/Chats";
import Requests from "./scenes/pages/Requests";
import History from "./scenes/pages/History";
import Wallets from "./scenes/pages/Wallets";
import Revenue from "./scenes/pages/Revenue";
import Vouchers from "./scenes/pages/Vouchers";
import Analytics from "./scenes/pages/Analytics";
import Cars from "./scenes/pages/Users/Cars";
import Labels from "./scenes/pages/Users/labels";
import UsersList from "./scenes/pages/Users/UsersList";
import WorkshopsList from "./scenes/pages/Workshops/workshopsList";
import Workers from "./scenes/pages/Workshops/workers";
import "./index.css";
import ProtectedRoute from "@components/auth/ProtectedRoute";
import LoginPage from "@pages/auth";
import WorkshopProfile from "@pages/Workshops/workshopProfile/index.tsx";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app">
        <CssBaseline />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="users" element={<Users />}>
              <Route index element={<UsersList />} />
              <Route path="cars" element={<Cars />} />
              <Route path="labels" element={<Labels />} />
            </Route>

            <Route path="workshops" element={<Workshops />}>
              <Route index element={<WorkshopsList />} />
              <Route path="cars" element={<Cars />} />
              <Route path="workers" element={<Workers />} />
              <Route path="labels" element={<Labels />} />
            </Route>

            <Route path="workshops/:id" element={<ProfileLayout />}>
              <Route path="workers" element={<Workers />} />
              <Route path="owners" element={<UsersList />} />
              <Route path="cars" element={<Cars />} />
              <Route path="labels" element={<Labels />} />
            </Route>

            <Route path="marketplace" element={<Marketplace />} />
            <Route path="cars" element={<Cars />} />

            <Route path="notifications" element={<Notifications />} />
            <Route path="chats" element={<Chats />} />
            <Route path="requests" element={<Requests />} />
            <Route path="history" element={<History />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
