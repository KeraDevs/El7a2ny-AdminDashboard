import React, { useState } from "react";
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
import { Loader2, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface SetPercentageDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceTypeIds: string[];
  ServiceTypes: ServiceType[];
  onSetPercentage: (percentage: number) => Promise<void>;
}

const SetPercentageDialog: React.FC<SetPercentageDialogProps> = ({
  isOpen,
  setIsOpen,
  serviceTypeIds,
  ServiceTypes,
  onSetPercentage,
}) => {
  const [percentage, setPercentage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the service types that are selected
  const selectedServiceTypes = ServiceTypes.filter((st) =>
    serviceTypeIds.includes(st.id)
  );

  // Single service type for displaying additional details
  const isSingleService = serviceTypeIds.length === 1;
  const singleServiceType = isSingleService ? selectedServiceTypes[0] : null;

  // Reset the percentage input when the dialog opens
  React.useEffect(() => {
    if (isOpen) {
      // If we're editing a single service type, set the initial percentage
      if (isSingleService && singleServiceType) {
        setPercentage(singleServiceType.percentageModifier?.toString() || "0");
      } else {
        setPercentage("");
      }
    }
  }, [isOpen, isSingleService, singleServiceType]);

  const handleSave = async () => {
    // Validate percentage
    const percentageValue = Number(percentage);
    if (isNaN(percentageValue)) {
      toast.error("Please enter a valid number");
      return;
    }

    // Allow negative percentage for discounts
    if (percentageValue < -100 || percentageValue > 100) {
      toast.error("Percentage must be between -100 and 100");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSetPercentage(percentageValue);
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
            Set Percentage Modifier
          </DialogTitle>
          <DialogDescription>
            {isSingleService
              ? "Set the percentage modifier for this service type."
              : `Set the percentage modifier for ${serviceTypeIds.length} service types.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {isSingleService && singleServiceType ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">
                  {singleServiceType.name}
                </h3>
                <div className="text-sm text-muted-foreground">
                  Base Price:
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EGP",
                  }).format(singleServiceType.price || 0)}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-base font-medium">
                Bulk updating {serviceTypeIds.length} service types
              </h3>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                <ul className="text-sm">
                  {selectedServiceTypes.map((service) => (
                    <li
                      key={service.id}
                      className="py-1 border-b last:border-b-0"
                    >
                      {service.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage Modifier (%)</Label>
            <div className="relative">
              <Input
                id="percentage"
                value={percentage}
                onChange={(e) => {
                  // Allow negative numbers
                  const value = e.target.value;
                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                    setPercentage(value);
                  }
                }}
                placeholder="Enter percentage (-100 to 100)"
                className="pr-8"
                type="text"
                inputMode="decimal"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>

            {percentage &&
              !isNaN(Number(percentage)) &&
              isSingleService &&
              singleServiceType && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    New percentage:
                  </p>
                  <p className="text-base font-medium">{percentage}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Current percentage:
                    {singleServiceType.service_types_percentage?.percentage ||
                      "0"}
                    %)
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
          <Button
            onClick={handleSave}
            disabled={isSubmitting || percentage === ""}
          >
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
