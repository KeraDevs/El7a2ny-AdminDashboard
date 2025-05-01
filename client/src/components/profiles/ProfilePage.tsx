"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Loader2, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { API_BASE_URL, API_KEY } from "@/utils/config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const ProfilePage: React.FC = () => {
  const { userData, currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "male",
    userType: "superadmin",
    profile_pic: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: userData.gender || "male",
        userType: userData.type || "superadmin",
        profile_pic: userData.profile_pic || "",
      });
    }
  }, [userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Updating profile...");

      const authToken = await currentUser.getIdToken();

      const apiData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        gender: formData.gender.toLowerCase(),
      };

      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${authToken}`,
        }),
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      toast.success("Profile updated successfully", { id: toastId });
      setEditMode(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to update profile: ${error.message}`
          : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentUser) {
      toast.error("Authentication required");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Updating password...");

      const credential = EmailAuthProvider.credential(
        currentUser.email || "",
        passwords.currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, passwords.newPassword);

      toast.success("Password updated successfully", { id: toastId });
      setPasswordDialogOpen(false);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      let errorMessage = "Failed to update password";

      if (error instanceof Error) {
        if (error.message.includes("auth/wrong-password")) {
          errorMessage = "Current password is incorrect";
        } else if (error.message.includes("auth/too-many-requests")) {
          errorMessage = "Too many failed attempts. Try again later";
        } else {
          errorMessage = `Failed to update password: ${error.message}`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userInitial = formData.first_name?.charAt(0) || "A";
  const fullName = `${formData.first_name} ${formData.last_name}`;

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader className="relative">
                <div className="absolute right-6 top-6">
                  {editMode ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Reset form data to original user data
                          if (userData) {
                            setFormData({
                              first_name: userData.first_name || "",
                              last_name: userData.last_name || "",
                              email: userData.email || "",
                              phone: userData.phone || "",
                              gender: userData.gender || "male",
                              userType: userData.type || "superadmin",
                              profile_pic: userData.profile_pic || "",
                            });
                          }
                          setEditMode(false);
                        }}
                        disabled={loading}
                      >
                        <XIcon className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4 mr-1" /> Save
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.profile_pic} alt={fullName} />
                      <AvatarFallback className="text-2xl">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button variant="outline" size="sm" disabled>
                        Change Photo
                      </Button>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {formData.userType}
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        {editMode ? (
                          <Input
                            id="first_name"
                            value={formData.first_name}
                            onChange={(e) =>
                              handleInputChange("first_name", e.target.value)
                            }
                            disabled={loading}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">
                            {formData.first_name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        {editMode ? (
                          <Input
                            id="last_name"
                            value={formData.last_name}
                            onChange={(e) =>
                              handleInputChange("last_name", e.target.value)
                            }
                            disabled={loading}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">
                            {formData.last_name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="p-2 border rounded-md bg-muted/20">
                          {formData.email}
                        </div>
                        {editMode && (
                          <p className="text-muted-foreground text-xs">
                            Email cannot be changed. Contact support if needed.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        {editMode ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            disabled={loading}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">
                            {formData.phone || "Not specified"}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        {editMode ? (
                          <Select
                            value={formData.gender}
                            onValueChange={(value) =>
                              handleInputChange("gender", value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20 capitalize">
                            {formData.gender}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <div className="p-2 border rounded-md bg-muted/20 capitalize">
                          {formData.userType}
                        </div>
                        {editMode && (
                          <p className="text-muted-foreground text-xs">
                            Role cannot be changed. Contact support if needed.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your password to keep your account secure
                  </p>
                  <Button onClick={() => setPasswordDialogOpen(true)}>
                    Change Password
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Login Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your active session information
                  </p>
                  <div className="bg-muted/30 p-4 rounded-md mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: Just now
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password to update your
              credentials
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordUpdate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
