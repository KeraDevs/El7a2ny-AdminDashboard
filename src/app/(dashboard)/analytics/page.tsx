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
} from "recharts";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconDeviceMobile,
  IconBrandApple,
  IconBrandAndroid,
  IconWorld,
  IconRefresh,
  IconCalendar,
  IconEye,
  IconClick,
  IconDeviceDesktop,
} from "@tabler/icons-react";

// Mock data - This will be replaced with real Google Analytics data
const platformData = [
  { name: "Android App", visits: 12450, percentage: 35, color: "#34D399" },
  { name: "iOS App", visits: 8920, percentage: 25, color: "#60A5FA" },
  { name: "Web Desktop", visits: 10680, percentage: 30, color: "#F59E0B" },
  { name: "Web Mobile", visits: 3560, percentage: 10, color: "#EF4444" },
];

const timeSeriesData = [
  { date: "Jan", android: 4000, ios: 2400, web: 3200 },
  { date: "Feb", android: 3000, ios: 1398, web: 2800 },
  { date: "Mar", android: 5000, ios: 3800, web: 4200 },
  { date: "Apr", android: 4780, ios: 3908, web: 3900 },
  { date: "May", android: 5890, ios: 4800, web: 4300 },
  { date: "Jun", android: 6390, ios: 3800, web: 5100 },
];

const deviceBreakdown = [
  { device: "Samsung Galaxy", visits: 3200, os: "Android" },
  { device: "iPhone 15", visits: 2800, os: "iOS" },
  { device: "iPhone 14", visits: 2100, os: "iOS" },
  { device: "Google Pixel", visits: 1900, os: "Android" },
  { device: "OnePlus", visits: 1600, os: "Android" },
];

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
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const totalVisits = platformData.reduce(
    (sum, platform) => sum + platform.visits,
    0
  );

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
            Track user engagement across all platforms and devices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <IconCalendar className="mr-2 h-4 w-6" />
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
            disabled={isRefreshing}
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
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalVisits.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">
                <IconTrendingUp className="mr-1 h-3 w-3" />
                +12.5%
              </Badge>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mobile App Users
            </CardTitle>
            <IconDeviceMobile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21,370</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">
                <IconTrendingUp className="mr-1 h-3 w-3" />
                +8.2%
              </Badge>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Web Users</CardTitle>
            <IconWorld className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,240</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-red-600">
                <IconTrendingDown className="mr-1 h-3 w-3" />
                -2.1%
              </Badge>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
            <IconClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">
                <IconTrendingUp className="mr-1 h-3 w-3" />
                +4.7%
              </Badge>
              from last period
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
                <CardDescription>User visits by platform type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visits"
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
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Time Series Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Visits Over Time</CardTitle>
                <CardDescription>
                  Platform comparison over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
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
                    />
                    <Line
                      type="monotone"
                      dataKey="ios"
                      stroke="#60A5FA"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="web"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {platformData.map((platform) => (
              <Card key={platform.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    {platform.name === "Android App" && (
                      <IconBrandAndroid className="h-5 w-5 text-green-600" />
                    )}
                    {platform.name === "iOS App" && (
                      <IconBrandApple className="h-5 w-5 text-blue-600" />
                    )}
                    {platform.name.includes("Web") && (
                      <IconWorld className="h-5 w-5 text-orange-600" />
                    )}
                    {platform.name}
                  </CardTitle>
                  <Badge variant="secondary">{platform.percentage}%</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {platform.visits.toLocaleString()}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${platform.percentage}%`,
                        backgroundColor: platform.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated: 2 minutes ago
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
                <div className="space-y-4">
                  {deviceBreakdown.map((device) => (
                    <div
                      key={device.device}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          {device.os === "Android" ? (
                            <IconBrandAndroid className="h-4 w-4 text-green-600" />
                          ) : device.os === "iOS" ? (
                            <IconBrandApple className="h-4 w-4 text-blue-600" />
                          ) : (
                            <IconDeviceDesktop className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{device.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {device.os}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {device.visits.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">visits</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">247</div>
                    <p className="text-sm text-muted-foreground">
                      Active Android Users
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">189</div>
                    <p className="text-sm text-muted-foreground">
                      Active iOS Users
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      312
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Active Web Users
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Integration Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Google Analytics 4</span>
                      <Badge variant="outline" className="text-orange-600">
                        Pending Setup
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Firebase Analytics</span>
                      <Badge variant="outline" className="text-orange-600">
                        Pending Setup
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>App Store Connect</span>
                      <Badge variant="outline" className="text-orange-600">
                        Pending Setup
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Connect your analytics services to see real data
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
