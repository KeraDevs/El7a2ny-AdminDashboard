import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { Plus, Building, Settings, Percent } from "lucide-react";
import { useWorkshops } from "@/hooks/_useWorkshops";
import { useServiceTypes } from "@/hooks/_useServices";
import { CreateWorkshopServiceData } from "@/types/workshopServiceTypes";
import { Workshop } from "@/types/workshopTypes";
import { ServiceType } from "@/types/serviceTypes";

interface AddWorkshopServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateWorkshopServiceData) => Promise<void>;
}

export const AddWorkshopServiceDialog: React.FC<
  AddWorkshopServiceDialogProps
> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateWorkshopServiceData>({
    workshop_id: "",
    service_type_id: "",
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);

  const {
    workshops,
    fetchWorkshops,
    loading: workshopsLoading,
  } = useWorkshops();
  const {
    serviceTypes,
    fetchServiceTypes,
    loading: serviceTypesLoading,
  } = useServiceTypes();

  useEffect(() => {
    if (isOpen) {
      fetchWorkshops();
      fetchServiceTypes();
    }
  }, [isOpen, fetchWorkshops, fetchServiceTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.workshop_id ||
      !formData.service_type_id ||
      formData.percentage <= 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      handleClose();
    } catch {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      workshop_id: "",
      service_type_id: "",
      percentage: 0,
    });
    setSelectedWorkshop(null);
    setSelectedServiceType(null);
    onClose();
  };

  const handleWorkshopChange = (value: string) => {
    setFormData((prev) => ({ ...prev, workshop_id: value }));
    const workshop = workshops.find((w) => w.id === value);
    setSelectedWorkshop(workshop || null);
  };

  const handleServiceTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service_type_id: value }));
    const serviceType = serviceTypes.find((st) => st.id === value);
    setSelectedServiceType(serviceType || null);

    // Set base percentage if available
    if (serviceType?.service_types_percentage?.percentage) {
      const basePercentage = parseFloat(
        serviceType.service_types_percentage.percentage
      );
      setFormData((prev) => ({ ...prev, percentage: basePercentage }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Workshop Service
          </DialogTitle>
          <DialogDescription>
            Add a new service to a workshop with custom percentage
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Workshop Selection */}
            <div className="space-y-2">
              <Label htmlFor="workshop">Workshop *</Label>
              <Select
                value={formData.workshop_id}
                onValueChange={handleWorkshopChange}
                disabled={workshopsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workshop" />
                </SelectTrigger>
                <SelectContent>
                  {workshopsLoading ? (
                    <div className="p-2">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    workshops.map((workshop) => (
                      <SelectItem key={workshop.id} value={workshop.id}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {workshop.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedWorkshop && (
                <div className="text-sm text-muted-foreground">
                  {selectedWorkshop.address}
                </div>
              )}
            </div>

            {/* Service Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type *</Label>
              <Select
                value={formData.service_type_id}
                onValueChange={handleServiceTypeChange}
                disabled={serviceTypesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypesLoading ? (
                    <div className="p-2">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    serviceTypes.map((serviceType) => (
                      <SelectItem key={serviceType.id} value={serviceType.id}>
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          {serviceType.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedServiceType && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {selectedServiceType.description}
                  </div>
                  <Badge variant="outline">
                    {selectedServiceType.service_category}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Percentage Input */}
          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage (%) *</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0.0"
                value={formData.percentage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    percentage: parseFloat(e.target.value) || 0,
                  }))
                }
                className="pl-10"
                required
              />
            </div>
            {formData.percentage > 0 && (
              <div className="text-sm text-muted-foreground">
                Platform fee: {formData.percentage}%
              </div>
            )}
            {selectedServiceType?.service_types_percentage?.percentage && (
              <div className="text-sm text-blue-600">
                Base percentage:{" "}
                {selectedServiceType.service_types_percentage.percentage}%
              </div>
            )}
          </div>

          {/* Summary Card */}
          {selectedWorkshop && selectedServiceType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Service Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Workshop:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedWorkshop.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Service:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedServiceType.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
