"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/userTypes";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Save,
  X,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserProfile = ({ params }: { params: { id: string } }) => {
  const { currentUser, isAuthorized } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthorized || !currentUser) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();

        const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_RAIL_WAY;

        if (!API_KEY || !API_BASE_URL) {
          throw new Error("API configuration is missing");
        }

        const response = await fetch(`${API_BASE_URL}/users/${params.id}`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        if (!result.user) {
          throw new Error("User not found");
        }

        const userData: User = {
          id: result.user.id,
          email: result.user.email,
          password: result.user.password || "",
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          fullName: `${result.user.first_name} ${result.user.last_name}`,
          phone: result.user.phone,
          nationalNumber: result.user.national_id,
          profilePic: result.user.profile_pic || "",
          gender: result.user.gender.toLowerCase() as "male" | "female",
          userType: result.user.type as
            | "customer"
            | "workshopAdmin"
            | "worker"
            | "superadmin",
          labels: result.user.labels || [],
          isActive: true,
          cars: result.user.cars || [],
          createdAt: result.user.created_at,
          updatedAt: result.user.updated_at,
          vehicle: result.user.vehicle,
        };

        setUser(userData);
        setEditData(userData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        toast.error("Failed to load user", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, currentUser, isAuthorized]);

  const handleEditSubmit = async () => {
    if (!currentUser || !editData.id) return;

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_RAIL_WAY;

      if (!API_KEY || !API_BASE_URL) {
        throw new Error("API configuration is missing");
      }

      const firstName = editData.first_name || "";
      const lastName = editData.last_name || "";

      const apiData = {
        id: editData.id,
        email: editData.email,
        first_name: firstName,
        last_name: lastName,
        national_id: editData.nationalNumber,
        phone: editData.phone,
        gender: editData.gender?.toLowerCase(),
        type: editData.userType?.toLowerCase(),
      };

      const response = await fetch(`${API_BASE_URL}/users/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      setUser({
        ...user!,
        ...editData,
        fullName: `${firstName} ${lastName}`,
      });

      toast.success("User updated successfully");
      setIsEditing(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to update user", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || !currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-muted-foreground">
            You need to be logged in to view this page. Please log in and try
            again.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Loading user profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Error Loading User</h2>
          <p className="text-muted-foreground">{error || "User not found"}</p>
          <Button className="mt-4" onClick={() => router.push("/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">
            View and manage user information
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditData(user);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center text-4xl font-semibold">
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        User Type
                      </h4>
                      <Badge variant="outline" className="capitalize">
                        {user.userType}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Status
                      </h4>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Joined Date
                      </h4>
                      <p className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </h4>
                      <p className="text-sm">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </h4>
                      <p className="text-sm">{user.fullName}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </h4>
                      <p className="text-sm">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Phone Number
                      </h4>
                      <p className="text-sm">{user.phone || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        National ID
                      </h4>
                      <p className="text-sm">{user.nationalNumber || "N/A"}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Gender
                      </h4>
                      <p className="text-sm capitalize">{user.gender}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Labels
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.labels && user.labels.length > 0 ? (
                          user.labels.map((label, index) => (
                            <Badge key={index} variant="secondary">
                              {label}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No labels
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center text-4xl font-semibold">
                        {editData.first_name?.[0]}
                        {editData.last_name?.[0]}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">User Type</h4>
                      <Select
                        value={editData.userType}
                        onValueChange={(value) =>
                          setEditData((prev) => ({
                            ...prev,
                            userType: value as
                              | "customer"
                              | "workshopAdmin"
                              | "worker"
                              | "superadmin",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="workshopAdmin">
                            Workshop Admin
                          </SelectItem>
                          <SelectItem value="worker">Worker</SelectItem>
                          <SelectItem value="superadmin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Status</h4>
                      <Select
                        value={editData.isActive ? "active" : "inactive"}
                        onValueChange={(value) =>
                          setEditData((prev) => ({
                            ...prev,
                            isActive: value === "active",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Joined Date
                      </h4>
                      <p className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}{" "}
                        (Non-editable)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">First Name</h4>
                      <Input
                        value={editData.first_name || ""}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            first_name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Last Name</h4>
                      <Input
                        value={editData.last_name || ""}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            last_name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Email Address</h4>
                      <Input
                        value={editData.email || ""}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Phone Number</h4>
                      <Input
                        value={editData.phone || ""}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">National ID</h4>
                      <Input
                        value={editData.nationalNumber || ""}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            nationalNumber: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Gender</h4>
                      <Select
                        value={editData.gender}
                        onValueChange={(value) =>
                          setEditData((prev) => ({
                            ...prev,
                            gender: value as "male" | "female",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                User's recent activities and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <UserIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No activity yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This user doesn't have any recorded activity
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicles</CardTitle>
              <CardDescription>
                Vehicles associated with this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.vehicle ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Model
                      </h4>
                      <p className="text-sm">{user.vehicle.model}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Year
                      </h4>
                      <p className="text-sm">{user.vehicle.year}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        License Plate
                      </h4>
                      <p className="text-sm">{user.vehicle.license_plate}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        VIN Number
                      </h4>
                      <p className="text-sm">{user.vehicle.vin_number}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Car Type
                      </h4>
                      <p className="text-sm">{user.vehicle.car_type}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Features
                      </h4>
                      <div className="flex gap-2">
                        {user.vehicle.turbo && (
                          <Badge variant="outline">Turbo</Badge>
                        )}
                        {user.vehicle.exotic && (
                          <Badge variant="outline">Exotic</Badge>
                        )}
                        {!user.vehicle.turbo && !user.vehicle.exotic && (
                          <span className="text-sm text-muted-foreground">
                            No special features
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <UserIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No vehicles</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This user doesn't have any associated vehicles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage user account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Password Reset</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reset the user's password
                  </p>
                  <Button disabled>Send Password Reset Link</Button>
                </div>

                <div className="pt-6">
                  <h3 className="text-lg font-medium text-destructive">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete this user account
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
