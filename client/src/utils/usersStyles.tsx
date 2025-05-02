import React from "react";
import { CircleUser, ShieldUser, UserCog, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getUserTypeBadge = (userType: string) => {
  switch (userType) {
    case "superadmin":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
          <ShieldUser className="h-3 w-3 mr-1" />
          Super Admin
        </Badge>
      );
    case "workshopAdmin":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          <UserCog className="h-3 w-3 mr-1" />
          Workshop Admin
        </Badge>
      );
    case "worker":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <Wrench className="h-3 w-3 mr-1" />
          Worker
        </Badge>
      );
    case "customer":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
          <CircleUser className="h-3 w-3 mr-1" />
          Customer
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-300 capitalize">
          {userType}
        </Badge>
      );
  }
};

export const getGenderBadge = (gender: string) => {
  return (
    <Badge
      className={
        gender === "male"
          ? "bg-sky-100 text-sky-800 border-sky-300"
          : "bg-pink-100 text-pink-800 border-pink-300"
      }
    >
      {gender === "male" ? "Male" : "Female"}
    </Badge>
  );
};

export const getUserTypeIcon = (userType: string | undefined) => {
  if (!userType) return <CircleUser className="h-4 w-4 text-gray-600" />;

  switch (userType) {
    case "superadmin":
      return <ShieldUser className="h-4 w-4 text-purple-600" />;
    case "workshopAdmin":
      return <UserCog className="h-4 w-4 text-blue-600" />;
    case "worker":
      return <Wrench className="h-4 w-4 text-green-600" />;
    case "customer":
      return <CircleUser className="h-4 w-4 text-amber-600" />;
    default:
      return <CircleUser className="h-4 w-4 text-gray-600" />;
  }
};

export const getUserTypeBgColor = (userType: string | undefined) => {
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

export const getGenderBgColor = (gender: string | undefined) => {
  switch (gender) {
    case "male":
      return "bg-sky-50 border-sky-200";
    case "female":
      return "bg-pink-50 border-pink-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export const formatUserTypeDisplay = (userType: string | undefined) => {
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
