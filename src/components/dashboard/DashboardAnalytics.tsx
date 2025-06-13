"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,214</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">56</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">23</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">EGP 12,345</div>
        </CardContent>
      </Card>
    </div>
  );
}
