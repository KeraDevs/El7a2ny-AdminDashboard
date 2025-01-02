import { CssBaseline } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./scenes/layout";
import Dashboard from "./scenes/dashboard";
import Users from "./scenes/Users";
import Workshops from "./scenes/Workshops";
import Marketplace from "./scenes/Marketplace";
import Notifications from "./scenes/Notifications";
import Chats from "./scenes/Chats";
import Requests from "./scenes/Requests";
import History from "./scenes/History";
import Wallets from "./scenes/Wallets";
import Revenue from "./scenes/Revenue";
import Vouchers from "./scenes/Vouchers";
import Analytics from "./scenes/Analytics";

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
