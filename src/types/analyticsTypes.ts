// Google Analytics 4 API Types
export interface GAMetric {
  name: string;
  values: string[];
}

export interface GADimension {
  name: string;
  values: string[];
}

export interface GARow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

export interface GAReportResponse {
  rows: GARow[];
  rowCount: number;
  metadata: {
    currencyCode: string;
    timeZone: string;
  };
}

// Our Analytics Types
export interface AnalyticsOverview {
  totalUsers: number;
  totalSessions: number;
  totalPageviews: number;
  totalRevenue: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  previousPeriodComparison: {
    totalUsers: number;
    totalSessions: number;
    totalPageviews: number;
    totalRevenue: number;
  };
}

export interface PlatformData {
  platform: "Web" | "Android" | "iOS";
  users: number;
  sessions: number;
  pageviews: number;
  revenue: number;
  averageSessionDuration: number;
  bounceRate: number;
  percentage: number;
  color: string;
}

export interface DeviceData {
  deviceCategory: string;
  deviceModel: string;
  operatingSystem: string;
  users: number;
  sessions: number;
  bounceRate: number;
}

export interface TimeSeriesData {
  date: string;
  web: number;
  android: number;
  ios: number;
  webRevenue?: number;
  androidRevenue?: number;
  iosRevenue?: number;
}

export interface RealtimeData {
  activeUsers: number;
  activeUsersByPlatform: {
    web: number;
    android: number;
    ios: number;
  };
  topPages: Array<{
    page: string;
    activeUsers: number;
  }>;
  usersByCountry: Array<{
    country: string;
    activeUsers: number;
  }>;
}

export interface AcquisitionData {
  source: string;
  medium: string;
  campaign: string;
  users: number;
  sessions: number;
  conversions: number;
  revenue: number;
}

export interface EventData {
  eventName: string;
  eventCount: number;
  uniqueUsers: number;
  platform: "Web" | "Android" | "iOS";
  conversionRate: number;
}

// Date Range Types
export type DateRangeOption = "24h" | "7d" | "30d" | "90d" | "1y" | "custom";

export interface DateRange {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}

// API Request Types
export interface AnalyticsRequest {
  dateRange: DateRange;
  metrics: string[];
  dimensions: string[];
  filters?: GAFilter[];
  orderBy?: GAOrderBy[];
  limit?: number;
  offset?: number;
}

export interface GAFilter {
  fieldName: string;
  stringFilter?: {
    matchType:
      | "EXACT"
      | "BEGINS_WITH"
      | "ENDS_WITH"
      | "CONTAINS"
      | "FULL_REGEXP"
      | "PARTIAL_REGEXP";
    value: string;
  };
  numericFilter?: {
    operation:
      | "EQUAL"
      | "LESS_THAN"
      | "LESS_THAN_OR_EQUAL"
      | "GREATER_THAN"
      | "GREATER_THAN_OR_EQUAL"
      | "BETWEEN";
    value: {
      int64Value?: string;
      doubleValue?: number;
    };
  };
}

export interface GAOrderBy {
  metric?: {
    metricName: string;
  };
  dimension?: {
    dimensionName: string;
  };
  desc: boolean;
}

// Configuration Types
export interface AnalyticsConfig {
  propertyId: string;
  webDataStream: {
    measurementId: string;
    streamId: string;
  };
  androidApp: {
    packageName: string;
    streamId: string;
  };
  iosApp: {
    bundleId: string;
    streamId: string;
  };
}

// Response wrapper
export interface AnalyticsResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

// Utility function to get date range from option
export function getDateRangeFromOption(option: DateRangeOption): DateRange {
  const endDate = new Date();
  const startDate = new Date();

  switch (option) {
    case "24h":
      startDate.setDate(endDate.getDate() - 1);
      break;
    case "7d":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(endDate.getDate() - 90);
      break;
    case "1y":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

// Platform color mapping
export const PLATFORM_COLORS = {
  Web: "#F59E0B",
  Android: "#34D399",
  iOS: "#60A5FA",
} as const;

// Metric mapping for display
export const METRIC_DISPLAY_NAMES = {
  totalUsers: "Total Users",
  activeUsers: "Active Users",
  sessions: "Sessions",
  screenPageViews: "Page Views",
  averageSessionDuration: "Avg. Session Duration",
  bounceRate: "Bounce Rate",
  totalRevenue: "Revenue",
  conversions: "Conversions",
  eventCount: "Events",
} as const;

// Dimension mapping for display
export const DIMENSION_DISPLAY_NAMES = {
  platform: "Platform",
  deviceCategory: "Device Category",
  operatingSystem: "Operating System",
  country: "Country",
  source: "Source",
  medium: "Medium",
  campaign: "Campaign",
  eventName: "Event Name",
  pagePath: "Page Path",
} as const;
