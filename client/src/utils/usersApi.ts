import { ApiUser, User } from "../types/types";
export const mapApiUserToFrontend = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  fullName: apiUser.first_name + " " + apiUser.last_name,
  email: apiUser.email,
  phone: apiUser.phone,
  nationalNumber: apiUser.national_id,
  profilePic:
    apiUser.profile_pic ||
    "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
  gender: (apiUser.gender.charAt(0).toUpperCase() + apiUser.gender.slice(1)) as
    | "Male"
    | "Female",
  userType: (apiUser.type.charAt(0).toUpperCase() + apiUser.type.slice(1)) as
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
});
