import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, Calendar, Building, Wrench } from "lucide-react";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestUrgencyBadge from "./RequestUrgencyBadge";
import { RequestDetailsDialogProps } from "@/types/requestTypes";

const RequestDetailsDialog = ({
  request,
  isOpen,
  onClose,
}: RequestDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            View complete information about this service request
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Request ID:</span>
              <span className="text-sm">{request.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium">Customer:</span>
              <span className="text-sm">{request.customerName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Vehicle:</span>
              <span className="text-sm flex items-center gap-1">
                <Car className="h-4 w-4" /> {request.vehicleModel} (
                {request.vehicleYear}) - {request.vehicleLicensePlate}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Service:</span>
              <span className="text-sm flex items-center gap-1">
                <Wrench className="h-4 w-4" /> {request.serviceName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <RequestStatusBadge
                status={
                  request.status === "New"
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
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {request.requestedAt.toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Workshop:</span>
              <span className="text-sm flex items-center gap-1">
                <Building className="h-4 w-4" />
                {request.workshopName || "Not assigned"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Priority:</span>
              <RequestUrgencyBadge
                urgency={
                  request.priority === "medium"
                    ? "normal"
                    : request.priority === "high"
                    ? "high"
                    : "low"
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
