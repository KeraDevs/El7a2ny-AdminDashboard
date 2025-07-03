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
import { Button } from "@/components/ui/button";
import { Car, Calendar } from "lucide-react";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestUrgencyBadge from "./RequestUrgencyBadge";
import { RequestsTableProps } from "@/types/requestTypes";

const RequestsTable = ({
  requests,
  totalRequests,
  onView,
  onEdit,
  onAssign,
}: RequestsTableProps) => {
  return (
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
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    {request.vehicleModel} ({request.vehicleYear})
                  </div>
                </TableCell>
                <TableCell>{request.serviceName}</TableCell>
                <TableCell>
                  <RequestStatusBadge
                    status={
                      request.status === "New"
                        ? "pending"
                        : request.status === "Pending"
                        ? "pending"
                        : request.status === "In Progress"
                        ? "in-progress"
                        : request.status === "Completed"
                        ? "completed"
                        : request.status === "Cancelled"
                        ? "cancelled"
                        : "pending"
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {request.workshopName ? (
                      request.workshopName
                    ) : (
                      <span className="text-muted-foreground italic text-sm">
                        Not assigned
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <RequestUrgencyBadge
                    urgency={
                      request.priority === "medium"
                        ? "normal"
                        : request.priority === null
                        ? "normal"
                        : request.priority
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(request)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(request)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAssign(request)}
                    >
                      Assign
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
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
          Showing {requests.length} of {totalRequests} requests
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
  );
};

export default RequestsTable;
