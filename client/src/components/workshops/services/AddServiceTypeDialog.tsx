import React, { useState, useEffect } from "react";
import { ServiceType } from "@/types/serviceTypes";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import {
  Loader2,
  PlusCircle,
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
  DialogTrigger,
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

interface AddServiceTypeDialogProps {
  onAddServiceType: (serviceTypeData: Partial<ServiceType>) => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => Promise<void>;
}

export const AddServiceTypeDialog: React.FC<AddServiceTypeDialogProps> = ({
  onAddServiceType,
  isOpen,
  setIsOpen,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState<Partial<ServiceType>>({
    name: "",
    description: "",
    basePrice: 0,
    percentageModifier: 0,
    category: "maintenance",
    estimatedDuration: 60,
    isActive: true,
    requiresSpecialist: false,
    compatibleVehicleTypes: [],
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("basic");
      setFormData({
        name: "",
        description: "",
        basePrice: 0,
        percentageModifier: 0,
        category: "maintenance",
        estimatedDuration: 60,
        isActive: true,
        requiresSpecialist: false,
        compatibleVehicleTypes: [],
      });
    }
  }, [isOpen]);

  // Handle changes to form inputs
  const handleInputChange = (field: keyof ServiceType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    if (!formData.name) {
      toast.error("Service type name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddServiceType(formData);

      toast.success("Service type added successfully");
      setIsOpen(false);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Service type creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Service type creation failed"
      );
    } finally {
      setIsSubmitting(false);
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
    const currentTypes = formData.compatibleVehicleTypes || [];

    setFormData((prev) => ({
      ...prev,
      compatibleVehicleTypes: checked
        ? [...currentTypes, vehicleType]
        : currentTypes.filter((type) => type !== vehicleType),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Service Type</DialogTitle>
          <DialogDescription>
            Create a new service type by filling out the required information.
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
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="flex items-start gap-2 border rounded-md px-3 py-2 bg-gray-50/50">
                <ClipboardCheck className="h-4 w-4 text-gray-500 mt-2" />
                <Textarea
                  id="description"
                  placeholder="Describe the service type..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="border-none bg-transparent focus-visible:ring-0 p-0 min-h-[100px]"
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
                    value={formData.basePrice || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "basePrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="border-none bg-transparent focus-visible:ring-0 p-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
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
                  value={formData.estimatedDuration || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "estimatedDuration",
                      parseInt(e.target.value) || 60
                    )
                  }
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", !!checked)
                }
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
                  value={formData.percentageModifier || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "percentageModifier",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
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
                checked={formData.requiresSpecialist}
                onCheckedChange={(checked) =>
                  handleInputChange("requiresSpecialist", !!checked)
                }
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
                      checked={(formData.compatibleVehicleTypes || []).includes(
                        type.id
                      )}
                      onCheckedChange={(checked) =>
                        handleVehicleTypeChange(type.id, !!checked)
                      }
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Service Type"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
