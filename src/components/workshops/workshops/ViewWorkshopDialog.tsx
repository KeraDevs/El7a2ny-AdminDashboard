import React from "react";
import Image from "next/image";
import { Workshop } from "@/types/workshopTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface ViewWorkshopDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workshopData: Workshop | null;
  onEdit: () => void;
}

export const ViewWorkshopDialog: React.FC<ViewWorkshopDialogProps> = ({
  isOpen,
  setIsOpen,
  workshopData,
  onEdit,
}) => {
  if (!workshopData) return null;

  // Get primary phone number
  const getPrimaryPhone = () => {
    if (!workshopData.phoneNumbers || workshopData.phoneNumbers.length === 0)
      return "Not available";

    const primary = workshopData.phoneNumbers.find((p) => p.is_primary);
    return primary
      ? primary.phone_number
      : workshopData.phoneNumbers[0].phone_number;
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Open
          </Badge>
        );
      case "busy":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-300"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> Busy
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            <XCircle className="mr-1 h-3 w-3" /> Closed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-300"
          >
            {status}
          </Badge>
        );
    }
  };

  // Get active status badge styling
  const getActiveStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-300"
          >
            Pending
          </Badge>
        );
      case "deactivated":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Deactivated
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-300"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Workshop Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected workshop.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center pb-4">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              {workshopData.profilePic ? (
                <Image
                  src={workshopData.profilePic}
                  alt={workshopData.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-blue-600" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Workshop Name
              </h4>
              <p className="text-lg font-semibold">{workshopData.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Phone
                </h4>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-green-600" />
                  <a
                    href={`tel:${getPrimaryPhone()}`}
                    className="text-blue-600 hover:underline"
                  >
                    {getPrimaryPhone()}
                  </a>
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Address
                </h4>
                <p className="text-sm flex items-start gap-1">
                  <MapPin className="h-3.5 w-3.5 text-red-600 mt-0.5" />
                  <span>{workshopData.address}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Operating Status
                </h4>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(workshopData.status)}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Active Status
                </h4>
                <div className="flex flex-col gap-2">
                  {getActiveStatusBadge(workshopData.active_status)}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">
              Created Date
            </h4>
            <p className="text-sm flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gray-600" />
              {new Date(workshopData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {workshopData.services && workshopData.services.length > 0 ? (
                workshopData.services.map((service, index) => (
                  <Badge key={index} variant="secondary">
                    {service}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No services listed
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Labels
            </h4>
            <div className="flex flex-wrap gap-2">
              {workshopData.labels && workshopData.labels.length > 0 ? (
                workshopData.labels.map((label, index) => (
                  <Badge key={index} variant="outline">
                    {label}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No labels</span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit Workshop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
