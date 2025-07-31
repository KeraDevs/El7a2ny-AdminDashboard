import {
  AnalyticsResponse,
  AnalyticsOverview,
  PlatformData,
  DeviceData,
  TimeSeriesData,
  RealtimeData,
  AcquisitionData,
  EventData,
  DateRange,
  AnalyticsConfig,
  PLATFORM_COLORS,
} from "@/types/analyticsTypes";

// Google Analytics API Configuration
const GA_CONFIG: AnalyticsConfig = {
  propertyId: process.env.NEXT_PUBLIC_GA_PROPERTY_ID || "",
  webDataStream: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    streamId: process.env.NEXT_PUBLIC_GA_WEB_STREAM_ID || "",
  },
  androidApp: {
    packageName: process.env.NEXT_PUBLIC_ANDROID_PACKAGE_NAME || "",
    streamId: process.env.NEXT_PUBLIC_GA_ANDROID_STREAM_ID || "",
  },
  iosApp: {
    bundleId: process.env.NEXT_PUBLIC_IOS_BUNDLE_ID || "",
    streamId: process.env.NEXT_PUBLIC_GA_IOS_STREAM_ID || "",
  },
};

const API_BASE = "/api/analytics";

class AnalyticsAPI {
  private async makeRequest<T>(
    endpoint: string,
    requestData?: Record<string, unknown>
  ): Promise<AnalyticsResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Analytics API Error (${endpoint}):`, error);
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Get overview analytics data
  async getOverview(
    dateRange: DateRange
  ): Promise<AnalyticsResponse<AnalyticsOverview>> {
    return this.makeRequest<AnalyticsOverview>("/overview", { dateRange });
  }

  // Get platform breakdown data
  async getPlatformData(
    dateRange: DateRange
  ): Promise<AnalyticsResponse<PlatformData[]>> {
    return this.makeRequest<PlatformData[]>("/platforms", { dateRange });
  }

  // Get device and OS breakdown
  async getDeviceData(
    dateRange: DateRange
  ): Promise<AnalyticsResponse<DeviceData[]>> {
    return this.makeRequest<DeviceData[]>("/devices", { dateRange });
  }

  // Get time series data for charts
  async getTimeSeriesData(
    dateRange: DateRange
  ): Promise<AnalyticsResponse<TimeSeriesData[]>> {
    return this.makeRequest<TimeSeriesData[]>("/timeseries", { dateRange });
  }

  // Get real-time analytics data
  async getRealtimeData(): Promise<AnalyticsResponse<RealtimeData>> {
    return this.makeRequest<RealtimeData>("/realtime");
  }

  // Get acquisition data (traffic sources)
  async getAcquisitionData(
    dateRange: DateRange
  ): Promise<AnalyticsResponse<AcquisitionData[]>> {
    return this.makeRequest<AcquisitionData[]>("/acquisition", { dateRange });
  }

  // Get event analytics data
  async getEventData(
    dateRange: DateRange
  ): Promise<AnalyticsResponse<EventData[]>> {
    return this.makeRequest<EventData[]>("/events", { dateRange });
  }

  // Get top pages/screens
  async getTopPages(
    dateRange: DateRange,
    platform?: "Web" | "Android" | "iOS"
  ): Promise<
    AnalyticsResponse<
      Array<{ page: string; pageviews: number; uniquePageviews: number }>
    >
  > {
    return this.makeRequest("/top-pages", { dateRange, platform });
  }

  // Get conversion funnel data
  async getConversionFunnel(
    dateRange: DateRange
  ): Promise<
    AnalyticsResponse<
      Array<{ step: string; users: number; conversionRate: number }>
    >
  > {
    return this.makeRequest("/conversion-funnel", { dateRange });
  }

  // Get user retention data
  async getUserRetention(
    dateRange: DateRange
  ): Promise<
    AnalyticsResponse<
      Array<{
        cohort: string;
        day0: number;
        day1: number;
        day7: number;
        day30: number;
      }>
    >
  > {
    return this.makeRequest("/user-retention", { dateRange });
  }

  // Helper method to format platform data with colors
  formatPlatformData(data: PlatformData[]): PlatformData[] {
    const totalUsers = data.reduce((sum, platform) => sum + platform.users, 0);

    return data.map((platform) => ({
      ...platform,
      percentage:
        totalUsers > 0 ? Math.round((platform.users / totalUsers) * 100) : 0,
      color: PLATFORM_COLORS[platform.platform] || "#6B7280",
    }));
  }

  // Helper method to format numbers
  static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  // Helper method to format percentage
  static formatPercentage(num: number): string {
    return num.toFixed(1) + "%";
  }

  // Helper method to format duration (seconds to human readable)
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  // Helper method to calculate percentage change
  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Helper method to get trend indicator
  static getTrendIndicator(
    current: number,
    previous: number
  ): "up" | "down" | "neutral" {
    const change = this.calculatePercentageChange(current, previous);
    if (change > 0.5) return "up";
    if (change < -0.5) return "down";
    return "neutral";
  }
}

// Export singleton instance
export const analyticsAPI = new AnalyticsAPI();

// Export the class for testing
export { AnalyticsAPI };

// Export configuration for use in API routes
export { GA_CONFIG };
