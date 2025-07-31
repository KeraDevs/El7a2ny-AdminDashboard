import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarWithDetails } from "@/types/carTypes";
import { LuCar, LuCalendar, LuUser } from "react-icons/lu";

export interface ViewCarDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  car: CarWithDetails | null;
  onEdit?: () => void;
}

export const ViewCarDialog: React.FC<ViewCarDialogProps> = ({
  isOpen,
  setIsOpen,
  car,
  onEdit,
}) => {
  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <LuCar className="h-5 w-5 text-blue-600" />
            Car Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Owner Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LuUser className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-lg">Owner Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {car.owner?.first_name} {car.owner?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{car.owner?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{car.owner?.phone}</p>
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LuCar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-lg">Car Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Brand</p>
                <Badge
                  variant="outline"
                  className="mt-1 bg-blue-50 text-blue-700 border-blue-200"
                >
                  {car.brand?.name}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{car.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{car.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">License Plate</p>
                <Badge variant="secondary" className="mt-1 font-mono text-xs">
                  {car.license_plate}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VIN Number</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {car.vin_number}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Features</h3>
            <div className="flex gap-2">
              <Badge
                variant={car.turbo ? "default" : "secondary"}
                className={car.turbo ? "bg-green-100 text-green-800" : ""}
              >
                {car.turbo ? "Turbocharged" : "Naturally Aspirated"}
              </Badge>
              <Badge
                variant={car.exotic ? "default" : "secondary"}
                className={car.exotic ? "bg-purple-100 text-purple-800" : ""}
              >
                {car.exotic ? "Exotic" : "Standard"}
              </Badge>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LuCalendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-lg">Timestamps</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(car.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="font-medium">
                  {new Date(car.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
