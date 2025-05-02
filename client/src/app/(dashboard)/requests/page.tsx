"use client";

import {
  ReactElement,
  ReactNode,
  ReactPortal,
  JSXElementConstructor,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Clock,
  Filter,
  Search,
  AlertCircle,
  Calendar,
  WrenchIcon,
  Car,
} from "lucide-react";

const mockRequests = [
  {
    id: "REQ-1234",
    customerName: "Ahmed Hassan",
    vehicle: "BMW X5 2022",
    service: "Oil Change",
    status: "pending",
    date: "2025-05-01",
    workshop: "Cairo Auto Center",
    urgency: "normal",
  },
  {
    id: "REQ-1235",
    customerName: "Fatima Ali",
    vehicle: "Mercedes C200 2021",
    service: "Brake Replacement",
    status: "in-progress",
    date: "2025-05-01",
    workshop: "Elite Motors",
    urgency: "high",
  },
  {
    id: "REQ-1236",
    customerName: "Mohamed Ibrahim",
    vehicle: "Toyota Corolla 2023",
    service: "Annual Inspection",
    status: "completed",
    date: "2025-04-30",
    workshop: "AutoFix Workshop",
    urgency: "normal",
  },
  {
    id: "REQ-1237",
    customerName: "Sara Mahmoud",
    vehicle: "Honda Civic 2024",
    service: "Tire Rotation",
    status: "pending",
    date: "2025-05-02",
    workshop: "Cairo Auto Center",
    urgency: "low",
  },
  {
    id: "REQ-1238",
    customerName: "Khaled Ahmed",
    vehicle: "Hyundai Tucson 2022",
    service: "Engine Diagnostics",
    status: "cancelled",
    date: "2025-04-29",
    workshop: "Elite Motors",
    urgency: "high",
  },
];

const RequestsPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = mockRequests.filter((request) => {
    // Filter by status
    if (filter !== "all" && request.status !== filter) return false;

    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        request.customerName.toLowerCase().includes(searchLower) ||
        request.vehicle.toLowerCase().includes(searchLower) ||
        request.service.toLowerCase().includes(searchLower) ||
        request.id.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const getStatusBadge = (
    status:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<unknown, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | Promise<
          | string
          | number
          | bigint
          | boolean
          | ReactPortal
          | ReactElement<unknown, string | JSXElementConstructor<any>>
          | Iterable<ReactNode>
          | null
          | undefined
        >
      | null
      | undefined
  ) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            <WrenchIcon className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (
    urgency:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<unknown, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | Promise<
          | string
          | number
          | bigint
          | boolean
          | ReactPortal
          | ReactElement<unknown, string | JSXElementConstructor<any>>
          | Iterable<ReactNode>
          | null
          | undefined
        >
      | null
      | undefined
  ) => {
    switch (urgency) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">High</Badge>
        );
      case "normal":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Low
          </Badge>
        );
      default:
        return <Badge>{urgency}</Badge>;
    }
  };

  // Calculate stats
  const totalRequests = mockRequests.length;
  const pendingRequests = mockRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const inProgressRequests = mockRequests.filter(
    (r) => r.status === "in-progress"
  ).length;
  const completedRequests = mockRequests.filter(
    (r) => r.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
        <p className="text-muted-foreground">
          Manage and track all maintenance requests across workshops
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Today</Button>
          <Button variant="outline">This Week</Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
          <CardDescription>
            View and manage all car maintenance requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Workshop</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      {request.vehicle}
                    </div>
                  </TableCell>
                  <TableCell>{request.service}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(request.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{request.workshop}</TableCell>
                  <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {totalRequests} requests
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RequestsPage;
