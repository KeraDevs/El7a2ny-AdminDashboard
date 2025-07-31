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

    // Get device and OS data
    const response = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [createDateRange(startDate, endDate)],
      metrics: [
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "bounceRate" },
      ],
      dimensions: [
        { name: "deviceCategory" },
        { name: "deviceModel" },
        { name: "operatingSystem" },
      ],
      orderBys: [
        {
          metric: {
            metricName: "totalUsers",
          },
          desc: true,
        },
      ],
      limit: 20, // Top 20 devices
    });

    const deviceData = (response[0]?.rows || []).map((row: IRow) => {
      const dimensionValues = row.dimensionValues || [];
      const metricValues = row.metricValues || [];

      return {
        deviceCategory: dimensionValues[0]?.value || "Unknown",
        deviceModel: dimensionValues[1]?.value || "Unknown",
        operatingSystem: dimensionValues[2]?.value || "Unknown",
        users: parseInt(metricValues[0]?.value || "0"),
        sessions: parseInt(metricValues[1]?.value || "0"),
        bounceRate: parseFloat(metricValues[2]?.value || "0"),
      };
    });

    return NextResponse.json(deviceData);
  } catch (error) {
    return handleApiError(error);
  }
}
