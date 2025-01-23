import {
  Workshop,
  ApiWorkshopsList,
  PhoneNumber,
  ApiUserResponse,
  User,
} from "../types/types";

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
  activeStatus: apiWorkshop.active_status,
  status: apiWorkshop.status,
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
  active_status: workshop.activeStatus,
  phone_numbers:
    workshop.phoneNumbers?.map((phone) => ({
      phone_number: phone.phone_number,
      type: phone.type,
      is_primary: phone.is_primary,
    })) || [],
  services: workshop.services || [],
  labels: workshop.labels || [],
});

export const convertApiUserToUser = (
  apiUser: ApiUserResponse["users"][0]
): User => ({
  id: apiUser.id,
  email: apiUser.email,
  phone: apiUser.phone,
  nationalNumber: apiUser.national_id,
  profilePic: apiUser.profile_pic || "",
  gender: apiUser.gender as "Male" | "Female" | "Other",
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
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  fullName: `${apiUser.first_name} ${apiUser.last_name}`,
});
