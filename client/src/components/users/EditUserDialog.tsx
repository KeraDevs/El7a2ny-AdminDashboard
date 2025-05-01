import React, { useEffect } from "react";
import { User } from "@/types/userTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: Partial<User>;
  setUserData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  onSave: () => Promise<void>;
  loading?: boolean;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  setIsOpen,
  userData,
  setUserData,
  onSave,
  loading = false,
}) => {
  const handleSave = async () => {
    try {
      const toastId = toast.loading("Updating user...");
      await onSave();
      toast.success("User updated successfully", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to update user: ${error.message}`
          : "Failed to update user: Unknown error"
      );
    }
  };

  useEffect(() => {}, [isOpen, userData]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="firstName"
              className="text-right text-sm font-medium"
            >
              First Name
            </label>
            <Input
              id="firstName"
              value={userData.first_name || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="lastName"
              className="text-right text-sm font-medium"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              value={userData.last_name || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }))
              }
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={userData.email || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              value={userData.phone || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="gender" className="text-right text-sm font-medium">
              Gender
            </label>
            <div className="col-span-3">
              <Select
                key={`gender-${userData.id}`}
                defaultValue={userData.gender}
                value={userData.gender}
                onValueChange={(value) =>
                  setUserData((prev) => ({
                    ...prev,
                    gender: value as "male" | "female",
                  }))
                }
                disabled={loading}
              >
                <SelectTrigger id="gender">
                  {userData.gender && (
                    <span className="capitalize">{userData.gender}</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="userType"
              className="text-right text-sm font-medium"
            >
              User Type
            </label>
            <div className="col-span-3">
              <Select
                key={`userType-${userData.id}`}
                defaultValue={userData.userType}
                value={userData.userType}
                onValueChange={(value) =>
                  setUserData((prev) => ({
                    ...prev,
                    userType: value as
                      | "customer"
                      | "workshopAdmin"
                      | "worker"
                      | "superadmin",
                  }))
                }
                disabled={loading}
              >
                <SelectTrigger id="userType">
                  {userData.userType && (
                    <span className="capitalize">{userData.userType}</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="workshopAdmin">Workshop Admin</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
