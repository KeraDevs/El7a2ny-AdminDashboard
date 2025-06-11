import React, { useState, useEffect } from "react";
import { CarRegion } from "@/types/carTypes";
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
} from "@/components/ui/dialog";
import { Loader2, Edit, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditCarRegionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onEdit: (regionData: Partial<CarRegion>) => Promise<void>;
  region: CarRegion | null;
}

export const EditCarRegionDialog: React.FC<EditCarRegionDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onEdit,
  region,
}) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when region changes
  useEffect(() => {
    if (region) {
      setFormData({
        name: region.name || "",
      });
    }
  }, [region]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Region name is required");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError("Region name must be at least 2 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!region) return;

    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onEdit({
        id: region.id,
        name: formData.name.trim(),
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update region");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!region) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Car Region
          </DialogTitle>
          <DialogDescription>Update the car region details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Region Name *
            </Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="e.g., Europe, USA, Japan"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Region
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
