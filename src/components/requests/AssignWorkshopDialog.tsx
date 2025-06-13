import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { ServiceRequest, Workshop } from "@/app/(dashboard)/requests/page";
import { Building, MapPin, Star } from "lucide-react";

interface AssignWorkshopDialogProps {
  request: ServiceRequest;
  workshops: Workshop[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (requestId: string, workshopId: string) => void;
}

const AssignWorkshopDialog = ({
  request,
  workshops,
  isOpen,
  onClose,
  onSave,
}: AssignWorkshopDialogProps) => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(
    request.workshopId || ""
  );

  // Reset selection when the dialog opens with a new request
  useEffect(() => {
    setSelectedWorkshopId(request.workshopId || "");
  }, [request]);

  const handleSave = () => {
    if (selectedWorkshopId) {
      onSave(request.id, selectedWorkshopId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Workshop</DialogTitle>
          <DialogDescription>
            Select a workshop to handle this service request.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 space-y-2">
            <h4 className="font-medium text-sm">Request Details</h4>
            <div className="bg-muted p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Request ID:
                </span>
                <span className="text-sm font-medium">{request.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer:</span>
                <span className="text-sm">{request.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vehicle:</span>
                <span className="text-sm">{request.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Service:</span>
                <span className="text-sm">{request.service}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Select Workshop</h4>
            <Select
              value={selectedWorkshopId}
              onValueChange={setSelectedWorkshopId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a workshop" />
              </SelectTrigger>
              <SelectContent>
                {workshops.map((workshop) => (
                  <SelectItem key={workshop.id} value={workshop.id}>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-500" />
                      <span>{workshop.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({workshop.rating} ⭐)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedWorkshopId && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Workshop Details</h4>
              <div className="bg-muted p-3 rounded-md">
                {workshops
                  .filter((w) => w.id === selectedWorkshopId)
                  .map((workshop) => (
                    <div key={workshop.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Name:
                        </span>
                        <span className="text-sm font-medium">
                          {workshop.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Location:
                        </span>
                        <span className="text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {workshop.location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Rating:
                        </span>
                        <span className="text-sm flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {workshop.rating}/5
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedWorkshopId}>
            Assign Workshop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignWorkshopDialog;
