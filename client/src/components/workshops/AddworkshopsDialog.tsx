import React, { useState, useEffect } from "react";
import { Workshop, PhoneNumber } from "@/types/workshopTypes";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import {
  Loader2,
  PlusCircle,
  Mail,
  Phone,
  Building,
  User,
  MapPin,
  Plus,
  Wrench,
  Tag,
  X,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddWorkshopDialogProps {
  onAddWorkshop: (workshopData: Partial<Workshop>) => Promise<void>;
}

export const AddWorkshopDialog: React.FC<AddWorkshopDialogProps> = ({
  onAddWorkshop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [serviceInput, setServiceInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { currentUser } = useAuth();

  // Workshop data
  const [formData, setFormData] = useState<Partial<Workshop>>({
    name: "",
    email: "",
    address: "",
    phoneNumbers: [
      {
        phone_number: "",
        type: "MOBILE",
        is_primary: true,
        is_verified: false,
      },
    ],
    latitude: null,
    longitude: null,
    services: [],
    labels: [],
    status: "open",
    active_status: "pending",
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("basic");
      setErrors({});
      setFormData({
        name: "",
        email: "",
        address: "",
        phoneNumbers: [
          {
            phone_number: "",
            type: "MOBILE",
            is_primary: true,
            is_verified: false,
          },
        ],
        latitude: null,
        longitude: null,
        services: [],
        labels: [],
        status: "open",
        active_status: "pending",
      });
    }
  }, [isOpen]);

  // Handle changes to workshop form data
  const handleInputChange = (field: keyof Workshop, value: any) => {
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

  // Handle phone number input change
  const handlePhoneChange = (index: number, value: string) => {
    setFormData((prev) => {
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
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: [
        ...(prev.phoneNumbers || []),
        {
          phone_number: "",
          type: "MOBILE",
          is_primary: false,
          is_verified: false,
        },
      ],
    }));
  };

  // Remove a phone number field
  const removePhoneNumber = (index: number) => {
    if (formData.phoneNumbers?.length === 1) {
      toast.error("At least one phone number is required");
      return;
    }

    setFormData((prev) => {
      const updatedPhones = [...(prev.phoneNumbers || [])];
      updatedPhones.splice(index, 1);
      return {
        ...prev,
        phoneNumbers: updatedPhones,
      };
    });
  };

  // Set a phone number as primary
  const setPrimaryPhone = (index: number) => {
    setFormData((prev) => {
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

  // Add a service
  const handleAddService = () => {
    if (serviceInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        services: [...(prev.services || []), serviceInput.trim()],
      }));
      setServiceInput("");
    }
  };

  // Handle key press for service input
  const handleServiceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddService();
    }
  };

  // Remove a service
  const handleRemoveService = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services?.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Add a label
  const handleAddLabel = () => {
    if (labelInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        labels: [...(prev.labels || []), labelInput.trim()],
      }));
      setLabelInput("");
    }
  };

  // Handle key press for label input
  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLabel();
    }
  };

  // Remove a label
  const handleRemoveLabel = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels?.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    if (!formData.name) {
      newErrors.name = "Workshop name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    // Validate phone numbers
    const phoneNumbers = formData.phoneNumbers || [];
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
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit the form
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
      const authToken = await currentUser.getIdToken();

      // Call the API to create the workshop
      const response = await fetch(`${API_BASE_URL}/workshops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          phone_numbers: formData.phoneNumbers,
          latitude: formData.latitude,
          longitude: formData.longitude,
          services: formData.services,
          labels: formData.labels,
          status: formData.status,
          active_status: formData.active_status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Workshop creation failed: ${response.status}`
        );
      }

      // Call the parent handler
      await onAddWorkshop(formData);

      toast.success("Workshop added successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Workshop creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Workshop creation failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Workshop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Workshop</DialogTitle>
          <DialogDescription>
            Create a new workshop by filling out the required information.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workshop Name *</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
                <Building className="h-4 w-4 text-blue-500" />
                <Input
                  id="name"
                  placeholder="Workshop name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
                <Mail className="h-4 w-4 text-blue-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="workshop@example.com"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-emerald-50/50">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <Input
                  id="address"
                  placeholder="Workshop address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
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
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Phone
                </Button>
              </div>

              {formData.phoneNumbers?.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-amber-50/50 flex-1">
                    <Phone className="h-4 w-4 text-amber-500" />
                    <Input
                      placeholder="Phone number"
                      value={phone.phone_number}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className="border-none bg-transparent focus-visible:ring-0 p-0"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrimaryPhone(index)}
                      className={`h-7 px-2 ${
                        phone.is_primary ? "bg-green-100 text-green-700" : ""
                      }`}
                    >
                      Primary
                    </Button>
                    {formData.phoneNumbers!.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePhoneNumber(index)}
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {errors.phoneNumbers && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumbers}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Operating Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="active_status">Approval Status</Label>
                <Select
                  value={formData.active_status}
                  onValueChange={(value) =>
                    handleInputChange("active_status", value)
                  }
                >
                  <SelectTrigger id="active_status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="services">Services</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 border rounded-md px-3 py-2 bg-indigo-50/50">
                  <Wrench className="h-4 w-4 text-indigo-500" />
                  <Input
                    id="services"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={handleServiceKeyDown}
                    className="border-none bg-transparent focus-visible:ring-0 p-0"
                    placeholder="Add service and press Enter"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddService}
                >
                  Add
                </Button>
              </div>

              {formData.services && formData.services.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.services.map((service, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 bg-indigo-50 text-indigo-700"
                    >
                      <Wrench className="h-3 w-3" />
                      {service}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-indigo-500 hover:text-indigo-700"
                        onClick={() => handleRemoveService(index)}
                      >
                        &times;
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="e.g. 31.205753"
                  value={formData.latitude !== null ? formData.latitude : ""}
                  onChange={(e) =>
                    handleInputChange(
                      "latitude",
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="e.g. 29.924526"
                  value={formData.longitude !== null ? formData.longitude : ""}
                  onChange={(e) =>
                    handleInputChange(
                      "longitude",
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="labels">Labels</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 border rounded-md px-3 py-2 bg-gray-50/50">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <Input
                    id="labels"
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    onKeyDown={handleLabelKeyDown}
                    className="border-none bg-transparent focus-visible:ring-0 p-0"
                    placeholder="Add label and press Enter"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddLabel}
                >
                  Add
                </Button>
              </div>

              {formData.labels && formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.labels.map((label, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {label}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveLabel(index)}
                      >
                        &times;
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
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
              "Create Workshop"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
