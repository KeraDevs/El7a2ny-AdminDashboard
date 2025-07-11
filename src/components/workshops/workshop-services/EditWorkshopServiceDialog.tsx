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
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        percentage: service.percentage,
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service) {
      toast.error("No service selected");
      return;
    }

    if (formData.percentage === undefined || formData.percentage < 0) {
      toast.error("Please enter a valid percentage");
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
      percentage: 0,
    });
    onClose();
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
            </CardContent>
          </Card>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage (%) *</Label>
              <div className="relative">
                <IconCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Current: {service.percentage}%
                </span>
                {formData.percentage !== undefined &&
                  formData.percentage >= 0 && (
                    <span className="text-blue-600">
                      New: {formData.percentage}%
                    </span>
                  )}
              </div>
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
                  Percentage Change:
                </span>
                <span className="text-sm font-medium">
                  {service.percentage}% → {formData.percentage || 0}%
                </span>
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
