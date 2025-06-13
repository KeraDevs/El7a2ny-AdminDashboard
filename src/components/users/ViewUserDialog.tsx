import React from "react";
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
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Calendar,
  CircleUser,
  Car,
  ExternalLink,
  Tag,
  Shield,
  Edit,
  IdCard,
} from "lucide-react";
import { getUserTypeBadge, getGenderBadge } from "@/utils/usersStyles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ViewUserDialogProps } from "@/types/userTypes";

export const ViewUserDialog: React.FC<ViewUserDialogProps> = ({
  isOpen,
  setIsOpen,
  userData,
  onEdit,
}) => {
  const router = useRouter();

  if (!userData) return null;

  const handleViewProfile = () => {
    setIsOpen(false);
    router.push(`/users/${userData.id}`);
  };

  const userInitials = `${userData.first_name?.[0] || ""}${
    userData.last_name?.[0] || ""
  }`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected user
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* User header section */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarImage src={userData.profilePic} alt={userData.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-lg font-medium">{userData.fullName}</h3>
              <div className="mt-1">{getUserTypeBadge(userData.userType)}</div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="break-all">{userData.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Main user info section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <p className="text-sm">{userData.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Joined</h4>
                <p className="text-sm">
                  {new Date(userData.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CircleUser className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Gender</h4>
                <div>{getGenderBadge(userData.gender)}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <IdCard className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">National ID</h4>
                <p className="text-sm">
                  {userData.nationalNumber || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <Badge variant={userData.isActive ? "default" : "secondary"}>
                  {userData.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Labels</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {userData.labels && userData.labels.length > 0 ? (
                    userData.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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

          {/* Vehicle information section */}
          {userData.vehicle &&
            Object.values(userData.vehicle).some((value) => value) && (
              <div className="bg-muted/20 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="h-4 w-4 text-blue-500" />
                  <h4 className="text-sm font-medium">Vehicle Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Model</p>
                    <p className="text-sm font-medium">
                      {userData.vehicle.model || "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Year</p>
                    <p className="text-sm font-medium">
                      {userData.vehicle.year || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      License Plate
                    </p>
                    <p className="text-sm font-medium">
                      {userData.vehicle.license_plate || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={handleViewProfile}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
