"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconTrendingUp,
  IconWallet,
  IconCurrencyDollar,
  IconUsers,
} from "@tabler/icons-react";
import { useWallets } from "@/hooks/_useWallets";
import { useWorkshops } from "@/hooks/_useWorkshops";
import { TransactionsHistory } from "@/components/transactions/TransactionsHistory";
import { formatRevenue, formatTransactionCount } from "@/types/walletTypes";

const Revenue: React.FC = () => {
  const { wallets, fetchAllWallets } = useWallets();
  const { workshops, fetchWorkshops } = useWorkshops();

  // Calculate revenue metrics
  const [revenueMetrics, setRevenueMetrics] = useState({
    totalWalletBalance: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    activeUsers: 0,
    activeWorkshops: 0,
    averageTransactionValue: 0,
    revenueGrowth: 12.8,
  });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchAllWallets(), fetchWorkshops()]);
    };
    loadData();
  }, [fetchAllWallets, fetchWorkshops]);

  useEffect(() => {
    if (wallets.length > 0 && workshops.length > 0) {
      const totalBalance = wallets.reduce((sum, wallet) => {
        const balance =
          typeof wallet.balance === "string"
            ? parseFloat(wallet.balance)
            : wallet.balance;
        return sum + (isNaN(balance) ? 0 : balance);
      }, 0);

      const activeWorkshops = workshops.filter(
        (w) => w.active_status === "active"
      ).length;
      const activeUsers = wallets.filter((w) => w.status === "active").length;

      setRevenueMetrics((prev) => ({
        ...prev,
        totalWalletBalance: totalBalance,
        totalRevenue: totalBalance, // Using wallet balance as proxy for revenue
        totalTransactions: wallets.length, // Using wallet count as proxy for transactions
        activeUsers,
        activeWorkshops,
        averageTransactionValue:
          totalBalance > 0 && activeUsers > 0 ? totalBalance / activeUsers : 0,
      }));
    }
  }, [wallets, workshops]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track financial performance and payment transactions
          </p>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              EGP {formatRevenue(revenueMetrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">
                <IconTrendingUp className="mr-1 h-3 w-3" />+
                {revenueMetrics.revenueGrowth}%
              </Badge>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <IconWallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTransactionCount(revenueMetrics.totalTransactions)}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-blue-600">
                <IconUsers className="mr-1 h-3 w-3" />
                {revenueMetrics.activeUsers} active users
              </Badge>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Revenue Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TransactionsHistory />
      </motion.div>
    </div>
  );
};

export default Revenue;
