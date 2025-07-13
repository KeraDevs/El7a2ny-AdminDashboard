import { useState, useEffect, useCallback } from "react";
import {
  AnalyticsOverview,
  PlatformData,
  DeviceData,
  TimeSeriesData,
  RealtimeData,
  AcquisitionData,
  EventData,
  DateRange,
  DateRangeOption,
  getDateRangeFromOption,
} from "@/types/analyticsTypes";
import { analyticsAPI } from "@/utils/analyticsApi";

interface UseAnalyticsState {
  overview: AnalyticsOverview | null;
  platformData: PlatformData[];
  deviceData: DeviceData[];
  timeSeriesData: TimeSeriesData[];
  realtimeData: RealtimeData | null;
  acquisitionData: AcquisitionData[];
  eventData: EventData[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface UseAnalyticsReturn extends UseAnalyticsState {
  refresh: () => Promise<void>;
  setDateRange: (range: DateRangeOption | DateRange) => void;
  currentDateRange: DateRange;
  isRefreshing: boolean;
}

export function useAnalytics(
  initialDateRange: DateRangeOption = "7d"
): UseAnalyticsReturn {
  const [state, setState] = useState<UseAnalyticsState>({
    overview: null,
    platformData: [],
    deviceData: [],
    timeSeriesData: [],
    realtimeData: null,
    acquisitionData: [],
    eventData: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const [currentDateRange, setCurrentDateRange] = useState<DateRange>(
    getDateRangeFromOption(initialDateRange)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalyticsData = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        // Fetch all analytics data in parallel
        const [
          overviewResponse,
          platformResponse,
          deviceResponse,
          timeSeriesResponse,
          realtimeResponse,
          acquisitionResponse,
          eventResponse,
        ] = await Promise.all([
          analyticsAPI.getOverview(currentDateRange),
          analyticsAPI.getPlatformData(currentDateRange),
          analyticsAPI.getDeviceData(currentDateRange),
          analyticsAPI.getTimeSeriesData(currentDateRange),
          analyticsAPI.getRealtimeData(),
          analyticsAPI.getAcquisitionData(currentDateRange),
          analyticsAPI.getEventData(currentDateRange),
        ]);

        // Check for any errors
        const responses = [
          overviewResponse,
          platformResponse,
          deviceResponse,
          timeSeriesResponse,
          realtimeResponse,
          acquisitionResponse,
          eventResponse,
        ];

        const firstError = responses.find((response) => !response.success);
        if (firstError) {
          throw new Error(firstError.error || "Failed to fetch analytics data");
        }

        // Format platform data with colors and percentages
        const formattedPlatformData = analyticsAPI.formatPlatformData(
          platformResponse.data
        );

        setState((prev) => ({
          ...prev,
          overview: overviewResponse.data,
          platformData: formattedPlatformData,
          deviceData: deviceResponse.data,
          timeSeriesData: timeSeriesResponse.data,
          realtimeData: realtimeResponse.data,
          acquisitionData: acquisitionResponse.data,
          eventData: eventResponse.data,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
        }));
      } catch (error) {
        console.error("Analytics fetch error:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch analytics data",
        }));
      } finally {
        if (showRefreshing) {
          setIsRefreshing(false);
        }
      }
    },
    [currentDateRange]
  );

  const refresh = useCallback(async () => {
    await fetchAnalyticsData(true);
  }, [fetchAnalyticsData]);

  const setDateRange = useCallback((range: DateRangeOption | DateRange) => {
    let newDateRange: DateRange;

    if (typeof range === "string") {
      newDateRange = getDateRangeFromOption(range);
    } else {
      newDateRange = range;
    }

    setCurrentDateRange(newDateRange);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Auto-refresh realtime data every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const realtimeResponse = await analyticsAPI.getRealtimeData();
        if (realtimeResponse.success) {
          setState((prev) => ({
            ...prev,
            realtimeData: realtimeResponse.data,
            lastUpdated: new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error("Realtime data refresh error:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    refresh,
    setDateRange,
    currentDateRange,
    isRefreshing,
  };
}

// Hook for real-time data only
export function useRealtimeAnalytics() {
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRealtimeData = useCallback(async () => {
    try {
      const response = await analyticsAPI.getRealtimeData();
      if (response.success) {
        setRealtimeData(response.data);
        setError(null);
      } else {
        setError(response.error || "Failed to fetch realtime data");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRealtimeData();

    // Auto-refresh every 10 seconds for realtime data
    const interval = setInterval(fetchRealtimeData, 10000);

    return () => clearInterval(interval);
  }, [fetchRealtimeData]);

  return {
    realtimeData,
    loading,
    error,
    refresh: fetchRealtimeData,
  };
}

// Hook for specific platform data
export function usePlatformAnalytics(
  platform: "Web" | "Android" | "iOS",
  dateRange: DateRange
) {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getPlatformData(dateRange);

        if (response.success) {
          const platformData = response.data.find(
            (p) => p.platform === platform
          );
          setData(platformData || null);
          setError(null);
        } else {
          setError(response.error || "Failed to fetch platform data");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformData();
  }, [platform, dateRange]);

  return { data, loading, error };
}
