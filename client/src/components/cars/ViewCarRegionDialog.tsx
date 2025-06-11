import React from "react";
import { format } from "date-fns";
import { CarRegion } from "@/types/carTypes";
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
  Eye,
  MapPin,
  Globe,
  Calendar,
  Flag,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ViewCarRegionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  region: CarRegion | null;
}

export const ViewCarRegionDialog: React.FC<ViewCarRegionDialogProps> = ({
  isOpen,
  onClose,
  region,
}) => {
  if (!region) return null;

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    type = "text",
  }: {
    icon: React.ElementType;
    label: string;
    value: string | boolean | null | undefined;
    type?: "text" | "status" | "date";
  }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-1">
          {type === "status" ? (
            <Badge variant={value ? "default" : "secondary"}>
              {value ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Inactive
                </div>
              )}
            </Badge>
          ) : type === "date" && value ? (
            <span className="text-sm">
              {format(new Date(value as string), "PPP 'at' p")}
            </span>
          ) : (
            <span className="text-sm">{value || "Not specified"}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Car Region Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this car region.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header with Name and Status */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 border rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{region.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={region.is_active ? "default" : "secondary"}>
                  {region.is_active ? "Active" : "Inactive"}
                </Badge>
                {region.continent && (
                  <Badge variant="outline">{region.continent}</Badge>
                )}
                {region.country && (
                  <Badge variant="secondary">{region.country}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <InfoRow icon={MapPin} label="Region Name" value={region.name} />

              {region.description && (
                <InfoRow
                  icon={MapPin}
                  label="Description"
                  value={region.description}
                />
              )}

              <InfoRow
                icon={Flag}
                label="Primary Country"
                value={region.country}
              />

              <InfoRow
                icon={Globe}
                label="Continent"
                value={region.continent}
              />

              <InfoRow
                icon={CheckCircle}
                label="Status"
                value={region.is_active}
                type="status"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Metadata
            </h4>
            <div className="grid gap-3">
              <InfoRow
                icon={Calendar}
                label="Created At"
                value={region.created_at}
                type="date"
              />

              {region.updated_at && (
                <InfoRow
                  icon={Calendar}
                  label="Last Updated"
                  value={region.updated_at}
                  type="date"
                />
              )}

              <InfoRow icon={MapPin} label="Region ID" value={region.id} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
