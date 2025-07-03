"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconWallet,
  IconCreditCard,
  IconCoins,
  IconRefresh,
  IconCalendar,
  IconCurrencyDollar,
  IconUsers,
  IconBuildingStore,
  IconArrowUp,
  IconDownload,
} from "@tabler/icons-react";
import { useWallets } from "@/hooks/_useWallets";
import { useWorkshops } from "@/hooks/_useWorkshops";

// Mock data - This will be replaced with real API data
const revenueOverTime = [
  { month: "Jan", userTopUps: 45000, workshopPayments: 32000, total: 77000 },
  { month: "Feb", userTopUps: 52000, workshopPayments: 28000, total: 80000 },
  { month: "Mar", userTopUps: 48000, workshopPayments: 35000, total: 83000 },
  { month: "Apr", userTopUps: 61000, workshopPayments: 42000, total: 103000 },
  { month: "May", userTopUps: 55000, workshopPayments: 38000, total: 93000 },
  { month: "Jun", userTopUps: 67000, workshopPayments: 45000, total: 112000 },
];

const paymentMethodDistribution = [
  { name: "Credit Card", value: 45, amount: 234500, color: "#3B82F6" },
  { name: "Bank Transfer", value: 30, amount: 156300, color: "#10B981" },
  { name: "Mobile Payment", value: 20, amount: 104200, color: "#F59E0B" },
  { name: "Cash", value: 5, amount: 26000, color: "#EF4444" },
];

const topWorkshopsRevenue = [
  { name: "AutoMax Workshop", revenue: 45600, transactions: 234, growth: 12.5 },
  { name: "CarCare Center", revenue: 38900, transactions: 198, growth: 8.2 },
  { name: "Quick Fix Garage", revenue: 32100, transactions: 167, growth: -2.1 },
  {
    name: "Elite Auto Service",
    revenue: 29800,
    transactions: 145,
    growth: 15.3,
  },
  { name: "Pro Mechanics", revenue: 26500, transactions: 132, growth: 5.8 },
];

const chartConfig = {
  userTopUps: {
    label: "User Top-ups",
    color: "#3B82F6",
  },
  workshopPayments: {
    label: "Workshop Payments",
    color: "#10B981",
  },
  total: {
    label: "Total Revenue",
    color: "#8B5CF6",
  },
};

const Revenue: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { wallets, loading: walletsLoading, fetchAllWallets } = useWallets();
  const {
    workshops,
    loading: workshopsLoading,
    fetchWorkshops,
  } = useWorkshops();

  // Calculate revenue metrics
  const [revenueMetrics, setRevenueMetrics] = useState({
    totalWalletBalance: 0,
    totalTopUps: 521300,
    totalWorkshopPayments: 387200,
    totalRevenue: 908500,
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
        activeUsers,
        activeWorkshops,
        averageTransactionValue:
          totalBalance > 0 && activeUsers > 0 ? totalBalance / activeUsers : 0,
      }));
    }
  }, [wallets, workshops]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchAllWallets(), fetchWorkshops()]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1500);
    }
  };

  const handleExportReport = () => {
    // Mock export functionality
    console.log("Exporting revenue report...");
  };

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
            Track financial performance across user wallets and workshop
            payments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <IconCalendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <IconDownload className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || walletsLoading || workshopsLoading}
          >
            <IconRefresh
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics.totalRevenue.toLocaleString()} EGP
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
              Wallet Balance
            </CardTitle>
            <IconWallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics.totalWalletBalance.toLocaleString()} EGP
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-blue-600">
                <IconUsers className="mr-1 h-3 w-3" />
                {revenueMetrics.activeUsers} active users
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Top-ups</CardTitle>
            <IconCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics.totalTopUps.toLocaleString()} EGP
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">
                <IconArrowUp className="mr-1 h-3 w-3" />
                +8.2%
              </Badge>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Workshop Payments
            </CardTitle>
            <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics.totalWorkshopPayments.toLocaleString()} EGP
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">
                <IconTrendingUp className="mr-1 h-3 w-3" />
                +5.7%
              </Badge>
              from last period
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Revenue Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
          >
            {/* Revenue Over Time */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>
                  Monthly breakdown of user top-ups and workshop payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="userTopUps"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="workshopPayments"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <PieChart>
                    <Pie
                      data={paymentMethodDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {paymentMethodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="wallets" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>User Wallet Statistics</CardTitle>
                <CardDescription>
                  Overview of all user wallet balances and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {revenueMetrics.activeUsers}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Active Wallets
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {revenueMetrics.averageTransactionValue.toFixed(2)} EGP
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average Balance
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {revenueMetrics.totalWalletBalance.toLocaleString()} EGP
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Balance
                    </p>
                  </div>
                </div>

                {walletsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading wallet data...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {wallets.slice(0, 10).map((wallet) => (
                      <div
                        key={wallet.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <IconWallet className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {wallet.user?.first_name} {wallet.user?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {wallet.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {typeof wallet.balance === "string"
                              ? parseFloat(wallet.balance).toLocaleString()
                              : wallet.balance.toLocaleString()}{" "}
                            EGP
                          </p>
                          <Badge
                            variant={
                              wallet.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {wallet.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Workshops</CardTitle>
                <CardDescription>
                  Workshops generating the highest revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topWorkshopsRevenue.map((workshop, index) => (
                    <div
                      key={workshop.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{workshop.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {workshop.transactions} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {workshop.revenue.toLocaleString()} EGP
                        </p>
                        <div className="flex items-center gap-1">
                          {workshop.growth > 0 ? (
                            <IconTrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <IconTrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span
                            className={`text-xs ${
                              workshop.growth > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {Math.abs(workshop.growth)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {paymentMethodDistribution.map((method) => (
              <Card key={method.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <IconCreditCard
                      className="h-5 w-5"
                      style={{ color: method.color }}
                    />
                    {method.name}
                  </CardTitle>
                  <Badge variant="secondary">{method.value}%</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {method.amount.toLocaleString()} EGP
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${method.value}%`,
                        backgroundColor: method.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payment method share
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>
                  Detailed financial insights and projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Users
                        </span>
                        <span className="font-medium">
                          {revenueMetrics.activeUsers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Active Workshops
                        </span>
                        <span className="font-medium">
                          {revenueMetrics.activeWorkshops}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Average Transaction
                        </span>
                        <span className="font-medium">
                          {revenueMetrics.averageTransactionValue.toFixed(2)}{" "}
                          EGP
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Revenue Growth
                        </span>
                        <span className="font-medium text-green-600">
                          +{revenueMetrics.revenueGrowth}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Financial Health</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>User Engagement</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "85%" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Workshop Utilization</span>
                          <span>72%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "72%" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Payment Success Rate</span>
                          <span>96%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: "96%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Revenue;
