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
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <IconEye className="h-6 w-6 text-primary" />
            Workshop Service Details
          </DialogTitle>
          <DialogDescription className="text-base">
            View complete information about this workshop service configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Percentage - Enhanced Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                <IconPercentage className="h-4 w-4" />
                Platform Fee Percentage
              </div>
              <div className="text-4xl font-bold text-primary">
                {formatPercentage(service.percentage)}
              </div>
              <p className="text-xs text-muted-foreground">
                Commission charged on this service
              </p>
            </div>
          </div>

          <Separator />

          {/* Workshop Information */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <IconBuilding className="h-5 w-5 text-blue-500" />
                Workshop Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Workshop Name
                  </span>
                  <p className="font-medium text-lg">
                    {service.workshop?.name || "Unknown Workshop"}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Workshop ID
                  </span>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                    {service.workshop_id}
                  </p>
                </div>

                {service.workshop?.address && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <IconMapPin className="h-4 w-4" />
                      Address
                    </span>
                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md border-l-2 border-l-blue-200">
                      {service.workshop.address}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Type Information */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <IconSettings className="h-5 w-5 text-green-500" />
                Service Type Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Service Name
                  </span>
                  <p className="font-medium text-lg">
                    {service.service_type?.name || "Unknown Service"}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Service Type ID
                  </span>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                    {service.service_type_id}
                  </p>
                </div>

                {service.service_type?.description && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Description
                    </span>
                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md border-l-2 border-l-green-200">
                      {service.service_type.description}
                    </p>
                  </div>
                )}

                {service.service_type?.service_category && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Category
                    </span>
                    <div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
                      >
                        {service.service_type.service_category}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <IconCalendar className="h-5 w-5 text-purple-500" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Created
                  </span>
                  <p className="text-sm bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md border-l-2 border-l-purple-200">
                    {formatDate(service.created_at)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </span>
                  <p className="text-sm bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md border-l-2 border-l-purple-200">
                    {formatDate(service.updated_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <IconSettings className="h-5 w-5 text-orange-500" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Service ID
                </span>
                <div className="bg-muted p-4 rounded-md border">
                  <p className="font-mono text-sm break-all select-all">
                    {service.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            Close
          </Button>
          {onEdit && (
            <Button
              type="button"
              onClick={onEdit}
              className="flex-1 sm:flex-none"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Service
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
