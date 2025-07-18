import React, { useEffect, useState } from "react";
import { Workshop } from "@/types/workshopTypes";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Building2,
  MapPin,
  Plus,
  Star,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

interface EditWorkshopDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workshopData: Partial<Workshop>;
  setWorkshopData: React.Dispatch<React.SetStateAction<Partial<Workshop>>>;
  onSave: () => Promise<void>;
  loading?: boolean;
}

export const EditWorkshopDialog: React.FC<EditWorkshopDialogProps> = ({
  isOpen,
  setIsOpen,
  workshopData,
  setWorkshopData,
  onSave,
  loading = false,
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
  // Handle changes to workshop form data
  const handleInputChange = (
    field: keyof Workshop,
    value: string | number | boolean | null
  ) => {
    setWorkshopData((prev) => ({
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

  // Handle phone number input change
  const handlePhoneChange = (index: number, value: string) => {
    setWorkshopData((prev) => {
      const updatedPhones = [...(prev.phoneNumbers || [])];
      updatedPhones[index] = {
        ...updatedPhones[index],
        phone_number: value,
      };
      return {
        ...prev,
        phoneNumbers: updatedPhones,
      };
    });

    // Clear phone error
    if (errors.phoneNumbers) {
      setErrors((prev) => ({
        ...prev,
        phoneNumbers: "",
      }));
    }
  };

  // Add a new phone number field
  const addPhoneNumber = () => {
    setWorkshopData((prev) => ({
      ...prev,
      phoneNumbers: [
        ...(prev.phoneNumbers || []),
        {
          phone_number: "",
          type: "MOBILE",
          is_primary: prev.phoneNumbers?.length === 0, // First one is primary
          is_verified: false,
        },
      ],
    }));
  };

  // Remove a phone number field
  const removePhoneNumber = (index: number) => {
    if (workshopData.phoneNumbers?.length === 1) {
      toast.error("At least one phone number is required");
      return;
    }

    setWorkshopData((prev) => {
      const updatedPhones = [...(prev.phoneNumbers || [])];
      const isRemovingPrimary = updatedPhones[index].is_primary;
      updatedPhones.splice(index, 1);

      // If removing the primary phone, set the first as primary
      if (isRemovingPrimary && updatedPhones.length > 0) {
        updatedPhones[0].is_primary = true;
      }

      return {
        ...prev,
        phoneNumbers: updatedPhones,
      };
    });
  };

  // Set a phone number as primary
  const setPrimaryPhone = (index: number) => {
    setWorkshopData((prev) => {
      const updatedPhones = [...(prev.phoneNumbers || [])].map((phone, i) => ({
        ...phone,
        is_primary: i === index,
      }));
      return {
        ...prev,
        phoneNumbers: updatedPhones,
      };
    });
  };

  // Validate phone number format
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10,15}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Validate required fields
    if (!workshopData.name) {
      newErrors.name = "Workshop name is required";
      isValid = false;
    }

    if (!workshopData.address) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    // Validate phone numbers
    const phoneNumbers = workshopData.phoneNumbers || [];
    if (phoneNumbers.length === 0) {
      newErrors.phoneNumbers = "At least one phone number is required";
      isValid = false;
    } else {
      const invalidPhones = phoneNumbers.filter(
        (phone) => !phone.phone_number || !validatePhone(phone.phone_number)
      );
      if (invalidPhones.length > 0) {
        newErrors.phoneNumbers = "Please enter valid phone numbers";
        isValid = false;
      }

      // Check if at least one phone is primary
      const hasPrimary = phoneNumbers.some((phone) => phone.is_primary);
      if (!hasPrimary) {
        newErrors.phoneNumbers =
          "At least one phone number must be set as primary";
        isValid = false;
      }
    }

    // Validate latitude and longitude - both are required
    if (
      workshopData.latitude === null ||
      workshopData.latitude === undefined ||
      workshopData.latitude === 0
    ) {
      newErrors.latitude = "Latitude is required";
      isValid = false;
    } else {
      const lat = Number(workshopData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude =
          "Latitude must be a valid number between -90 and 90";
        isValid = false;
      }
    }

    if (
      workshopData.longitude === null ||
      workshopData.longitude === undefined ||
      workshopData.longitude === 0
    ) {
      newErrors.longitude = "Longitude is required";
      isValid = false;
    } else {
      const lng = Number(workshopData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude =
          "Longitude must be a valid number between -180 and 180";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Switch to basic tab if there are errors there
      if (errors.name || errors.address || errors.phoneNumbers) {
        setActiveTab("basic");
      }
      // Switch to additional tab if there are coordinate errors
      else if (errors.latitude || errors.longitude) {
        setActiveTab("additional");
      }
      return;
    }

    try {
      await onSave();
      toast.success("Workshop updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to update workshop: ${error.message}`);
      } else {
        toast.error("Failed to update workshop");
      }
    }
  };

  // Get the status badge color
  const getStatusBadgeColor = (status: string | undefined) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-300";
      case "busy":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "closed":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Workshop</DialogTitle>
          <DialogDescription>
            Update workshop information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workshop Name *</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
                <Building2 className="h-4 w-4 text-blue-500" />
                <Input
                  id="name"
                  placeholder="Workshop name"
                  value={workshopData.name || ""}
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
              <Label htmlFor="address">Address *</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-emerald-50/50">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <Input
                  id="address"
                  placeholder="Workshop address"
                  value={workshopData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                  disabled={loading}
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Phone Numbers *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhoneNumber}
                  className="h-7"
                  disabled={loading}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Phone
                </Button>
              </div>

              {workshopData.phoneNumbers?.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-amber-50/50 flex-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <Input
                      placeholder="Phone number"
                      value={phone.phone_number || ""}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className="border-none bg-transparent focus-visible:ring-0 p-0 flex-1"
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={phone.is_primary ? "bg-green-100" : ""}
                    onClick={() => setPrimaryPhone(index)}
                    disabled={loading || phone.is_primary}
                    title={
                      phone.is_primary ? "Primary Phone" : "Set as Primary"
                    }
                  >
                    {phone.is_primary ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePhoneNumber(index)}
                    disabled={
                      loading || workshopData.phoneNumbers?.length === 1
                    }
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {errors.phoneNumbers && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumbers}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Operating Status</Label>
              <Select
                value={workshopData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                disabled={loading}
              >
                <SelectTrigger
                  id="status"
                  className={getStatusBadgeColor(workshopData.status)}
                >
                  <SelectValue placeholder="Select operating status">
                    <div className="flex items-center gap-2 capitalize">
                      {workshopData.status || "Select operating status"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      Open
                    </Badge>
                  </SelectItem>
                  <SelectItem value="busy">
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 border-amber-300"
                    >
                      Busy
                    </Badge>
                  </SelectItem>
                  <SelectItem value="closed">
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 border-red-300"
                    >
                      Closed
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  placeholder="Latitude (e.g. 30.0444)"
                  value={workshopData.latitude || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and a single decimal point
                    if (/^-?\d*\.?\d*$/.test(value)) {
                      handleInputChange(
                        "latitude",
                        value === "" ? null : Number(value)
                      );
                    }
                    // Clear latitude/longitude errors when user types
                    if (errors.latitude) {
                      setErrors((prev) => ({
                        ...prev,
                        latitude: "",
                      }));
                    }
                  }}
                  disabled={loading}
                  required
                />
                {errors.latitude && (
                  <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  placeholder="Longitude (e.g. 31.2357)"
                  value={workshopData.longitude || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and a single decimal point
                    if (/^-?\d*\.?\d*$/.test(value)) {
                      handleInputChange(
                        "longitude",
                        value === "" ? null : Number(value)
                      );
                    }
                    // Clear latitude/longitude errors when user types
                    if (errors.longitude) {
                      setErrors((prev) => ({
                        ...prev,
                        longitude: "",
                      }));
                    }
                  }}
                  disabled={loading}
                  required
                />
                {errors.longitude && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.longitude}
                  </p>
                )}
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
