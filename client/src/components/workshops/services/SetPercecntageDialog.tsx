import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceType } from "@/types/serviceTypes";
import { toast } from "react-hot-toast";

interface SetPercentageDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceType: ServiceType | null;
  onSave: (id: string, percentage: number) => Promise<void>;
}

const SetPercentageDialog: React.FC<SetPercentageDialogProps> = ({
  isOpen,
  setIsOpen,
  serviceType,
  onSave,
}) => {
  const [percentage, setPercentage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the percentage input when the dialog opens with a new service type
  React.useEffect(() => {
    if (serviceType && isOpen) {
      setPercentage(serviceType.percentage?.toString() || "");
    }
  }, [serviceType, isOpen]);

  if (!serviceType) return null;

  const handleSave = async () => {
    // Validate percentage
    const percentageValue = Number(percentage);
    if (isNaN(percentageValue)) {
      toast.error("Please enter a valid number");
      return;
    }

    if (percentageValue < 0 || percentageValue > 100) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(serviceType.id, percentageValue);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to update percentage: ${error.message}`
          : "Failed to update percentage"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isSubmitting && setIsOpen(open)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Set Workshop Percentage
          </DialogTitle>
          <DialogDescription>
            Set the percentage that the workshop receives from this service.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">{serviceType.name}</h3>
              <div className="text-sm text-muted-foreground">
                Price:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EGP",
                }).format(serviceType.price)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage (%)</Label>
            <div className="relative">
              <Input
                id="percentage"
                value={percentage}
                onChange={(e) => {
                  // Only allow numbers and decimals
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setPercentage(value);
                  }
                }}
                placeholder="Enter percentage (0-100)"
                className="pr-8"
                type="text"
                inputMode="decimal"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            {percentage && !isNaN(Number(percentage)) && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Workshop will receive:
                </p>
                <p className="text-base font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                  }).format((serviceType.price * Number(percentage)) / 100)}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetPercentageDialog;
