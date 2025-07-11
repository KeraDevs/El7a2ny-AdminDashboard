import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CarWithDetails } from "@/types/carTypes";
import { Loader2 } from "lucide-react";

export interface EditCarDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  carData: CarWithDetails | null;
  setCarData: React.Dispatch<React.SetStateAction<CarWithDetails | null>>;
  onSave: () => Promise<void>;
}

export const EditCarDialog: React.FC<EditCarDialogProps> = ({
  isOpen,
  setIsOpen,
  carData,
  setCarData,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateCarData = (field: keyof CarWithDetails, value: any) => {
    if (carData) {
      setCarData({ ...carData, [field]: value });
    }
  };

  if (!carData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Car</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={carData.model}
                onChange={(e) => updateCarData("model", e.target.value)}
                placeholder="Enter car model"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={carData.year}
                onChange={(e) =>
                  updateCarData("year", parseInt(e.target.value))
                }
                placeholder="Enter car year"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license_plate">License Plate</Label>
              <Input
                id="license_plate"
                value={carData.license_plate}
                onChange={(e) => updateCarData("license_plate", e.target.value)}
                placeholder="Enter license plate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin_number">VIN Number</Label>
              <Input
                id="vin_number"
                value={carData.vin_number}
                onChange={(e) => updateCarData("vin_number", e.target.value)}
                placeholder="Enter VIN number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <div className="p-2 border rounded">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {carData.brand?.name || "Unknown Brand"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Owner</Label>
              <div className="p-2 border rounded">
                <div className="text-sm">
                  <div className="font-medium">
                    {carData.owner?.first_name} {carData.owner?.last_name}
                  </div>
                  <div className="text-muted-foreground">
                    {carData.owner?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="turbo"
                checked={carData.turbo}
                onCheckedChange={(checked: boolean) =>
                  updateCarData("turbo", checked)
                }
              />
              <Label htmlFor="turbo">Turbocharged</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exotic"
                checked={carData.exotic}
                onCheckedChange={(checked: boolean) =>
                  updateCarData("exotic", checked)
                }
              />
              <Label htmlFor="exotic">Exotic</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
