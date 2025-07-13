import { useEffect, useState } from "react";
import {
  AnalyticsOverview,
  PlatformData,
  DeviceData,
  TimeSeriesData,
  RealtimeData,
  PLATFORM_COLORS,
} from "@/types/analyticsTypes";

// Mock data for demonstration when GA is not configured
const generateMockOverview = (): AnalyticsOverview => ({
  totalUsers: 35610,
  totalSessions: 42850,
  totalPageviews: 89340,
  totalRevenue: 12845.5,
  averageSessionDuration: 145.2,
  bounceRate: 32.4,
  conversionRate: 4.2,
  previousPeriodComparison: {
    totalUsers: 32100,
    totalSessions: 39200,
    totalPageviews: 82100,
    totalRevenue: 11200.3,
  },
});

const generateMockPlatformData = (): PlatformData[] => {
  const platforms: PlatformData[] = [
    {
      platform: "Web",
      users: 14240,
      sessions: 18350,
      pageviews: 42100,
      revenue: 5200.3,
      averageSessionDuration: 185.4,
      bounceRate: 28.1,
      percentage: 0,
      color: PLATFORM_COLORS.Web,
    },
    {
      platform: "Android",
      users: 12450,
      sessions: 15200,
      pageviews: 32400,
      revenue: 4800.2,
      averageSessionDuration: 132.8,
      bounceRate: 35.2,
      percentage: 0,
      color: PLATFORM_COLORS.Android,
    },
    {
      platform: "iOS",
      users: 8920,
      sessions: 9300,
      pageviews: 14840,
      revenue: 2845.0,
      averageSessionDuration: 168.9,
      bounceRate: 30.7,
      percentage: 0,
      color: PLATFORM_COLORS.iOS,
    },
  ];

  // Calculate percentages
  const totalUsers = platforms.reduce((sum, p) => sum + p.users, 0);
  platforms.forEach((p) => {
    p.percentage = Math.round((p.users / totalUsers) * 100);
  });

  return platforms;
};

const generateMockDeviceData = (): DeviceData[] => [
  {
    deviceCategory: "mobile",
    deviceModel: "iPhone 15",
    operatingSystem: "iOS 17",
    users: 2800,
    sessions: 3200,
    bounceRate: 28.5,
  },
  {
    deviceCategory: "mobile",
    deviceModel: "Samsung Galaxy S24",
    operatingSystem: "Android 14",
    users: 2400,
    sessions: 2850,
    bounceRate: 32.1,
  },
  {
    deviceCategory: "desktop",
    deviceModel: "Windows Desktop",
    operatingSystem: "Windows 11",
    users: 3200,
    sessions: 4100,
    bounceRate: 25.8,
  },
  {
    deviceCategory: "mobile",
    deviceModel: "iPhone 14",
    operatingSystem: "iOS 16",
    users: 2100,
    sessions: 2400,
    bounceRate: 30.2,
  },
  {
    deviceCategory: "mobile",
    deviceModel: "Google Pixel 8",
    operatingSystem: "Android 14",
    users: 1900,
    sessions: 2200,
    bounceRate: 34.5,
  },
];

const generateMockTimeSeriesData = (): TimeSeriesData[] => {
  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    dates.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      web: Math.floor(Math.random() * 1000) + 2000,
      android: Math.floor(Math.random() * 800) + 1500,
      ios: Math.floor(Math.random() * 600) + 1200,
      webRevenue: Math.random() * 500 + 200,
      androidRevenue: Math.random() * 400 + 150,
      iosRevenue: Math.random() * 300 + 100,
    });
  }

  return dates;
};

const generateMockRealtimeData = (): RealtimeData => ({
  activeUsers: 748,
  activeUsersByPlatform: {
    web: 312,
    android: 247,
    ios: 189,
  },
  topPages: [
    { page: "/dashboard", activeUsers: 156 },
    { page: "/analytics", activeUsers: 89 },
    { page: "/users", activeUsers: 67 },
    { page: "/cars", activeUsers: 45 },
    { page: "/workshops", activeUsers: 34 },
  ],
  usersByCountry: [
    { country: "Egypt", activeUsers: 425 },
    { country: "Saudi Arabia", activeUsers: 168 },
    { country: "UAE", activeUsers: 89 },
    { country: "Jordan", activeUsers: 34 },
    { country: "Kuwait", activeUsers: 32 },
  ],
});

export function useMockAnalytics() {
  const [mockData, setMockData] = useState({
    overview: null as AnalyticsOverview | null,
    platformData: [] as PlatformData[],
    deviceData: [] as DeviceData[],
    timeSeriesData: [] as TimeSeriesData[],
    realtimeData: null as RealtimeData | null,
    loading: true,
    error: null as string | null,
    lastUpdated: null as string | null,
  });

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setMockData({
        overview: generateMockOverview(),
        platformData: generateMockPlatformData(),
        deviceData: generateMockDeviceData(),
        timeSeriesData: generateMockTimeSeriesData(),
        realtimeData: generateMockRealtimeData(),
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    if (!mockData.loading) {
      const interval = setInterval(() => {
        setMockData((prev) => ({
          ...prev,
          realtimeData: {
            ...generateMockRealtimeData(),
            activeUsers: prev.realtimeData?.activeUsers
              ? prev.realtimeData.activeUsers +
                (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10)
              : 748,
          },
          lastUpdated: new Date().toISOString(),
        }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [mockData.loading]);

  const refresh = async () => {
    setMockData((prev) => ({ ...prev, loading: true }));

    // Simulate API call delay
    setTimeout(() => {
      setMockData({
        overview: generateMockOverview(),
        platformData: generateMockPlatformData(),
        deviceData: generateMockDeviceData(),
        timeSeriesData: generateMockTimeSeriesData(),
        realtimeData: generateMockRealtimeData(),
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      });
    }, 1500);
  };

  return {
    ...mockData,
    refresh,
    isRefreshing: false,
  };
}
