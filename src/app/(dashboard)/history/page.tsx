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

interface ServiceRequest {
  id: string;
  service_type_id: string;
  vehicle_id: string;
  workshop_id: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "pending" | "in_progress" | "completed" | "cancelled";
  scheduled_at: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  vehicle_model: string;
  workshop_name: string;
  estimated_cost: number;
  actual_cost?: number;
  description: string;
}

// Mock data for service requests
const mockRequests: ServiceRequest[] = [
  {
    id: "REQ001",
    service_type_id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    vehicle_id: "098f6bcd-4621-3373-8ade-4e832627b4f6",
    workshop_id: "a3dfc292-0811-4e16-b8b8-76c9a58213b4",
    priority: "high",
    status: "completed",
    scheduled_at: "2025-06-05T10:00:00Z",
    created_at: "2025-06-01T08:30:00Z",
    customer_name: "Ahmed Hassan",
    customer_phone: "+20 100 123 4567",
    service_type: "Engine Repair",
    vehicle_model: "Toyota Camry 2020",
    workshop_name: "Auto Tech Workshop",
    estimated_cost: 1500,
    actual_cost: 1350,
    description: "Engine diagnostic and repair",
  },
  {
    id: "REQ002",
    service_type_id: "b290f1ee-6c54-4b01-90e6-d701748f0852",
    vehicle_id: "198f6bcd-4621-3373-8ade-4e832627b4f7",
    workshop_id: "b3dfc292-0811-4e16-b8b8-76c9a58213b5",
    priority: "medium",
    status: "in_progress",
    scheduled_at: "2025-06-06T14:00:00Z",
    created_at: "2025-06-02T10:15:00Z",
    customer_name: "Sarah Mohamed",
    customer_phone: "+20 101 234 5678",
    service_type: "Brake Service",
    vehicle_model: "Honda Civic 2019",
    workshop_name: "Speed Garage",
    estimated_cost: 800,
    description: "Brake pads and fluid replacement",
  },
  {
    id: "REQ003",
    service_type_id: "c290f1ee-6c54-4b01-90e6-d701748f0853",
    vehicle_id: "298f6bcd-4621-3373-8ade-4e832627b4f8",
    workshop_id: "c3dfc292-0811-4e16-b8b8-76c9a58213b6",
    priority: "urgent",
    status: "pending",
    scheduled_at: "2025-06-07T09:00:00Z",
    created_at: "2025-06-03T16:45:00Z",
    customer_name: "Mohamed Ali",
    customer_phone: "+20 102 345 6789",
    service_type: "Transmission Repair",
    vehicle_model: "BMW X5 2021",
    workshop_name: "Elite Motors",
    estimated_cost: 3500,
    description: "Transmission overhaul and maintenance",
  },
  {
    id: "REQ004",
    service_type_id: "e290f1ee-6c54-4b01-90e6-d701748f0854",
    vehicle_id: "398f6bcd-4621-3373-8ade-4e832627b4f9",
    workshop_id: "d3dfc292-0811-4e16-b8b8-76c9a58213b7",
    priority: "low",
    status: "new",
    scheduled_at: "2025-06-08T11:00:00Z",
    created_at: "2025-06-04T12:20:00Z",
    customer_name: "Fatma Ibrahim",
    customer_phone: "+20 103 456 7890",
    service_type: "Oil Change",
    vehicle_model: "Nissan Altima 2018",
    workshop_name: "Quick Fix",
    estimated_cost: 200,
    description: "Regular oil change and filter replacement",
  },
  {
    id: "REQ005",
    service_type_id: "f290f1ee-6c54-4b01-90e6-d701748f0855",
    vehicle_id: "498f6bcd-4621-3373-8ade-4e832627b4fa",
    workshop_id: "e3dfc292-0811-4e16-b8b8-76c9a58213b8",
    priority: "high",
    status: "cancelled",
    scheduled_at: "2025-06-09T15:30:00Z",
    created_at: "2025-06-05T14:10:00Z",
    customer_name: "Omar Khaled",
    customer_phone: "+20 104 567 8901",
    service_type: "AC Repair",
    vehicle_model: "Mercedes C-Class 2022",
    workshop_name: "City Auto Care",
    estimated_cost: 1200,
    description: "Air conditioning system repair",
  },
  {
    id: "REQ006",
    service_type_id: "g290f1ee-6c54-4b01-90e6-d701748f0856",
    vehicle_id: "598f6bcd-4621-3373-8ade-4e832627b4fb",
    workshop_id: "f3dfc292-0811-4e16-b8b8-76c9a58213b9",
    priority: "medium",
    status: "completed",
    scheduled_at: "2025-06-04T13:00:00Z",
    created_at: "2025-06-01T09:30:00Z",
    customer_name: "Nour Ahmed",
    customer_phone: "+20 105 678 9012",
    service_type: "Tire Replacement",
    vehicle_model: "Hyundai Elantra 2020",
    workshop_name: "Tire Pro",
    estimated_cost: 600,
    actual_cost: 580,
    description: "Full tire set replacement",
  },
];

// History Statistics Component
const HistoryStats = ({ requests }: { requests: ServiceRequest[] }) => {
  const totalRequests = requests.length;
  const completedRequests = requests.filter(
    (r) => r.status === "completed"
  ).length;
  const inProgressRequests = requests.filter(
    (r) => r.status === "in_progress"
  ).length;
  const totalRevenue = requests
    .filter((r) => r.actual_cost)
    .reduce((sum, r) => sum + (r.actual_cost || 0), 0);

  const stats = [
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
      {stats.map((stat, index) => (
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
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort requests
  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.customer_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.service_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.vehicle_model
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.workshop_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || request.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let valueA: string | number | Date, valueB: string | number | Date;

      switch (sortBy) {
        case "created_at":
        case "scheduled_at":
          valueA = new Date(a[sortBy as keyof ServiceRequest] as string);
          valueB = new Date(b[sortBy as keyof ServiceRequest] as string);
          break;
        case "estimated_cost":
          valueA = a.estimated_cost;
          valueB = b.estimated_cost;
          break;
        case "customer_name":
        case "service_type":
        case "status":
        case "priority":
          valueA = (a[sortBy as keyof ServiceRequest] as string).toLowerCase();
          valueB = (b[sortBy as keyof ServiceRequest] as string).toLowerCase();
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

  // Add pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real app, you would fetch fresh data here
    setRequests([...mockRequests]);
    setIsRefreshing(false);
  };

  const getStatusColor = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "new":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md";
      case "pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md";
      case "in_progress":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md";
      case "completed":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md";
    }
  };

  const getPriorityColor = (priority: ServiceRequest["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm";
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm";
      case "high":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm";
      case "urgent":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
          disabled={isRefreshing}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <IconRefresh
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      <HistoryStats requests={requests} />

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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <IconFilter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
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
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="scheduled_at">Scheduled Date</SelectItem>
                    <SelectItem value="customer_name">Customer</SelectItem>
                    <SelectItem value="service_type">Service</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="estimated_cost">Cost</SelectItem>
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
                  {paginatedRequests.map((request, index) => (
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
                          Created: {formatDate(request.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {request.customer_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.customer_phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {request.service_type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconCar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.vehicle_model}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.workshop_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPriorityColor(request.priority)}
                          variant="outline"
                        >
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconCalendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(request.scheduled_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          {request.actual_cost
                            ? `${request.actual_cost.toLocaleString()} EGP`
                            : `${request.estimated_cost.toLocaleString()} EGP (est.)`}
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
              {paginatedRequests.length === 0 && filteredRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <IconHistory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No requests found matching your criteria.</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {filteredRequests.length > 0 && (
              <div className="border-t">
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredRequests.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  itemType="requests"
                  loading={isRefreshing}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={paginatedRequests.map((request) => ({
          id: request.id?.toString() || "",
          customer_name: request.customer_name || "",
          customer_phone: request.customer_phone || "",
          vehicle_model: request.vehicle_model || "",
          workshop_name: request.workshop_name || "",
          service_type: request.service_type || "",
          priority: request.priority || "",
          status: request.status || "",
          estimated_cost: request.estimated_cost?.toString() || "0",
          actual_cost: request.actual_cost?.toString() || "0",
          scheduled_at: request.scheduled_at || "",
          created_at: request.created_at || "",
        }))}
        filename="service-history"
        pageName="Service History Report"
      />
    </div>
  );
}
