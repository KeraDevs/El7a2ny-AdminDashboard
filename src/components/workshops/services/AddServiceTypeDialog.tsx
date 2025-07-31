import React, { useState, useEffect } from "react";
import { CreateServiceTypeData } from "@/types/serviceTypes";
import { useAuth } from "@/contexts/AuthContext";
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

interface AddServiceTypeDialogProps {
  onAddServiceType: (serviceTypeData: CreateServiceTypeData) => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => Promise<void>;
}

// Define form data interface for API compatibility
interface ServiceTypeFormData {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  service_category: string;
}

export const AddServiceTypeDialog: React.FC<AddServiceTypeDialogProps> = ({
  onAddServiceType,
  isOpen,
  setIsOpen,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { currentUser } = useAuth();

  // Use the proper form data interface
  const [formData, setFormData] = useState<ServiceTypeFormData>({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    service_category: "",
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        name_ar: "",
        description: "",
        description_ar: "",
        service_category: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle changes to form inputs with proper typing
  const handleInputChange = (
    field: keyof ServiceTypeFormData,
    value: string
  ) => {
    setFormData((prev) => ({
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

  // Check if all required fields are filled
  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      formData.name_ar.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.description_ar.trim() !== "" &&
      formData.service_category !== ""
    );
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name (English) is required";
    }

    if (!formData.name_ar?.trim()) {
      newErrors.name_ar = "Service name (Arabic) is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description (English) is required";
    }

    if (!formData.description_ar?.trim()) {
      newErrors.description_ar = "Description (Arabic) is required";
    }

    if (!formData.service_category) {
      newErrors.service_category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API - all fields are now required
      const createData: CreateServiceTypeData = {
        name: formData.name.trim(),
        name_ar: formData.name_ar.trim(),
        description: formData.description.trim(),
        description_ar: formData.description_ar.trim(),
        service_category: formData.service_category,
      };

      await onAddServiceType(createData);

      toast.success("Service type created successfully");
      setIsOpen(false);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Error creating service type:", error);
      if (error instanceof Error) {
        toast.error(`Failed to create service type: ${error.message}`);
      } else {
        toast.error("Failed to create service type");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Service Type</DialogTitle>
          <DialogDescription>
            Create a new service type by filling out all the required fields
            below.
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
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 p-0"
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Arabic Name */}
          <div className="space-y-2">
            <Label htmlFor="name_ar">Service Type Name (Arabic) *</Label>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-emerald-50/50">
              <Globe className="h-4 w-4 text-emerald-500" />
              <Input
                id="name_ar"
                placeholder="اسم نوع الخدمة بالعربية"
                value={formData.name_ar}
                onChange={(e) => handleInputChange("name_ar", e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 p-0"
                dir="rtl"
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.name_ar && (
              <p className="text-red-500 text-xs mt-1">{errors.name_ar}</p>
            )}
          </div>

          {/* English Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (English) *</Label>
            <div className="flex items-start gap-2 border rounded-md px-3 py-2 bg-gray-50/50">
              <FileText className="h-4 w-4 text-gray-500 mt-2" />
              <Textarea
                id="description"
                placeholder="Describe the service type in English..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="border-none bg-transparent focus-visible:ring-0 p-0 min-h-[80px]"
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Arabic Description */}
          <div className="space-y-2">
            <Label htmlFor="description_ar">Description (Arabic) *</Label>
            <div className="flex items-start gap-2 border rounded-md px-3 py-2 bg-emerald-50/50">
              <Globe className="h-4 w-4 text-emerald-500 mt-2" />
              <Textarea
                id="description_ar"
                placeholder="وصف نوع الخدمة بالعربية..."
                value={formData.description_ar}
                onChange={(e) =>
                  handleInputChange("description_ar", e.target.value)
                }
                className="border-none bg-transparent focus-visible:ring-0 p-0 min-h-[80px]"
                dir="rtl"
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.description_ar && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description_ar}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="service_category">Category *</Label>
            <Select
              value={formData.service_category}
              onValueChange={(value) =>
                handleInputChange("service_category", value)
              }
              disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
          >
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

export default AddServiceTypeDialog;
