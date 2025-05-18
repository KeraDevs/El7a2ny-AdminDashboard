import React, { useState, useEffect } from "react";
import { ServiceType } from "@/types/serviceTypes";
import { toast } from "react-hot-toast";
import {
  Loader2,
  ClipboardCheck,
  Wrench,
  Clock,
  Timer,
  PoundSterling,
  TagIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { EditServiceTypeDialogProps } from "@/types/serviceTypes";

export const EditServiceTypeDialog: React.FC<EditServiceTypeDialogProps> = ({
  isOpen,
  setIsOpen,
  serviceTypeData,
  setServiceTypeData,
  onSave,
  loading = false,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("basic");
      setErrors({});
    }
  }, [isOpen]);

  // Handle changes to service type form data
  const handleInputChange = (field: keyof ServiceType, value: any) => {
    setServiceTypeData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // List of common vehicle types for checkbox selection
  const vehicleTypes = [
    { id: "sedan", label: "Sedan" },
    { id: "suv", label: "SUV" },
    { id: "truck", label: "Truck" },
    { id: "van", label: "Van" },
    { id: "coupe", label: "Coupe" },
    { id: "hatchback", label: "Hatchback" },
    { id: "wagon", label: "Wagon" },
    { id: "convertible", label: "Convertible" },
    { id: "motorcycle", label: "Motorcycle" },
  ];

  // Handle vehicle type checkbox changes
  const handleVehicleTypeChange = (vehicleType: string, checked: boolean) => {
    const currentTypes = serviceTypeData.compatibleVehicleTypes || [];

    setServiceTypeData((prev) => ({
      ...prev,
      compatibleVehicleTypes: checked
        ? [...currentTypes, vehicleType]
        : currentTypes.filter((type) => type !== vehicleType),
    }));
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Validate required fields
    if (!serviceTypeData.name) {
      newErrors.name = "Service type name is required";
      isValid = false;
    }

    if (
      serviceTypeData.basePrice === undefined ||
      serviceTypeData.basePrice < 0
    ) {
      newErrors.basePrice =
        "Base price is required and must be a positive number";
      isValid = false;
    }

    if (!serviceTypeData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (
      serviceTypeData.estimatedDuration === undefined ||
      serviceTypeData.estimatedDuration <= 0
    ) {
      newErrors.estimatedDuration =
        "Estimated duration is required and must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // If errors exist, switch to the tab with errors
      if (
        errors.name ||
        errors.basePrice ||
        errors.category ||
        errors.estimatedDuration
      ) {
        setActiveTab("basic");
      }
      return;
    }

    try {
      await onSave();

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to update service type: ${error.message}`);
      } else {
        toast.error("Failed to update service type");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Service Type</DialogTitle>
          <DialogDescription>
            Update service type information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Type Name *</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
                <Wrench className="h-4 w-4 text-blue-500" />
                <Input
                  id="name"
                  placeholder="Service type name"
                  value={serviceTypeData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="flex items-start gap-2 border rounded-md px-3 py-2 bg-gray-50/50">
                <ClipboardCheck className="h-4 w-4 text-gray-500 mt-2" />
                <Textarea
                  id="description"
                  placeholder="Describe the service type..."
                  value={serviceTypeData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="border-none bg-transparent focus-visible:ring-0 p-0 min-h-[100px]"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (EGP) *</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-green-50/50">
                  <PoundSterling className="h-4 w-4 text-green-500" />
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={serviceTypeData.basePrice || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "basePrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="border-none bg-transparent focus-visible:ring-0 p-0"
                    required
                    disabled={loading}
                  />
                </div>
                {errors.basePrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.basePrice}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={serviceTypeData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="category" className="bg-purple-50/50">
                    <TagIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">
                Estimated Duration (minutes) *
              </Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-amber-50/50">
                <Clock className="h-4 w-4 text-amber-500" />
                <Input
                  id="estimatedDuration"
                  type="number"
                  min="1"
                  placeholder="60"
                  value={serviceTypeData.estimatedDuration || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "estimatedDuration",
                      parseInt(e.target.value) || 60
                    )
                  }
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                  disabled={loading}
                />
              </div>
              {errors.estimatedDuration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.estimatedDuration}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={serviceTypeData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", !!checked)
                }
                disabled={loading}
              />
              <Label htmlFor="isActive">
                Active service type (available for selection)
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="percentageModifier">
                Price Modifier Percentage (%)
              </Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
                <Timer className="h-4 w-4 text-blue-500" />
                <Input
                  id="percentageModifier"
                  type="number"
                  min="-100"
                  max="100"
                  placeholder="0"
                  value={serviceTypeData.percentageModifier || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "percentageModifier",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Apply a percentage modifier to the base price. Positive values
                increase the price, negative values decrease it.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresSpecialist"
                checked={serviceTypeData.requiresSpecialist}
                onCheckedChange={(checked) =>
                  handleInputChange("requiresSpecialist", !!checked)
                }
                disabled={loading}
              />
              <Label htmlFor="requiresSpecialist">
                Requires specialist technician
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Compatible Vehicle Types</Label>
              <div className="border rounded-md p-3 grid grid-cols-3 gap-2">
                {vehicleTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vt-${type.id}`}
                      checked={(
                        serviceTypeData.compatibleVehicleTypes || []
                      ).includes(type.id)}
                      onCheckedChange={(checked) =>
                        handleVehicleTypeChange(type.id, !!checked)
                      }
                      disabled={loading}
                    />
                    <Label htmlFor={`vt-${type.id}`}>{type.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceTypeDialog;
