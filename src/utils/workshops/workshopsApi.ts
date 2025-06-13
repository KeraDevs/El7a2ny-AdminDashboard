import { Workshop, PhoneNumber } from "../../types/workshopTypes";
import { User } from "../../types/userTypes";
import { ApiUserResponse, ApiWorkshopsList } from "../../types/apiTypes";

export const mapApiWorkshopToFrontend = (
  apiWorkshop: ApiWorkshopsList
): Workshop => ({
  id: apiWorkshop.id,
  parentId: apiWorkshop.parent_id,
  email: apiWorkshop.email,
  ownerId: apiWorkshop.owner_id,
  name: apiWorkshop.name,
  address: apiWorkshop.address,
  latitude: Number(apiWorkshop.latitude),
  longitude: Number(apiWorkshop.longitude),
  profilePic: apiWorkshop.profile_pic,
  active_status: apiWorkshop.active_status as
    | "pending"
    | "active"
    | "deactivated",
  status: apiWorkshop.status.toLowerCase() as "open" | "busy" | "closed",
  createdAt: apiWorkshop.created_at,
  updatedAt: apiWorkshop.updated_at,
  users: [],
  phoneNumbers:
    apiWorkshop.phone_numbers?.map((phone) => ({
      ...phone,
      type: phone.type.toUpperCase() as PhoneNumber["type"],
    })) || [],
  services: apiWorkshop.services || [],
  ratings: 10,
  totalReviews: 20,
  labels: apiWorkshop.labels || [],
});

export const mapFrontendToApiWorkshop = (workshop: Partial<Workshop>) => ({
  parent_id: workshop.parentId,
  owner_id: workshop.ownerId,
  name: workshop.name,
  address: workshop.address,
  latitude: workshop.latitude ? Number(workshop.latitude.toFixed(8)) : null,
  longitude: workshop.longitude ? Number(workshop.longitude.toFixed(8)) : null,
  profile_pic: workshop.profilePic,
  active_status: workshop.active_status || "active",
  status: workshop.status,
  phone_numbers:
    workshop.phoneNumbers?.map((phone) => ({
      phone_number: phone.phone_number,
      type: phone.type,
      is_primary: phone.is_primary,
    })) || [],
  // services: workshop.services || [],
  // labels: workshop.labels || [],
});

export const convertApiUserToUser = (
  apiUser: ApiUserResponse["users"][0]
): User => ({
  id: apiUser.id,
  first_name: apiUser.first_name,
  last_name: apiUser.last_name,
  fullName: `${apiUser.first_name} ${apiUser.last_name}`,
  email: apiUser.email,
  phone: apiUser.phone,
  nationalNumber: apiUser.national_id,
  profilePic: apiUser.profile_pic || "",
  password: apiUser.password,
  gender: apiUser.gender as "male" | "female",
  userType: apiUser.type as
    | "customer"
    | "workshopAdmin"
    | "worker"
    | "superadmin",
  labels: [],
  isActive: true,
  cars: [],
  createdAt: apiUser.created_at,
  updatedAt: apiUser.updated_at,
});
