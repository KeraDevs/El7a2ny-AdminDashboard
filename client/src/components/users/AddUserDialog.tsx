import React, { useState } from "react";
import { User } from "@/types/userTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddUserDialogProps {
  onAddUser: (userData: Partial<User>) => Promise<void>;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ onAddUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "male",
    userType: "customer",
    password: "",
    labels: [],
    isActive: true,
  });

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...formData,
        fullName: `${formData.first_name} ${formData.last_name}`,
      };

      await onAddUser(updatedData);
      setIsOpen(false);

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "male",
        userType: "customer",
        password: "",
        labels: [],
        isActive: true,
      });
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account by filling out the form below.
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
              value={formData.first_name || ""}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              className="col-span-3"
              required
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
              value={formData.last_name || ""}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="password"
              className="text-right text-sm font-medium"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="gender" className="text-right text-sm font-medium">
              Gender
            </label>
            <Select
              value={formData.gender || "male"}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="userType"
              className="text-right text-sm font-medium"
            >
              User Type
            </label>
            <Select
              value={formData.userType || "customer"}
              onValueChange={(value) => handleInputChange("userType", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select user type" />
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
