export interface DashboardMetrics {
  totalUsers: number;
  activeWorkshops: number;
  pendingRequests: number;
  totalRevenue: string;
  completedServices: number;
  activeChats: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  user: string;
  workshop: string;
  status: string;
  time: string;
}

export interface SalesData {
  day: string;
  amount: number;
  date: string;
}
