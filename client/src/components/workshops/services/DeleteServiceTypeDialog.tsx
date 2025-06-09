import React, { useState } from "react";
import { ServiceType } from "@/types/serviceTypes";
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

interface DeleteServiceTypeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceTypeIds: string[];
  ServiceTypes: ServiceType[];
  onDelete: () => Promise<void>;
}

const DeleteServiceTypeDialog: React.FC<DeleteServiceTypeDialogProps> = ({
  isOpen,
  setIsOpen,
  serviceTypeIds,
  ServiceTypes,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Determine if we're deleting single or multiple service types
  const isSingleDelete = serviceTypeIds.length === 1;
  const serviceTypeToDelete = isSingleDelete
    ? ServiceTypes.find((st) => st.id === serviceTypeIds[0])
    : null;

  const handleClose = () => {
    setIsOpen(false);
    setConfirmText("");
  };

  // What user needs to type to confirm deletion
  const confirmationText =
    isSingleDelete && serviceTypeToDelete ? serviceTypeToDelete.name : "DELETE";

  const handleDelete = async () => {
    if (confirmText !== confirmationText) {
      toast.error(
        isSingleDelete
          ? "Service name doesn't match. Please try again."
          : "Please type DELETE to confirm."
      );
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete();

      toast.success(
        isSingleDelete
          ? `"${serviceTypeToDelete?.name}" service has been deleted`
          : `${serviceTypeIds.length} service types have been deleted`
      );

      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to delete: ${error.message}`
          : "Failed to delete service type(s)"
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
            Delete
            {isSingleDelete
              ? "Service Type"
              : `${serviceTypeIds.length} Service Types`}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            {isSingleDelete ? " service type " : " selected service types "}
            from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-destructive/10 p-4 rounded-md text-sm">
            <p className="font-medium text-destructive mb-2">Warning:</p>
            <p>
              Deleting
              {isSingleDelete ? "this service type" : "these service types"} may
              affect existing customer records, appointments, and reports that
              reference {isSingleDelete ? "this service." : "these services."}
            </p>
          </div>

          {isSingleDelete && serviceTypeToDelete ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                To confirm, type the service name below:
              </p>
              <p className="text-sm font-semibold border-l-2 border-l-primary pl-2">
                {serviceTypeToDelete.name}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                To confirm deletion of {serviceTypeIds.length} service types,
                type "DELETE" below:
              </p>
              <ul className="text-sm border-l-2 border-l-primary pl-2 mt-2 mb-2 max-h-32 overflow-y-auto">
                {serviceTypeIds.map((id) => {
                  const service = ServiceTypes.find((s) => s.id === id);
                  return service ? (
                    <li key={id} className="py-1">
                      • {service.name}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={`Type ${
              isSingleDelete ? "the name" : "DELETE"
            } to confirm`}
            disabled={isDeleting}
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== confirmationText}
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
                Delete
                {isSingleDelete
                  ? "Service"
                  : `${serviceTypeIds.length} Services`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServiceTypeDialog;
