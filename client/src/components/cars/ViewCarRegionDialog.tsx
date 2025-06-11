import React, { useState } from "react";
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
  Calendar,
  Car,
  ChevronDown,
  ChevronRight,
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
  const [showBrands, setShowBrands] = useState(false);

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
    type?: "text" | "date";
  }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-1">
          {type === "date" && value ? (
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Car Region Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this car region.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
          {/* Header with Name only */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 border rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{region.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Car Region Information
              </p>
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
          {/* Associated Brands Section */}
          {region.brand_regions && region.brand_regions.length > 0 && (
            <div className="border-t pt-4">
              <button
                onClick={() => setShowBrands(!showBrands)}
                className="flex items-center gap-2 mb-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                {showBrands ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Car className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-muted-foreground">
                  Associated Brands ({region.brand_regions.length})
                </h4>
                <Eye className="h-4 w-4 text-muted-foreground ml-auto" />
              </button>

              {showBrands && (
                <div className="space-y-2 mt-3">
                  {region.brand_regions.map((brandRegion) => (
                    <div
                      key={brandRegion.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {brandRegion.brand.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added
                            {format(
                              new Date(brandRegion.created_at),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* No brands associated message */}
          {(!region.brand_regions || region.brand_regions.length === 0) && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-muted-foreground">
                  Associated Brands
                </h4>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No brands associated with this region</p>
                <p className="text-xs mt-1">
                  Brands can be associated with this region through the brands
                  management page
                </p>
              </div>
            </div>
          )}
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
