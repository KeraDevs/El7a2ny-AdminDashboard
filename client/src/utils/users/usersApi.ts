import { User, ApiUser } from "../../types/userTypes";

export const mapApiUserToFrontend = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,
  password: apiUser.password,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  fullName: `${apiUser.first_name} ${apiUser.last_name}`,
  phone: apiUser.phone,
  nationalNumber: apiUser.national_id,
  profilePic:
    apiUser.profile_pic ||
    "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
  gender: apiUser.gender.toLowerCase() as "male" | "female",
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
  vehicle: apiUser.vehicle
    ? {
        id: apiUser.vehicle.id,
        brand_id: apiUser.vehicle.brand_id,
        model: apiUser.vehicle.model,
        year: apiUser.vehicle.year,
        license_plate: apiUser.vehicle.license_plate,
        vin_number: apiUser.vehicle.vin_number,
        car_type: apiUser.vehicle.car_type,
        exotic: apiUser.vehicle.exotic,
        turbo: apiUser.vehicle.turbo,
      }
    : {
        id: null,
        brand_id: "",
        model: "",
        year: new Date().getFullYear(),
        license_plate: "",
        vin_number: "",
        car_type: "",
        exotic: false,
        turbo: false,
      },
});
