import React from "react";
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
import {
  Loader2,
  Mail,
  Phone,
  UserCircle,
  ShieldCheck,
  Coffee,
  Users,
  UserCog,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EditUserDialogProps } from "@/types/userTypes";

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

  const getUserTypeIcon = (userType: string | undefined) => {
    if (!userType) return <UserCircle className="h-4 w-4 text-gray-600" />;

    switch (userType) {
      case "superadmin":
        return <ShieldCheck className="h-4 w-4 text-purple-600" />;
      case "workshopAdmin":
        return <Coffee className="h-4 w-4 text-blue-600" />;
      case "worker":
        return <Users className="h-4 w-4 text-green-600" />;
      case "customer":
        return <UserCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <UserCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUserTypeBgColor = (userType: string | undefined) => {
    if (!userType) return "bg-gray-50 border-gray-200";

    switch (userType) {
      case "superadmin":
        return "bg-purple-50 border-purple-200";
      case "workshopAdmin":
        return "bg-blue-50 border-blue-200";
      case "worker":
        return "bg-green-50 border-green-200";
      case "customer":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getGenderBgColor = (gender: string | undefined) => {
    switch (gender) {
      case "male":
        return "bg-sky-50 border-sky-200";
      case "female":
        return "bg-pink-50 border-pink-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatUserTypeDisplay = (userType: string | undefined) => {
    if (!userType) return "Select user type";

    switch (userType) {
      case "workshopAdmin":
        return "Workshop Admin";
      case "superadmin":
        return "Super Admin";
      case "customer":
        return "Customer";
      case "worker":
        return "Worker";
      default:
        return userType;
    }
  };

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
            <Label
              htmlFor="firstName"
              className="text-right text-sm font-medium"
            >
              First Name
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-emerald-50">
                <UserCog className="h-4 w-4 text-emerald-600" />
                <Input
                  id="firstName"
                  value={userData.first_name || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  className="bg-transparent border-none focus-visible:ring-0 pl-0"
                  disabled={loading}
                  placeholder="First Name"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="lastName"
              className="text-right text-sm font-medium"
            >
              Last Name
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-indigo-50">
                <UserCog className="h-4 w-4 text-indigo-600" />
                <Input
                  id="lastName"
                  value={userData.last_name || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  className="bg-transparent border-none focus-visible:ring-0 pl-0"
                  disabled={loading}
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-sm font-medium">
              Email
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <Input
                  id="email"
                  value={userData.email || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="bg-transparent border-none focus-visible:ring-0 pl-0 text-blue-800"
                  disabled={loading}
                  placeholder="Email address"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-sm font-medium">
              Phone
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-orange-50">
                <Phone className="h-4 w-4 text-orange-600" />
                <Input
                  id="phone"
                  value={userData.phone || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="bg-transparent border-none focus-visible:ring-0 pl-0 text-orange-800"
                  disabled={loading}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right text-sm font-medium">
              Gender
            </Label>
            <div className="col-span-3">
              <Select
                value={userData.gender}
                onValueChange={(value) =>
                  setUserData((prev) => ({
                    ...prev,
                    gender: value as "male" | "female",
                  }))
                }
                disabled={loading}
              >
                <SelectTrigger
                  id="gender"
                  className={`${getGenderBgColor(userData.gender)}`}
                >
                  <SelectValue>
                    <div className="capitalize">
                      {userData.gender === "male"
                        ? "Male"
                        : userData.gender === "female"
                        ? "Female"
                        : "Select gender"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    <Badge
                      variant="outline"
                      className="bg-sky-100 text-sky-800 border-sky-300"
                    >
                      Male
                    </Badge>
                  </SelectItem>
                  <SelectItem value="female">
                    <Badge
                      variant="outline"
                      className="bg-pink-100 text-pink-800 border-pink-300"
                    >
                      Female
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="userType"
              className="text-right text-sm font-medium"
            >
              User Type
            </Label>
            <div className="col-span-3">
              <Select
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
                <SelectTrigger
                  id="userType"
                  className={`${getUserTypeBgColor(userData.userType)}`}
                >
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getUserTypeIcon(userData.userType)}
                      <span>{formatUserTypeDisplay(userData.userType)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-amber-600" />
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300"
                      >
                        Customer
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="workshopAdmin">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-blue-600" />
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 border-blue-300"
                      >
                        Workshop Admin
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="worker">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-300"
                      >
                        Worker
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="superadmin">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-purple-600" />
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 border-purple-300"
                      >
                        Super Admin
                      </Badge>
                    </div>
                  </SelectItem>
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
