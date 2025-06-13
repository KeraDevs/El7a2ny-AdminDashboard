import React from "react";
import { ServiceType } from "@/types/serviceTypes";
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
import { Edit, Calendar, Wrench, Tag, Info, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Updated interface to match the actual data structure
interface ViewServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceType: ServiceType | null;
  onEdit: () => void;
}

const ViewServiceTypeDialog: React.FC<ViewServiceTypeDialogProps> = ({
  isOpen,
  setIsOpen,
  serviceType,
  onEdit,
}) => {
  if (!serviceType) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Service Type Details</DialogTitle>
          <DialogDescription>
            View detailed information about this service type
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service name and status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{serviceType.name}</h3>
            <Badge
              variant={serviceType.isActive ? "default" : "secondary"}
              className={
                serviceType.isActive
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }
            >
              {serviceType.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          {/* Service details section */}
          <div className="space-y-4">
            {/* Description */}
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {serviceType.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Percentage</h4>
                <p className="text-sm font-semibold">
                  {serviceType.service_types_percentage?.percentage || "0"}%
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p className="text-sm">
                  {new Date(serviceType.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-2">
              <Wrench className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <p className="text-sm capitalize">
                  {serviceType.service_category}
                </p>
              </div>
            </div>

            {/* Languages */}
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Languages</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {serviceType.name_ar && (
                    <Badge variant="outline" className="text-xs">
                      Arabic Name: {serviceType.name_ar}
                    </Badge>
                  )}
                  {serviceType.description_ar && (
                    <Badge variant="outline" className="text-xs">
                      Arabic Description Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Created</h4>
                <p className="text-sm">
                  {new Date(serviceType.created_at).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewServiceTypeDialog;
