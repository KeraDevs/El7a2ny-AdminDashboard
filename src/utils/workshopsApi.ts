import { Workshop } from "@/types/workshopTypes";
import { User } from "@/types/userTypes";
import { ApiUserResponse, ApiWorkshopsList } from "@/types/apiTypes";

export const mapApiWorkshopToFrontend = (
  apiWorkshop: ApiWorkshopsList
): Workshop => ({
  id: apiWorkshop.id,
  parentId: apiWorkshop.parent_id,
  ownerId: apiWorkshop.owner_id,
  name: apiWorkshop.name,
  address: apiWorkshop.address,
  latitude: apiWorkshop.latitude ? Number(apiWorkshop.latitude) : null,
  longitude: apiWorkshop.longitude ? Number(apiWorkshop.longitude) : null,
  profilePic: apiWorkshop.profile_pic,
  active_status: apiWorkshop.active_status as
    | "pending"
    | "active"
    | "deactivated",
  status: apiWorkshop.status.toLowerCase() as "open" | "busy" | "closed",
  createdAt: apiWorkshop.created_at,
  updatedAt: apiWorkshop.updated_at,
  users: apiWorkshop.users
    ? [
        {
          id: apiWorkshop.users.id,
          first_name: apiWorkshop.users.first_name,
          last_name: apiWorkshop.users.last_name,
          fullName: `${apiWorkshop.users.first_name} ${apiWorkshop.users.last_name}`,
          email: apiWorkshop.users.email,
          phone: apiWorkshop.users.phone,
          nationalNumber: apiWorkshop.users.national_id,
          profilePic: apiWorkshop.users.profile_pic || "",
          password: "", // Password not provided by API
          gender: apiWorkshop.users.gender as "male" | "female",
          userType: apiWorkshop.users.type as
            | "customer"
            | "workshopAdmin"
            | "worker"
            | "superadmin",
          labels: [],
          isActive: true,
          cars: [],
          createdAt: apiWorkshop.users.created_at,
          updatedAt: apiWorkshop.users.updated_at,
        },
      ]
    : [],
  phoneNumbers:
    apiWorkshop.phone_numbers?.map((phone) => ({
      id: phone.id,
      phone_number: phone.phone_number,
      type: phone.type,
      is_primary: phone.is_primary,
      is_verified: phone.is_verified,
    })) || [],
  services: [], // Services are not provided by the API
  labels: apiWorkshop.labels?.map((labelObj) => labelObj.label.name) || [],
  owner_id: apiWorkshop.owner_id,
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
