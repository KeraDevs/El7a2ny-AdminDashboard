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
import { Edit, Calendar, Wrench, Tag, Info, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define the ServiceType interface
interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
    }).format(price);
  };

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours} hr${hours > 1 ? "s" : ""} ${
        mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : ""
      }`;
    }
    return `${mins} min${mins > 1 ? "s" : ""}`;
  };

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
                  {serviceType.description}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Price</h4>
                <p className="text-sm font-semibold">
                  {formatPrice(serviceType.price)}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Duration</h4>
                <p className="text-sm">
                  {formatDuration(serviceType.duration)}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-2">
              <Wrench className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <p className="text-sm">{serviceType.category}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Tags</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {serviceType.tags && serviceType.tags.length > 0 ? (
                    serviceType.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No tags
                    </span>
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
                  {new Date(serviceType.createdAt).toLocaleDateString(
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
