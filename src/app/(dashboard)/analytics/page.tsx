"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconBrandApple,
  IconBrandAndroid,
  IconWorld,
  IconRefresh,
  IconCalendar,
  IconEye,
  IconDeviceDesktop,
  IconUsers,
  IconCash,
  IconChartBar,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { DateRangeOption } from "@/types/analyticsTypes";
import { AnalyticsAPI } from "@/utils/analyticsApi";

const chartConfig = {
  android: {
    label: "Android",
    color: "#34D399",
  },
  ios: {
    label: "iOS",
    color: "#60A5FA",
  },
  web: {
    label: "Web",
    color: "#F59E0B",
  },
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<DateRangeOption>("7d");

  const {
    overview,
    platformData,
    deviceData,
    timeSeriesData,
    realtimeData,
    loading,
    error,
    lastUpdated,
    refresh,
    setDateRange,
    isRefreshing,
  } = useAnalytics(timeRange);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange as DateRangeOption);
    setDateRange(newRange as DateRangeOption);
  };

  const handleRefresh = async () => {
    await refresh();
  };

  // Calculate trend indicators
  const getTrendBadge = (current: number, previous: number) => {
    const change = AnalyticsAPI.calculatePercentageChange(current, previous);
    const trend = AnalyticsAPI.getTrendIndicator(current, previous);

    if (trend === "up") {
      return (
        <Badge variant="outline" className="text-green-600">
          <IconTrendingUp className="mr-1 h-3 w-3" />+
          {Math.abs(change).toFixed(1)}%
        </Badge>
      );
    } else if (trend === "down") {
      return (
        <Badge variant="outline" className="text-red-600">
          <IconTrendingDown className="mr-1 h-3 w-3" />-
          {Math.abs(change).toFixed(1)}%
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-gray-600">
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}%
        </Badge>
      );
    }
  };

  const formatNumber = (num: number) => {
    return AnalyticsAPI.formatNumber(num);
  };

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <IconAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <CardTitle>Analytics Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleRefresh} variant="outline">
                <IconRefresh className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time insights from Google Analytics across web, Android, and
            iOS platforms
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <IconCalendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatNumber(overview?.totalUsers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {!loading &&
                overview &&
                getTrendBadge(
                  overview.totalUsers,
                  overview.previousPeriodComparison.totalUsers
                )}
              {loading && "Loading..."}
              {!loading && " from last period"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatNumber(overview?.totalSessions || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {!loading &&
                overview &&
                getTrendBadge(
                  overview.totalSessions,
                  overview.previousPeriodComparison.totalSessions
                )}
              {loading && "Loading..."}
              {!loading && " from last period"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatNumber(overview?.totalPageviews || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {!loading &&
                overview &&
                getTrendBadge(
                  overview.totalPageviews,
                  overview.previousPeriodComparison.totalPageviews
                )}
              {loading && "Loading..."}
              {!loading && " from last period"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `$${(overview?.totalRevenue || 0).toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {!loading &&
                overview &&
                getTrendBadge(
                  overview.totalRevenue,
                  overview.previousPeriodComparison.totalRevenue
                )}
              {loading && "Loading..."}
              {!loading && " from last period"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
          >
            {/* Platform Distribution Pie Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>User distribution by platform</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData.map((p) => ({
                            name: p.platform,
                            value: p.users,
                            percentage: p.percentage,
                            fill: p.color,
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentage }) =>
                            `${name}: ${percentage}%`
                          }
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Time Series Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Users Over Time</CardTitle>
                <CardDescription>
                  Platform comparison over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="android"
                          stroke="#34D399"
                          strokeWidth={2}
                          name="Android"
                        />
                        <Line
                          type="monotone"
                          dataKey="ios"
                          stroke="#60A5FA"
                          strokeWidth={2}
                          name="iOS"
                        />
                        <Line
                          type="monotone"
                          dataKey="web"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="Web"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : platformData.map((platform) => (
                  <Card key={platform.platform}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        {platform.platform === "Android" && (
                          <IconBrandAndroid className="h-5 w-5 text-green-600" />
                        )}
                        {platform.platform === "iOS" && (
                          <IconBrandApple className="h-5 w-5 text-blue-600" />
                        )}
                        {platform.platform === "Web" && (
                          <IconWorld className="h-5 w-5 text-orange-600" />
                        )}
                        {platform.platform}
                      </CardTitle>
                      <Badge variant="secondary">{platform.percentage}%</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Users:</span>
                          <span className="text-sm">
                            {formatNumber(platform.users)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Sessions:</span>
                          <span className="text-sm">
                            {formatNumber(platform.sessions)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Avg. Duration:
                          </span>
                          <span className="text-sm">
                            {AnalyticsAPI.formatDuration(
                              platform.averageSessionDuration
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Bounce Rate:
                          </span>
                          <span className="text-sm">
                            {AnalyticsAPI.formatPercentage(platform.bounceRate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Revenue:</span>
                          <span className="text-sm">
                            ${platform.revenue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${platform.percentage}%`,
                            backgroundColor: platform.color,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last updated:{" "}
                        {lastUpdated
                          ? new Date(lastUpdated).toLocaleTimeString()
                          : "Never"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Devices</CardTitle>
                <CardDescription>
                  Most popular devices accessing your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="animate-pulse flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-8"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deviceData.slice(0, 10).map((device, index) => (
                      <div
                        key={`${device.deviceModel}-${index}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {device.operatingSystem
                              .toLowerCase()
                              .includes("android") ? (
                              <IconBrandAndroid className="h-4 w-4 text-green-600" />
                            ) : device.operatingSystem
                                .toLowerCase()
                                .includes("ios") ? (
                              <IconBrandApple className="h-4 w-4 text-blue-600" />
                            ) : (
                              <IconDeviceDesktop className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{device.deviceModel}</p>
                            <p className="text-sm text-muted-foreground">
                              {device.operatingSystem} • {device.deviceCategory}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatNumber(device.users)}
                          </p>
                          <p className="text-sm text-muted-foreground">users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Real-time Analytics
                </CardTitle>
                <CardDescription>
                  Live user activity across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="text-center p-4 border rounded-lg animate-pulse"
                      >
                        <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {realtimeData?.activeUsersByPlatform.android || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Active Android Users
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {realtimeData?.activeUsersByPlatform.ios || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Active iOS Users
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {realtimeData?.activeUsersByPlatform.web || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Active Web Users
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Top Active Pages</h4>
                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse flex justify-between"
                        >
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-8"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {(realtimeData?.topPages || [])
                        .slice(0, 5)
                        .map((page, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="truncate max-w-xs">
                              {page.page}
                            </span>
                            <span className="font-medium">
                              {page.activeUsers}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Integration Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Google Analytics 4</span>
                      <Badge
                        variant="outline"
                        className={loading ? "text-gray-600" : "text-green-600"}
                      >
                        {loading ? "Checking..." : "Connected"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Real-time Data</span>
                      <Badge
                        variant="outline"
                        className={loading ? "text-gray-600" : "text-green-600"}
                      >
                        {loading ? "Checking..." : "Active"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cross-platform Tracking</span>
                      <Badge
                        variant="outline"
                        className={loading ? "text-gray-600" : "text-green-600"}
                      >
                        {loading ? "Checking..." : "Enabled"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Data refreshes automatically every 30 seconds
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
