import React from "react";
import { format } from "date-fns";
import { CarBrand } from "@/types/carTypes";
import { Button } from "@/components/ui/button";
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
  Car,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface ViewCarBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  brand: CarBrand | null;
}

export const ViewCarBrandDialog: React.FC<ViewCarBrandDialogProps> = ({
  isOpen,
  onClose,
  brand,
}) => {
  if (!brand) return null;
  const InfoRow = ({
    icon: Icon,
    label,
    value,
    type = "text",
  }: {
    icon: React.ElementType;
    label: string;
    value: string | boolean | null | undefined;
    type?: "text" | "url" | "date";
  }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-1">
          {type === "url" && value ? (
            <div className="flex items-center gap-2">
              <span className="text-sm break-all">{value as string}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(value as string, "_blank")}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
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
            Car Brand Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this car brand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header with Logo and Name */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex-shrink-0">
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={`${brand.name} logo`}
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain rounded-lg border bg-white"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-16 w-16 bg-white border rounded-lg flex items-center justify-center">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{brand.name}</h3>
            </div>
          </div>
          {/* Details */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <InfoRow icon={Car} label="Brand Name" value={brand.name} />
              {brand.description && (
                <InfoRow
                  icon={Car}
                  label="Description"
                  value={brand.description}
                />
              )}
              {brand.logo_url && (
                <InfoRow
                  icon={ImageIcon}
                  label="Logo URL"
                  value={brand.logo_url}
                  type="url"
                />
              )}
            </div>

            {/* Regions Section */}
            {brand.brand_regions && brand.brand_regions.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Available Regions ({brand.brand_regions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {brand.brand_regions.map((brandRegion) => (
                    <span
                      key={brandRegion.id}
                      className="inline-flex items-center px-2 py-1 rounded-md border text-xs bg-background"
                    >
                      {brandRegion.region.name}
                      {brandRegion.region.country && (
                        <span className="ml-1 text-muted-foreground">
                          • {brandRegion.region.country}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
                value={brand.created_at}
                type="date"
              />

              {brand.updated_at && (
                <InfoRow
                  icon={Calendar}
                  label="Last Updated"
                  value={brand.updated_at}
                  type="date"
                />
              )}

              <InfoRow icon={Car} label="Brand ID" value={brand.id} />
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
