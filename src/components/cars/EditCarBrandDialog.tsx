import React, { useState, useEffect } from "react";
import { CarBrand } from "@/types/carTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Edit, AlertCircle, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCarRegions } from "@/hooks/_useCarRegions";

interface EditCarBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onEdit: (brandData: Partial<CarBrand>) => Promise<void>;
  brand: CarBrand | null;
}

export const EditCarBrandDialog: React.FC<EditCarBrandDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onEdit,
  brand,
}) => {
  const { regions, fetchRegions } = useCarRegions();
  const [formData, setFormData] = useState({
    name: "",
    regionIds: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch regions when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchRegions();
    }
  }, [isOpen, fetchRegions]);
  // Populate form when brand changes
  useEffect(() => {
    if (brand) {
      // Extract region IDs from brand_regions array
      const regionIds = brand.brand_regions
        ? brand.brand_regions.map((br) => br.region_id)
        : brand.regionIds || [];

      setFormData({
        name: brand.name || "",
        regionIds: regionIds,
      });
    }
  }, [brand]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegionToggle = (regionId: string) => {
    setFormData((prev) => ({
      ...prev,
      regionIds: prev.regionIds.includes(regionId)
        ? prev.regionIds.filter((id) => id !== regionId)
        : [...prev.regionIds, regionId],
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Brand name is required");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError("Brand name must be at least 2 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!brand) return;

    setError(null);

    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const editData = {
        id: brand.id,
        name: formData.name.trim(),
        regionIds: formData.regionIds,
      };

      console.log("=== EDIT DIALOG DEBUG ===");
      console.log("Original brand:", brand);
      console.log("Form data:", formData);
      console.log("Edit data being sent:", editData);
      console.log("Brand ID:", brand.id, "Type:", typeof brand.id);
      console.log("========================");

      await onEdit(editData);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update brand");
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

  if (!brand) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Car Brand
          </DialogTitle>
          <DialogDescription>Update the car brand details.</DialogDescription>
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
              Brand Name *
            </Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="e.g., Toyota, BMW, Mercedes-Benz"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Regions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Available Regions
            </Label>
            <div className="text-sm text-muted-foreground mb-2">
              Select the regions where this brand will be available
            </div>
            <div className="h-48 w-full border rounded-md p-3 overflow-y-auto">
              {regions.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No regions available
                </div>
              ) : (
                <div className="space-y-2">
                  {regions.map((region) => (
                    <div
                      key={region.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
                    >
                      <Checkbox
                        id={`edit-region-${region.id}`}
                        checked={formData.regionIds.includes(region.id)}
                        onCheckedChange={() => handleRegionToggle(region.id)}
                        disabled={loading}
                      />
                      <Label
                        htmlFor={`edit-region-${region.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="font-medium">{region.name}</div>
                        {region.description && (
                          <div className="text-xs text-muted-foreground">
                            {region.description}
                          </div>
                        )}
                        {region.country && (
                          <div className="text-xs text-muted-foreground">
                            {region.country}
                            {region.continent && ` • ${region.continent}`}
                          </div>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {formData.regionIds.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {formData.regionIds.length} region(s) selected
              </div>
            )}
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
            Update Brand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
