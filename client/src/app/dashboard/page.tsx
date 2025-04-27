"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your El7a2ny admin dashboard
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="font-medium">Total Users</h3>
          <p className="mt-2 text-2xl font-bold">1,214</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="font-medium">Workshops</h3>
          <p className="mt-2 text-2xl font-bold">56</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="font-medium">Pending Requests</h3>
          <p className="mt-2 text-2xl font-bold">23</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="font-medium">Revenue</h3>
          <p className="mt-2 text-2xl font-bold">$12,345</p>
        </div>
      </div>
    </div>
  );
}
