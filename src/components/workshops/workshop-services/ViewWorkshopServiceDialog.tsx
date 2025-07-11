import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconEye,
  IconBuilding,
  IconSettings,
  IconCalendar,
  IconMapPin,
  IconEdit,
  IconPercentage,
} from "@tabler/icons-react";
import { WorkshopService } from "@/types/workshopServiceTypes";

interface ViewWorkshopServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: WorkshopService | null;
  onEdit?: () => void;
}

export const ViewWorkshopServiceDialog: React.FC<
  ViewWorkshopServiceDialogProps
> = ({ isOpen, onClose, service, onEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPercentage = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined || isNaN(percentage)) {
      return "0%";
    }
    return `${percentage}%`;
  };

  if (!service) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEye className="h-5 w-5" />
            Workshop Service Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this workshop service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Percentage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Platform Fee:</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatPercentage(service.percentage)}
            </div>
          </div>

          <Separator />

          {/* Workshop Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconBuilding className="h-5 w-5" />
                Workshop Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Workshop Name
                  </span>
                  <p className="font-medium">
                    {service.workshop?.name || "Unknown Workshop"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Workshop ID
                  </span>
                  <p className="font-mono text-sm">{service.workshop_id}</p>
                </div>
              </div>

              {service.workshop?.address && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <IconMapPin className="h-4 w-4" />
                    Address
                  </span>
                  <p className="text-sm">{service.workshop.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Type Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconSettings className="h-5 w-5" />
                Service Type Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Service Name
                  </span>
                  <p className="font-medium">
                    {service.service_type?.name || "Unknown Service"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Service Type ID
                  </span>
                  <p className="font-mono text-sm">{service.service_type_id}</p>
                </div>
              </div>

              {service.service_type?.description && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Description
                  </span>
                  <p className="text-sm">{service.service_type.description}</p>
                </div>
              )}

              {service.service_type?.service_category && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Category
                  </span>
                  <Badge variant="outline">
                    {service.service_type.service_category}
                  </Badge>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <IconPercentage className="h-4 w-4" />
                  Platform Fee Percentage
                </span>
                <p className="text-xl font-bold text-primary">
                  {formatPercentage(service.percentage)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Created
                  </span>
                  <p className="text-sm">{formatDate(service.created_at)}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </span>
                  <p className="text-sm">{formatDate(service.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Service ID
                </span>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  {service.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button type="button" onClick={onEdit}>
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Service
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
