import React, { useState, useEffect } from "react";
import { User } from "@/types/userTypes";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Loader2,
  PlusCircle,
  Mail,
  Phone,
  Lock,
  UserCog,
  BadgeCheck,
  Tag,
  Eye,
  EyeOff,
  ShieldCheck,
  Coffee,
  Users,
  UserCircle,
  IdCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  const [step, setStep] = useState(1);
  const [labelInput, setLabelInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const { currentUser } = useAuth();

  // Firebase registration data
  const [firebaseData, setFirebaseData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // User profile data
  const [formData, setFormData] = useState<Partial<User>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationalNumber: "",
    gender: "male",
    userType: "customer",
    password: "",
    labels: [],
    isActive: true,
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setErrors({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        phone: "",
      });
      setFirebaseData({
        email: "",
        password: "",
        confirmPassword: "",
      });
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        nationalNumber: "",
        gender: "male",
        userType: "customer",
        password: "",
        labels: [],
        isActive: true,
      });
    }
  }, [isOpen]);

  // Handle input changes for firebase data
  const handleFirebaseInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFirebaseData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle changes to user form data
  const handleInputChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle adding labels
  const handleAddLabel = () => {
    if (labelInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        labels: [...(prev.labels || []), labelInput.trim()],
      }));
      setLabelInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLabel();
    }
  };

  // Remove a label
  const handleRemoveLabel = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels?.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number format
  const validatePhone = (phone: string): boolean => {
    // Simple validation for phone numbers
    // Adjust the regex according to your specific requirements
    const phoneRegex = /^\d{10,15}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  // Get user type icon
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

  // Get background color based on user type
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

  // Get background color based on gender
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

  // Format user type for display
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

  // Close dialog
  const handleCloseDialog = () => {
    if (step === 2) {
      // Confirm before closing if user was already created in Firebase
      if (
        window.confirm(
          "Are you sure you want to cancel? The Firebase user will remain in the system."
        )
      ) {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  // Validate Firebase registration form
  const validateFirebaseForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!firebaseData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(firebaseData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!firebaseData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (firebaseData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (firebaseData.password !== firebaseData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validate user profile form
  const validateUserForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.first_name) {
      newErrors.first_name = "First name is required";
      isValid = false;
    }

    if (!formData.last_name) {
      newErrors.last_name = "Last name is required";
      isValid = false;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Proceed to next step after Firebase registration
  const handleFirebaseRegistration = async () => {
    // Validate inputs
    if (!validateFirebaseForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
        },
        body: JSON.stringify({
          email: firebaseData.email,
          password: firebaseData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Firebase registration failed: ${response.status}`
        );
      }

      const result = await response.json();

      // Set the email and token ID for the next step
      setFormData((prev) => ({
        ...prev,
        email: firebaseData.email,
        id: result.token, // Save the firebase token
      }));

      // Move to step 2
      setStep(2);
      toast.success("Firebase registration successful");
    } catch (error) {
      console.error("Firebase registration error:", error);
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete the user registration
  const handleUserRegistration = async () => {
    // Validate required fields
    if (!validateUserForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for backend
      const backendData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        national_id: formData.nationalNumber,
        phone: formData.phone,
        gender: formData.gender?.toLowerCase(),
        type: formData.userType,
        profile_pic:
          formData.profilePic ||
          "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
        phone_numbers: [
          {
            phone_number: formData.phone || "",
            type: "MOBILE",
            is_primary: true,
            is_verified: false,
          },
        ],
      };

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${formData.id}`, // Use the Firebase token from step 1
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Backend registration failed: ${response.status}`
        );
      }

      // Create the final user data to pass back
      const finalUserData: Partial<User> = {
        ...formData,
        fullName: `${formData.first_name} ${formData.last_name}`,
      };

      // Call the parent handler
      await onAddUser(finalUserData);

      toast.success("User added successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("User registration error:", error);
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
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
            {step === 1
              ? "First, create the user's authentication credentials."
              : "Now, complete the user's profile information."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50/50">
                <Mail className="h-4 w-4 text-blue-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  value={firebaseData.email}
                  onChange={handleFirebaseInputChange}
                  className="border-none bg-transparent focus-visible:ring-0 p-0"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-amber-50/50">
                <Lock className="h-4 w-4 text-amber-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={firebaseData.password}
                  onChange={handleFirebaseInputChange}
                  className="border-none bg-transparent focus-visible:ring-0 p-0 flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-amber-50/50">
                <Lock className="h-4 w-4 text-amber-500" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={firebaseData.confirmPassword}
                  onChange={handleFirebaseInputChange}
                  className="border-none bg-transparent focus-visible:ring-0 p-0 flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-emerald-50">
                  <UserCog className="h-4 w-4 text-emerald-600" />
                  <Input
                    id="first_name"
                    value={formData.first_name || ""}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    className="bg-transparent border-none focus-visible:ring-0 pl-0"
                    placeholder="First Name"
                    required
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-indigo-50">
                  <UserCog className="h-4 w-4 text-indigo-600" />
                  <Input
                    id="last_name"
                    value={formData.last_name || ""}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    className="bg-transparent border-none focus-visible:ring-0 pl-0"
                    placeholder="Last Name"
                    required
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Read-only)</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <Input
                  id="email"
                  value={formData.email || ""}
                  disabled
                  className="bg-transparent border-none pl-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-orange-50">
                <Phone className="h-4 w-4 text-orange-600" />
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-transparent border-none focus-visible:ring-0 pl-0 text-orange-800"
                  placeholder="Phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalNumber">National ID</Label>
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-purple-50">
                <IdCard className="h-4 w-4 text-purple-600" />
                <Input
                  id="nationalNumber"
                  value={formData.nationalNumber || ""}
                  onChange={(e) =>
                    handleInputChange("nationalNumber", e.target.value)
                  }
                  className="bg-transparent border-none focus-visible:ring-0 pl-0"
                  placeholder="National ID number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger
                    id="gender"
                    className={`${getGenderBgColor(formData.gender)}`}
                  >
                    <SelectValue>
                      <div className="capitalize">
                        {formData.gender === "male"
                          ? "Male"
                          : formData.gender === "female"
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

              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) =>
                    handleInputChange("userType", value)
                  }
                >
                  <SelectTrigger
                    id="userType"
                    className={`${getUserTypeBgColor(formData.userType)}`}
                  >
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getUserTypeIcon(formData.userType)}
                        <span>{formatUserTypeDisplay(formData.userType)}</span>
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

            <div className="space-y-2">
              <Label htmlFor="labels">Labels</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 border rounded-md px-3 py-2 bg-gray-50/50">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <Input
                    id="labels"
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-none bg-transparent focus-visible:ring-0 p-0"
                    placeholder="Add label and press Enter"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddLabel}
                >
                  Add
                </Button>
              </div>

              {formData.labels && formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.labels.map((label, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {label}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveLabel(index)}
                      >
                        &times;
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleFirebaseRegistration}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleUserRegistration} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
