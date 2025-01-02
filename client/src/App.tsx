import { CssBaseline } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./scenes/layout";
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

const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/history" element={<History />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/vouchers" element={<Vouchers />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
