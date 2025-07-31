import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

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

if (!PROPERTY_ID) {
  console.warn("GA_PROPERTY_ID environment variable is not set");
}

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

// Common request validation
function validateRequest(body: {
  dateRange?: { startDate?: string; endDate?: string };
}) {
  if (!body.dateRange || !body.dateRange.startDate || !body.dateRange.endDate) {
    return false;
  }
  return true;
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

    if (!validateRequest(body)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const client = getAnalyticsClient();
    const { startDate, endDate } = body.dateRange;

    // Get overview data
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
        { name: "conversions" },
      ],
      dimensions: [],
    });

    // Get previous period data for comparison
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(endDate);
    const daysDiff = Math.floor(
      (previousEndDate.getTime() - previousStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
    previousEndDate.setDate(previousEndDate.getDate() - daysDiff);

    const previousResponse = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        createDateRange(
          previousStartDate.toISOString().split("T")[0],
          previousEndDate.toISOString().split("T")[0]
        ),
      ],
      metrics: [
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "totalRevenue" },
      ],
      dimensions: [],
    });

    const currentData = response[0]?.rows?.[0]?.metricValues || [];
    const previousData = previousResponse[0]?.rows?.[0]?.metricValues || [];

    const overviewData = {
      totalUsers: parseInt(currentData[0]?.value || "0"),
      totalSessions: parseInt(currentData[1]?.value || "0"),
      totalPageviews: parseInt(currentData[2]?.value || "0"),
      totalRevenue: parseFloat(currentData[3]?.value || "0"),
      averageSessionDuration: parseFloat(currentData[4]?.value || "0"),
      bounceRate: parseFloat(currentData[5]?.value || "0"),
      conversionRate: parseFloat(currentData[6]?.value || "0"),
      previousPeriodComparison: {
        totalUsers: parseInt(previousData[0]?.value || "0"),
        totalSessions: parseInt(previousData[1]?.value || "0"),
        totalPageviews: parseInt(previousData[2]?.value || "0"),
        totalRevenue: parseFloat(previousData[3]?.value || "0"),
      },
    };

    return NextResponse.json(overviewData);
  } catch (error) {
    return handleApiError(error);
  }
}
