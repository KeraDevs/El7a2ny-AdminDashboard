import { NextResponse } from "next/server";
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

// Helper function to handle API errors
function handleApiError(error: unknown) {
  console.error("Analytics API Error:", error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json(
    { error: "Failed to fetch analytics data", details: errorMessage },
    { status: 500 }
  );
}

export async function POST() {
  try {
    if (!PROPERTY_ID) {
      return NextResponse.json(
        { error: "Google Analytics not configured" },
        { status: 500 }
      );
    }

    const client = getAnalyticsClient();

    // Get real-time data
    const response = await client.runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      metrics: [{ name: "activeUsers" }],
      dimensions: [{ name: "platform" }],
    });

    // Process real-time platform data
    const platformUsers = {
      web: 0,
      android: 0,
      ios: 0,
    };

    (response[0]?.rows || []).forEach((row: IRow) => {
      const dimensionValues = row.dimensionValues || [];
      const metricValues = row.metricValues || [];

      const platform = dimensionValues[0]?.value || "";
      const activeUsers = parseInt(metricValues[0]?.value || "0");

      // Map platform names from GA to our naming convention
      if (platform.toLowerCase().includes("android")) {
        platformUsers.android += activeUsers;
      } else if (platform.toLowerCase().includes("ios")) {
        platformUsers.ios += activeUsers;
      } else {
        platformUsers.web += activeUsers;
      }
    });

    // Get top pages in real-time
    const topPagesResponse = await client.runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      metrics: [{ name: "activeUsers" }],
      dimensions: [{ name: "unifiedScreenName" }],
      orderBys: [
        {
          metric: {
            metricName: "activeUsers",
          },
          desc: true,
        },
      ],
      limit: 10,
    });

    const topPages = (topPagesResponse[0]?.rows || []).map((row: IRow) => {
      const dimensionValues = row.dimensionValues || [];
      const metricValues = row.metricValues || [];

      return {
        page: dimensionValues[0]?.value || "Unknown",
        activeUsers: parseInt(metricValues[0]?.value || "0"),
      };
    });

    // Get users by country in real-time
    const countryResponse = await client.runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      metrics: [{ name: "activeUsers" }],
      dimensions: [{ name: "country" }],
      orderBys: [
        {
          metric: {
            metricName: "activeUsers",
          },
          desc: true,
        },
      ],
      limit: 10,
    });

    const usersByCountry = (countryResponse[0]?.rows || []).map((row: IRow) => {
      const dimensionValues = row.dimensionValues || [];
      const metricValues = row.metricValues || [];

      return {
        country: dimensionValues[0]?.value || "Unknown",
        activeUsers: parseInt(metricValues[0]?.value || "0"),
      };
    });

    const totalActiveUsers =
      platformUsers.web + platformUsers.android + platformUsers.ios;

    const realtimeData = {
      activeUsers: totalActiveUsers,
      activeUsersByPlatform: platformUsers,
      topPages,
      usersByCountry,
    };

    return NextResponse.json(realtimeData);
  } catch (error) {
    return handleApiError(error);
  }
}
