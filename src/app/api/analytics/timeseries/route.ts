import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";

type IRow = protos.google.analytics.data.v1beta.IRow;

// Initialize Google Analytics client
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getAnalyticsClient() {
  if (!analyticsDataClient) {
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    analyticsDataClient = new BetaAnalyticsDataClient({ auth });
  }
  return analyticsDataClient;
}

const PROPERTY_ID = process.env.GA_PROPERTY_ID;

// Helper function to create date range
function createDateRange(startDate: string, endDate: string) {
  return {
    startDate,
    endDate,
  };
}

// Helper function to handle API errors
function handleApiError(error: unknown) {
  console.error("Analytics API Error:", error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json(
    { error: "Failed to fetch analytics data", details: errorMessage },
    { status: 500 }
  );
}

// Helper to format date for display
function formatDateForChart(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function POST(request: NextRequest) {
  try {
    if (!PROPERTY_ID) {
      return NextResponse.json(
        { error: "Google Analytics not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { startDate, endDate } = body.dateRange;

    const client = getAnalyticsClient();

    // Get time series data by platform
    const response = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [createDateRange(startDate, endDate)],
      metrics: [{ name: "totalUsers" }, { name: "totalRevenue" }],
      dimensions: [{ name: "date" }, { name: "platform" }],
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
          desc: false,
        },
      ],
    });

    // Process the data to group by date and platform
    const dataMap = new Map<
      string,
      {
        date: string;
        web: number;
        android: number;
        ios: number;
        webRevenue: number;
        androidRevenue: number;
        iosRevenue: number;
      }
    >();

    (response[0]?.rows || []).forEach((row: IRow) => {
      const dimensionValues = row.dimensionValues || [];
      const metricValues = row.metricValues || [];

      const date = dimensionValues[0]?.value || "";
      const platform = dimensionValues[1]?.value || "";
      const users = parseInt(metricValues[0]?.value || "0");
      const revenue = parseFloat(metricValues[1]?.value || "0");

      const formattedDate = formatDateForChart(date);

      if (!dataMap.has(formattedDate)) {
        dataMap.set(formattedDate, {
          date: formattedDate,
          web: 0,
          android: 0,
          ios: 0,
          webRevenue: 0,
          androidRevenue: 0,
          iosRevenue: 0,
        });
      }

      const entry = dataMap.get(formattedDate)!;

      // Map platform names from GA to our naming convention
      if (platform.toLowerCase().includes("android")) {
        entry.android += users;
        entry.androidRevenue += revenue;
      } else if (platform.toLowerCase().includes("ios")) {
        entry.ios += users;
        entry.iosRevenue += revenue;
      } else {
        entry.web += users;
        entry.webRevenue += revenue;
      }
    });

    // Convert map to array and sort by date
    const timeSeriesData = Array.from(dataMap.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return NextResponse.json(timeSeriesData);
  } catch (error) {
    return handleApiError(error);
  }
}
