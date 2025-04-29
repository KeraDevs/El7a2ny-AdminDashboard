import React from "react";
import { User } from "@/types/userTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: User | null;
  onEdit: () => void;
}

export const ViewUserDialog: React.FC<ViewUserDialogProps> = ({
  isOpen,
  setIsOpen,
  userData,
  onEdit,
}) => {
  if (!userData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center pb-4">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
              {userData.first_name?.[0]}
              {userData.last_name?.[0]}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Full Name
              </h4>
              <p className="text-sm">{userData.fullName}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Email
              </h4>
              <p className="text-sm">{userData.email}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Phone
              </h4>
              <p className="text-sm">{userData.phone}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Gender
              </h4>
              <p className="text-sm capitalize">{userData.gender}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                User Type
              </h4>
              <p className="text-sm capitalize">
                <Badge variant="outline">{userData.userType}</Badge>
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Joined Date
              </h4>
              <p className="text-sm">
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Labels
            </h4>
            <div className="flex flex-wrap gap-2">
              {userData.labels && userData.labels.length > 0 ? (
                userData.labels.map((label, index) => (
                  <Badge key={index} variant="secondary">
                    {label}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No labels</span>
              )}
            </div>
          </div>

          {userData.vehicle && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Car Information</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Model
                  </h5>
                  <p className="text-sm">{userData.vehicle.model}</p>
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Year
                  </h5>
                  <p className="text-sm">{userData.vehicle.year}</p>
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    License Plate
                  </h5>
                  <p className="text-sm">{userData.vehicle.license_plate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
