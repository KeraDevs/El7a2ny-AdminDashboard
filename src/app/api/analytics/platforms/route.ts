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

    // Get platform data (Web, Android, iOS)
    const response = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [createDateRange(startDate, endDate)],
      metrics: [
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "totalRevenue" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
      dimensions: [{ name: "platform" }],
    });

    const platformData = (response[0]?.rows || []).map((row: IRow) => {
      const platform = row.dimensionValues?.[0]?.value || "Unknown";
      const metrics = row.metricValues || [];

      // Map platform names from GA to our naming convention
      let mappedPlatform: "Web" | "Android" | "iOS";
      if (platform.toLowerCase().includes("android")) {
        mappedPlatform = "Android";
      } else if (platform.toLowerCase().includes("ios")) {
        mappedPlatform = "iOS";
      } else {
        mappedPlatform = "Web";
      }

      return {
        platform: mappedPlatform,
        users: parseInt(metrics[0]?.value || "0"),
        sessions: parseInt(metrics[1]?.value || "0"),
        pageviews: parseInt(metrics[2]?.value || "0"),
        revenue: parseFloat(metrics[3]?.value || "0"),
        averageSessionDuration: parseFloat(metrics[4]?.value || "0"),
        bounceRate: parseFloat(metrics[5]?.value || "0"),
        percentage: 0, // Will be calculated by the API utility
        color: "", // Will be set by the API utility
      };
    });

    // Combine platforms if there are duplicates
    const consolidatedData = platformData.reduce((acc, curr) => {
      const existingPlatform = acc.find((p) => p.platform === curr.platform);
      if (existingPlatform) {
        existingPlatform.users += curr.users;
        existingPlatform.sessions += curr.sessions;
        existingPlatform.pageviews += curr.pageviews;
        existingPlatform.revenue += curr.revenue;
        existingPlatform.averageSessionDuration =
          (existingPlatform.averageSessionDuration +
            curr.averageSessionDuration) /
          2;
        existingPlatform.bounceRate =
          (existingPlatform.bounceRate + curr.bounceRate) / 2;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as typeof platformData);

    return NextResponse.json(consolidatedData);
  } catch (error) {
    return handleApiError(error);
  }
}
