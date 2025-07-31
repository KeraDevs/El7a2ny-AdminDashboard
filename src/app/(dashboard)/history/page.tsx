"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconHistory,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconDots,
  IconCar,
  IconClock,
  IconBuildingStore,
  IconTools,
  IconTrendingUp,
  IconCalendar,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";
import { DataPagination } from "@/components/ui/DataPagination";
import { useRequestsHistoryPaginated } from "@/hooks/useRequestsHistoryPaginated";
import {
  ServiceRequest,
  getStatusColor,
  getPriorityColor,
} from "@/types/requestTypes";

// History Statistics Component
const HistoryStats = ({
  stats,
}: {
  stats: {
    total: number;
    new: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}) => {
  const totalRequests = stats.total;
  const completedRequests = stats.completed;
  const inProgressRequests = stats.inProgress;
  // Note: We'll need to calculate revenue from actual request data with prices
  const totalRevenue = 0; // This would need to be calculated from actual requests with prices

  const statsCards = [
    {
      title: "Total Requests",
      value: totalRequests.toString(),
      icon: IconHistory,
      description: "All service requests",
      trend: "+12.5%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Completed",
      value: completedRequests.toString(),
      icon: IconTools,
      description: "Successfully completed",
      trend: "+8.2%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "In Progress",
      value: inProgressRequests.toString(),
      icon: IconClock,
      description: "Currently active",
      trend: "+5.1%",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
    {
      title: "Total Revenue",
      value: `${totalRevenue.toLocaleString()} EGP`,
      icon: IconTrendingUp,
      description: "From completed services",
      trend: "+15.3%",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`border-0 shadow-md bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className="text-xs text-green-600 font-medium">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default function HistoryPage() {
  const {
    requests,
    loading,
    total,
    currentPage,
    pageSize,
    totalPages,
    stats,
    filters,
    handlePageChange,
    handlePageSizeChange,
    updateFilters,
    refresh,
  } = useRequestsHistoryPaginated();

  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sort requests (client-side sorting for current page)
  const sortedRequests = [...requests].sort((a, b) => {
    let valueA: string | number | Date, valueB: string | number | Date;

    switch (sortBy) {
      case "createdAt":
      case "scheduledAt":
      case "requestedAt":
        valueA = new Date(a[sortBy as keyof ServiceRequest] as string);
        valueB = new Date(b[sortBy as keyof ServiceRequest] as string);
        break;
      case "price":
        valueA = a.price || 0;
        valueB = b.price || 0;
        break;
      case "customerName":
      case "serviceName":
      case "status":
      case "priority":
        valueA = (
          (a[sortBy as keyof ServiceRequest] as string) || ""
        ).toLowerCase();
        valueB = (
          (b[sortBy as keyof ServiceRequest] as string) || ""
        ).toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const handleRefresh = () => {
    refresh();
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateFilters({ status: value });
  };

  const handlePriorityFilterChange = (value: string) => {
    updateFilters({ priority: value });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Service History
          </h1>
          <p className="text-muted-foreground">
            Track and manage all service requests
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <IconRefresh
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      <HistoryStats stats={stats} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconHistory className="h-5 w-5" />
                  Request History
                </CardTitle>
                <CardDescription>
                  View and filter all service requests
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={filters.status}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-40">
                    <IconFilter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.priority}
                  onValueChange={handlePriorityFilterChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    {sortOrder === "asc" ? (
                      <IconSortAscending className="h-4 w-4 mr-2" />
                    ) : (
                      <IconSortDescending className="h-4 w-4 mr-2" />
                    )}
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="scheduledAt">Scheduled Date</SelectItem>
                    <SelectItem value="customerName">Customer</SelectItem>
                    <SelectItem value="serviceName">Service</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="price">Cost</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <IconSortAscending className="h-4 w-4" />
                  ) : (
                    <IconSortDescending className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRequests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border-b border-gray-100"
                    >
                      <TableCell>
                        <div className="font-medium">{request.id}</div>
                        <div className="text-sm text-muted-foreground">
                          Created: {formatDate(request.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {request.customerName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.customerPhone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.serviceName}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.serviceDescription}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconCar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.vehicleModel}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.workshopName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPriorityColor(request.priority)}
                          variant="outline"
                        >
                          {request.priority || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconCalendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {request.scheduledAt
                              ? formatDate(request.scheduledAt)
                              : "Not scheduled"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          {request.price
                            ? `${request.price.toLocaleString()} EGP`
                            : "Not set"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <IconDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>
                              Contact Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
              {sortedRequests.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <IconHistory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No requests found matching your criteria.</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <IconRefresh className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Loading requests...</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="border-t">
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  itemsPerPage={pageSize}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handlePageSizeChange}
                  itemType="requests"
                  loading={loading}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={sortedRequests.map((request) => ({
          id: request.id,
          customer_name: request.customerName,
          customer_phone: request.customerPhone,
          vehicle_model: request.vehicleModel,
          workshop_name: request.workshopName,
          service_type: request.serviceName,
          priority: request.priority || "",
          status: request.status,
          price: request.price?.toString() || "0",
          scheduled_at: request.scheduledAt?.toISOString() || "",
          created_at: request.createdAt.toISOString(),
        }))}
        filename="service-history"
      />
    </div>
  );
}
