import React, { useState } from "react";
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
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddCarRegionDialogProps } from "@/types/carTypes";

export const AddCarRegionDialog: React.FC<AddCarRegionDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onAdd({
        name: formData.name.trim(),
      });

      // Reset form
      setFormData({
        name: "",
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add region");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setFormData({
        name: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Car Region
          </DialogTitle>
          <DialogDescription>
            Create a new car region entry in the system.
          </DialogDescription>
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
            <Label htmlFor="name" className="text-sm font-medium">
              Region Name *
            </Label>
            <Input
              id="name"
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
            Add Region
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
