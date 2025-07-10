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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  IconEdit,
  IconBuilding,
  IconSettings,
  IconCurrencyDollar,
  IconCalendar,
} from "@tabler/icons-react";
import {
  WorkshopService,
  UpdateWorkshopServiceData,
} from "@/types/workshopServiceTypes";

interface EditWorkshopServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: WorkshopService | null;
  onSave: (
    workshopId: string,
    serviceTypeId: string,
    data: UpdateWorkshopServiceData
  ) => Promise<void>;
}

export const EditWorkshopServiceDialog: React.FC<
  EditWorkshopServiceDialogProps
> = ({ isOpen, onClose, service, onSave }) => {
  const [formData, setFormData] = useState<UpdateWorkshopServiceData>({
    price: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        price: service.price,
        is_active: service.is_active,
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service) {
      toast.error("No service selected");
      return;
    }

    if (formData.price === undefined || formData.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      await onSave(service.workshop_id, service.service_type_id, formData);
      handleClose();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      price: 0,
      is_active: true,
    });
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!service) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit className="h-5 w-5" />
            Edit Workshop Service
          </DialogTitle>
          <DialogDescription>
            Update the service details and pricing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <IconSettings className="h-4 w-4" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Workshop
                  </Label>
                  <div className="flex items-center gap-2">
                    <IconBuilding className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {service.workshop?.name || "Unknown Workshop"}
                    </span>
                  </div>
                  {service.workshop?.address && (
                    <div className="text-sm text-muted-foreground">
                      {service.workshop.address}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Service Type
                  </Label>
                  <div className="space-y-2">
                    <div className="font-medium">
                      {service.service_type?.name || "Unknown Service"}
                    </div>
                    {service.service_type?.description && (
                      <div className="text-sm text-muted-foreground">
                        {service.service_type.description}
                      </div>
                    )}
                    {service.service_type?.service_category && (
                      <Badge variant="outline">
                        {service.service_type.service_category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Created
                  </Label>
                  <div className="flex items-center gap-2 text-sm">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(service.created_at)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Last Updated
                  </Label>
                  <div className="flex items-center gap-2 text-sm">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(service.updated_at)}
                  </div>
                </div>
              </div>

              {service.service_type?.basePrice && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Base Price
                  </Label>
                  <div className="text-sm font-medium text-blue-600">
                    {formatPrice(service.service_type.basePrice)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (EGP) *</Label>
              <div className="relative">
                <IconCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="pl-10"
                  required
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Current: {formatPrice(service.price)}
                </span>
                {formData.price !== undefined && formData.price > 0 && (
                  <span className="text-blue-600">
                    New: {formatPrice(formData.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="is_active" className="text-sm font-medium">
                Active service
              </Label>
            </div>
          </div>

          {/* Changes Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Changes Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Price Change:
                </span>
                <span className="text-sm font-medium">
                  {formatPrice(service.price)} →{" "}
                  {formatPrice(formData.price || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Status Change:
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span>→</span>
                  <Badge variant={formData.is_active ? "default" : "secondary"}>
                    {formData.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
