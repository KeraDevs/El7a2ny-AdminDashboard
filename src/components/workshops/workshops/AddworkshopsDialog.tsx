import React, { useState, useEffect } from "react";
import { Workshop } from "@/types/workshopTypes";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Loader2, Plus, MapPin, Building2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AssignOwnerDialog } from "./AssignOwnerDialog";

interface AddWorkshopDialogProps {
  onAddWorkshop: (workshopData: Partial<Workshop>) => Promise<void>;
}

export const AddWorkshopDialog: React.FC<AddWorkshopDialogProps> = ({
  onAddWorkshop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { currentUser } = useAuth();
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [selectedOwnerName, setSelectedOwnerName] = useState<string>("");
  const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);

  // Workshop form data state
  const [formData, setFormData] = useState<Partial<Workshop>>({
    name: "",
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
    status: "closed",
    active_status: "pending",
  });

  // Handle owner selection from the dialog
  const handleOwnerSelect = (userId: string, userName: string) => {
    setSelectedOwnerId(userId);
    setSelectedOwnerName(userName);
    setOwnerDialogOpen(false);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("basic");
      setFormData({
        name: "",
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
        status: "closed",
        active_status: "pending",
      });
      setSelectedOwnerId(null);
      setSelectedOwnerName("");
    }
  }, [isOpen]); // Handle changes to form inputs
  const handleInputChange = (
    field: keyof Workshop,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  // Submit handler - simplified to match Swagger API
  // Submit handler - simplified to match Swagger API
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name?.trim()) {
      toast.error("Workshop name is required");
      setActiveTab("basic");
      return;
    }

    if (!formData.address?.trim()) {
      toast.error("Workshop address is required");
      setActiveTab("basic");
      return;
    }

    if (!selectedOwnerId) {
      toast.error("Workshop owner is required");
      setActiveTab("basic");
      return;
    }

    // Validate phone numbers
    const phoneNumbers = formData.phoneNumbers || [];
    if (
      phoneNumbers.length === 0 ||
      !phoneNumbers.some((phone) => phone.phone_number?.trim())
    ) {
      toast.error("At least one phone number is required");
      setActiveTab("basic");
      return;
    }

    // Validate latitude and longitude
    if (
      formData.latitude === null ||
      formData.latitude === undefined ||
      formData.latitude === 0
    ) {
      toast.error("Latitude is required");
      setActiveTab("location");
      return;
    }

    if (
      formData.longitude === null ||
      formData.longitude === undefined ||
      formData.longitude === 0
    ) {
      toast.error("Longitude is required");
      setActiveTab("location");
      return;
    }

    // Validate coordinate ranges
    if (formData.latitude < -90 || formData.latitude > 90) {
      toast.error("Latitude must be between -90 and 90");
      setActiveTab("location");
      return;
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      toast.error("Longitude must be between -180 and 180");
      setActiveTab("location");
      return;
    }

    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare workshop data for the hook
      const workshopData = {
        name: formData.name,
        address: formData.address || "",
        status: formData.status || "closed",
        ownerId: selectedOwnerId,
        phoneNumbers: formData.phoneNumbers || [],
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      // Use the hook's method to add the workshop
      await onAddWorkshop(workshopData);

      setIsOpen(false);
    } catch (error) {
      console.error("Workshop creation error:", error);
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workshop Name *</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
                <Building2 className="h-4 w-4 text-blue-500" />
                <Input
                  id="name"
                  placeholder="Workshop name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Workshop Owner *</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-violet-50/50 flex-1">
                  <Users className="h-4 w-4 text-violet-500" />
                  <div className="flex-1 overflow-hidden">
                    {selectedOwnerId ? (
                      <div className="text-sm font-medium">
                        {selectedOwnerName}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No owner selected
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOwnerDialogOpen(true)}
                >
                  {selectedOwnerId ? "Change" : "Select"}
                </Button>
              </div>
              {!selectedOwnerId && (
                <p className="text-amber-500 text-xs mt-1">
                  A workshop owner is required
                </p>
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
                    <Plus className="h-4 w-4 text-amber-500" />
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
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
                  disabled={true}
                >
                  <SelectTrigger id="active_status">
                    <SelectValue placeholder="Pending" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
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
                  required
                />
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
              "Create Workshop"
            )}
          </Button>
          <AssignOwnerDialog
            open={ownerDialogOpen}
            onOpenChange={setOwnerDialogOpen}
            onSelect={handleOwnerSelect}
            currentOwnerId={selectedOwnerId || undefined}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
