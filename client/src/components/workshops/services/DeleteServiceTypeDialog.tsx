import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Define the service type interface (if not imported)
interface ServiceType {
  id: string;
  name: string;
  description: string;
}

interface DeleteServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceType: ServiceType | null;
  onDelete: (id: string) => Promise<void>;
}

const DeleteServiceTypeDialog: React.FC<DeleteServiceTypeDialogProps> = ({
  isOpen,
  setIsOpen,
  serviceType,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!serviceType) return null;

  const handleClose = () => {
    setIsOpen(false);
    setConfirmText("");
  };

  const handleDelete = async () => {
    if (confirmText !== serviceType.name) {
      toast.error("Service name doesn't match. Please try again.");
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(serviceType.id);
      toast.success(`"${serviceType.name}" service has been deleted`);
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to delete service: ${error.message}`
          : "Failed to delete service"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isDeleting && setIsOpen(open)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Delete Service Type
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            service type from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-destructive/10 p-4 rounded-md text-sm">
            <p className="font-medium text-destructive mb-2">Warning:</p>
            <p>
              Deleting this service type may affect existing customer records,
              appointments, and reports that reference this service.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              To confirm, type the service name below:
            </p>
            <p className="text-sm font-semibold border-l-2 border-l-primary pl-2">
              {serviceType.name}
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type the name to confirm"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== serviceType.name}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Service
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServiceTypeDialog;
