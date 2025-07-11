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
import {
  IconUpload,
  IconBuilding,
  IconSettings,
  IconPercentage,
  IconPlus,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useWorkshops } from "@/hooks/_useWorkshops";
import { useServiceTypes } from "@/hooks/_useServices";
import { BatchCreateWorkshopServiceData } from "@/types/workshopServiceTypes";

interface BatchCreateWorkshopServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BatchCreateWorkshopServiceData) => Promise<void>;
}

interface ServiceItem {
  id: string;
  service_type_id: string;
  percentage: number;
  serviceType?: any;
}

export const BatchCreateWorkshopServiceDialog: React.FC<
  BatchCreateWorkshopServiceDialogProps
> = ({ isOpen, onClose, onSave }) => {
  const [workshopId, setWorkshopId] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

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

    if (!workshopId) {
      toast.error("Please select a workshop");
      return;
    }

    if (services.length === 0) {
      toast.error("Please add at least one service");
      return;
    }

    const invalidServices = services.filter(
      (s) => !s.service_type_id || s.percentage <= 0 || s.percentage > 100
    );
    if (invalidServices.length > 0) {
      toast.error(
        "Please fill in all service details with valid percentages (0-100%)"
      );
      return;
    }

    // Check for duplicate service types
    const serviceTypeIds = services
      .map((s) => s.service_type_id)
      .filter(Boolean);
    const duplicateServiceTypes = serviceTypeIds.filter(
      (id, index) => serviceTypeIds.indexOf(id) !== index
    );
    if (duplicateServiceTypes.length > 0) {
      toast.error(
        "Cannot have duplicate service types. Please remove duplicates."
      );
      return;
    }

    // Warning for total percentage over 100%
    const totalPercentage = getTotalPercentage();
    if (totalPercentage > 100) {
      const confirmed = window.confirm(
        `Warning: Total percentage is ${totalPercentage}%, which exceeds 100%. Do you want to continue?`
      );
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const batchData: BatchCreateWorkshopServiceData = {
        workshop_id: workshopId,
        services: services.map((s) => ({
          service_type_id: s.service_type_id,
          percentage: s.percentage,
        })),
      };
      await onSave(batchData);
      toast.success(
        `Successfully created ${services.length} workshop service${
          services.length !== 1 ? "s" : ""
        }`
      );
      handleClose();
    } catch (error: any) {
      console.error("Error creating workshop services:", error);

      // Handle specific error cases
      if (error?.message?.includes("404")) {
        toast.error("Workshop not found. Please select a valid workshop.");
      } else if (error?.message?.includes("already exists")) {
        toast.error("One or more services already exist for this workshop.");
      } else {
        toast.error("Failed to create workshop services. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setWorkshopId("");
    setServices([]);
    setSelectedWorkshop(null);
    onClose();
  };

  const handleWorkshopChange = (value: string) => {
    setWorkshopId(value);
    const workshop = workshops.find((w) => w.id === value);
    setSelectedWorkshop(workshop);
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      service_type_id: "",
      percentage: 10, // Default percentage
    };
    setServices((prev) => [...prev, newService]);
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const updateServiceType = (id: string, serviceTypeId: string) => {
    const serviceType = serviceTypes.find((st) => st.id === serviceTypeId);
    updateService(id, {
      service_type_id: serviceTypeId,
      serviceType,
      percentage: 10, // Default percentage when service type is selected
    });
  };

  const formatPrice = (percentage: number) => {
    return `${percentage}%`;
  };

  const getTotalPercentage = () => {
    return services.reduce((total, service) => total + service.percentage, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUpload className="h-5 w-5" />
            Batch Create Workshop Services
          </DialogTitle>
          <DialogDescription>
            Add multiple services to a workshop at once
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Workshop Selection */}
              <div className="space-y-2">
                <Label htmlFor="workshop">Workshop *</Label>
                <Select
                  value={workshopId}
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
                            <IconBuilding className="h-4 w-4" />
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

              {/* Services Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Services</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addService}
                  >
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {services.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-muted-foreground">
                        <IconSettings className="h-12 w-12 mx-auto mb-4" />
                        <p>No services added yet</p>
                        <p className="text-sm">
                          Click "Add Service" to get started
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {services.map((service, index) => (
                      <Card key={service.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Service Type */}
                            <div className="space-y-2">
                              <Label className="text-sm">Service Type</Label>
                              <Select
                                value={service.service_type_id}
                                onValueChange={(value) =>
                                  updateServiceType(service.id, value)
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                  {serviceTypes.map((serviceType) => (
                                    <SelectItem
                                      key={serviceType.id}
                                      value={serviceType.id}
                                    >
                                      {serviceType.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {service.serviceType && (
                                <Badge variant="outline" className="text-xs">
                                  {service.serviceType.service_category}
                                </Badge>
                              )}
                            </div>

                            {/* Percentage */}
                            <div className="space-y-2">
                              <Label className="text-sm">Percentage (%)</Label>
                              <div className="relative">
                                <IconPercentage className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={service.percentage}
                                  onChange={(e) => {
                                    const value =
                                      parseFloat(e.target.value) || 0;
                                    const clampedValue = Math.min(
                                      Math.max(value, 0),
                                      100
                                    );
                                    updateService(service.id, {
                                      percentage: clampedValue,
                                    });
                                  }}
                                  className="pl-8 h-8"
                                  placeholder="0.0"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeService(service.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              {services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Batch Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Services:
                      </span>
                      <span className="text-sm font-medium">
                        {services.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Percentage:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          getTotalPercentage() > 100 ? "text-destructive" : ""
                        }`}
                      >
                        {formatPrice(getTotalPercentage())}
                        {getTotalPercentage() > 100 && (
                          <IconAlertCircle className="inline h-3 w-3 ml-1" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Average Percentage:
                      </span>
                      <span className="text-sm font-medium">
                        {formatPrice(
                          services.length > 0
                            ? getTotalPercentage() / services.length
                            : 0
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || services.length === 0}>
                {loading
                  ? "Creating..."
                  : `Create ${services.length} Service${
                      services.length !== 1 ? "s" : ""
                    }`}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
