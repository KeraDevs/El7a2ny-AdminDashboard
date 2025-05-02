"use client";

import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your El7a2ny admin dashboard
        </p>
      </div>

      <DashboardAnalytics />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {i}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {i === 1
                          ? "New workshop registered"
                          : i === 2
                          ? "User payment completed"
                          : i === 3
                          ? "Service request approved"
                          : "System maintenance scheduled"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i} hour{i > 1 ? "s" : ""} ago
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all activity →
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
