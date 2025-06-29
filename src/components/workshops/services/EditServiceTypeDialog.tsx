import React, { useState, useEffect } from "react";
import { ServiceType } from "@/types/serviceTypes";
import { toast } from "react-hot-toast";
import { Loader2, FileText, Wrench, Globe } from "lucide-react";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  // Handle changes to service type form data
  const handleInputChange = <K extends keyof ServiceType>(
    field: K,
    value: ServiceType[K]
  ) => {
    console.log(`Updating field ${String(field)} to:`, value);
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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!serviceTypeData?.name?.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!serviceTypeData?.service_category) {
      newErrors.service_category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
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
            Update service type information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* English Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Service Type Name (English) *</Label>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
              <Wrench className="h-4 w-4 text-blue-500" />
              <Input
                id="name"
                placeholder="Service type name in English"
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

          {/* Arabic Name */}
          <div className="space-y-2">
            <Label htmlFor="name_ar">Service Type Name (Arabic)</Label>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-emerald-50/50">
              <Globe className="h-4 w-4 text-emerald-500" />
              <Input
                id="name_ar"
                placeholder="اسم نوع الخدمة بالعربية"
                value={serviceTypeData.name_ar || ""}
                onChange={(e) => handleInputChange("name_ar", e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 p-0"
                dir="rtl"
                disabled={loading}
              />
            </div>
          </div>

          {/* English Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (English)</Label>
            <div className="flex items-start gap-2 border rounded-md px-3 py-2 bg-gray-50/50">
              <FileText className="h-4 w-4 text-gray-500 mt-2" />
              <Textarea
                id="description"
                placeholder="Describe the service type in English..."
                value={serviceTypeData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="border-none bg-transparent focus-visible:ring-0 p-0 min-h-[80px]"
                disabled={loading}
              />
            </div>
          </div>

          {/* Arabic Description */}
          <div className="space-y-2">
            <Label htmlFor="description_ar">Description (Arabic)</Label>
            <div className="flex items-start gap-2 border rounded-md px-3 py-2 bg-emerald-50/50">
              <Globe className="h-4 w-4 text-emerald-500 mt-2" />
              <Textarea
                id="description_ar"
                placeholder="وصف نوع الخدمة بالعربية..."
                value={serviceTypeData.description_ar || ""}
                onChange={(e) =>
                  handleInputChange("description_ar", e.target.value)
                }
                className="border-none bg-transparent focus-visible:ring-0 p-0 min-h-[80px]"
                dir="rtl"
                disabled={loading}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="service_category">Category *</Label>
            <Select
              value={serviceTypeData?.service_category || ""}
              onValueChange={(value) =>
                handleInputChange("service_category", value)
              }
              disabled={loading}
            >
              <SelectTrigger id="service_category" className="bg-purple-50/50">
                <Wrench className="h-4 w-4 text-purple-500 mr-2" />
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Tuning">Tuning</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Check_Car_Services">
                  Check Car Services
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.service_category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.service_category}
              </p>
            )}
          </div>
        </div>

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
