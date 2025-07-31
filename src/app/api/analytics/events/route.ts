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

    // Get event data
    const response = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [createDateRange(startDate, endDate)],
      metrics: [
        { name: "eventCount" },
        { name: "totalUsers" },
        { name: "conversions" },
      ],
      dimensions: [{ name: "eventName" }, { name: "platform" }],
      orderBys: [
        {
          metric: {
            metricName: "eventCount",
          },
          desc: true,
        },
      ],
      limit: 50,
    });

    const eventData = (response[0]?.rows || []).map((row: IRow) => {
      const dimensionValues = row.dimensionValues || [];
      const metricValues = row.metricValues || [];

      const platform = dimensionValues[1]?.value || "";
      const eventCount = parseInt(metricValues[0]?.value || "0");
      const uniqueUsers = parseInt(metricValues[1]?.value || "0");
      const conversions = parseInt(metricValues[2]?.value || "0");

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
        eventName: dimensionValues[0]?.value || "Unknown",
        eventCount,
        uniqueUsers,
        platform: mappedPlatform,
        conversionRate: uniqueUsers > 0 ? (conversions / uniqueUsers) * 100 : 0,
      };
    });

    return NextResponse.json(eventData);
  } catch (error) {
    return handleApiError(error);
  }
}
