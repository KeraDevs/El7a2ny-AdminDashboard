import React from "react";
import {
  ServiceType,
  getServiceCategoryDisplayName,
} from "@/types/serviceTypes";
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
import { Edit, Calendar, Wrench, FileText, Globe } from "lucide-react";
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
          {/* Service name */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-500" />
              {serviceType.name}
            </h3>
            {serviceType.name_ar && (
              <p className="text-sm text-muted-foreground" dir="rtl">
                {serviceType.name_ar}
              </p>
            )}
          </div>

          <Separator />

          {/* Service details section */}
          <div className="space-y-4">
            {/* English Description */}
            {serviceType.description && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {serviceType.description}
                  </p>
                </div>
              </div>
            )}

            {/* Arabic Description */}
            {serviceType.description_ar && (
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-emerald-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Arabic Description</h4>
                  <p className="text-sm text-muted-foreground" dir="rtl">
                    {serviceType.description_ar}
                  </p>
                </div>
              </div>
            )}

            {/* Category */}
            <div className="flex items-start gap-2">
              <Wrench className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <Badge variant="outline" className="mt-1">
                  {getServiceCategoryDisplayName(serviceType.service_category)}
                </Badge>
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
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p className="text-sm">
                  {new Date(serviceType.updated_at).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
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
