import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Switch,
  FormControlLabel,
  Typography,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { User, AddUserFormProps } from "../../../types/userTypes";
import { API_KEY, VITE_API_RAIL_WAY } from "@config/config";
import { useAuth } from "src/contexts/AuthContext";
import { CarBrand } from "../../../types/vehicleTypes";
const AddUserForm: React.FC<AddUserFormProps> = ({
  user,
  onSubmit,
  onClose,
  loading,
}) => {
  const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
  const [labelInput, setLabelInput] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [firebaseData, setFirebaseData] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState<Partial<User>>({
    id: user?.id || "",
    first_name: user?.first_name || user?.fullName.split(" ")[0],
    last_name: user?.last_name || user?.fullName.split(" ").slice(1).join(" "),
    email: "",
    password: "",
    phone: "",
    nationalNumber: "",
    gender: user?.gender || "male",
    userType: user?.userType || "worker",
    isActive: true,
    labels: user?.labels || [],
    vehicle: user?.vehicle
      ? {
          id: user.vehicle.id || "",
          brand_id: user.vehicle.brand_id || "",
          model: user.vehicle.model || "",
          year: user.vehicle.year || new Date().getFullYear(),
          license_plate: user.vehicle.license_plate || "",
          vin_number: user.vehicle.vin_number || "",
          car_type: user.vehicle.car_type || "",
          turbo: Boolean(user.vehicle.turbo),
          exotic: Boolean(user.vehicle.exotic),
        }
      : {
          id: "",
          brand_id: "",
          model: "",
          year: new Date().getFullYear(),
          license_plate: "",
          vin_number: "",
          car_type: "",
          turbo: false,
          exotic: false,
        },
  });
  const getAuth = useAuth();

  const token = getAuth.currentUser?.getIdToken();

  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const response = await fetch(`${VITE_API_RAIL_WAY}/car/brands`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${await token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch car brands");
        }

        const data = await response.json();
        setCarBrands(data);
      } catch (error) {
        console.error("Error fetching car brands:", error);
      }
    };

    fetchCarBrands();
  }, []);

  const handleCheckboxChange =
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [fieldName]: event.target.checked,
        } as User["vehicle"],
      }));
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLabelAdd = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && labelInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        labels: [...(prev.labels || []), labelInput.trim()],
      }));
      setLabelInput("");
    }
  };
  const handleDeleteLabel = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels?.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldName = name.split(".")[1];

    setFormData((prev) => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [fieldName]:
          type === "number"
            ? Number(value)
            : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
      } as User["vehicle"],
    }));
  };
  const handleBrandChange = (e: SelectChangeEvent<string>) => {
    const brandId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      vehicle: {
        ...(prev.vehicle || {}),
        brand_id: brandId,
      } as User["vehicle"],
    }));
  };

  const handleFirebaseRegistration = async () => {
    try {
      const response = await fetch(`${VITE_API_RAIL_WAY}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(firebaseData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Firebase registration error response:", errorData);
        throw new Error("Firebase registration failed");
      }

      const firebaseResult = await response.json();
      console.log("Firebase registration response:", firebaseResult);

      const newUserToken = firebaseResult.token;
      console.log(newUserToken);

      setFormData((prev) => ({
        ...prev,
        email: firebaseData.email,
        id: newUserToken,
      }));

      setActiveStep(1);
    } catch (error) {
      console.error("Firebase registration error:", error);
    }
  };

  const handleBackendRegistration = async () => {
    try {
      const backendData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        national_id: formData.nationalNumber,
        phone: formData.phone,
        gender: formData.gender || "male",
        type: formData.userType,
        profile_pic:
          formData.profilePic ||
          "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
        vehicle: {
          brand_id: formData.vehicle?.brand_id,
          model: formData.vehicle?.model,
          year: formData.vehicle?.year || 0,
          license_plate: formData.vehicle?.license_plate,
          vin_number: formData.vehicle?.vin_number,
          car_type: formData.vehicle?.car_type,
          turbo: formData.vehicle?.turbo || false,
          exotic: formData.vehicle?.exotic || false,
        },
      };
      console.log(formData.id);
      const response = await fetch(`${VITE_API_RAIL_WAY}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${formData.id}`,
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response data:", errorData);
        throw new Error(
          errorData?.message ||
            `Backend registration failed: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Registration successful:", responseData);
      onSubmit(formData);
    } catch (error) {
      console.error("Backend registration error:", error);
      throw error;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Firebase Registration</StepLabel>
        </Step>
        <Step>
          <StepLabel>User Details</StepLabel>
        </Step>
      </Stepper>

      {activeStep === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={firebaseData.email}
            onChange={(e) =>
              setFirebaseData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={firebaseData.password}
            onChange={(e) =>
              setFirebaseData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onClose} variant="outlined" disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleFirebaseRegistration}
              disabled={loading}
            >
              Next
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            name="FirstName"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="Last Name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="nationalNumber"
            label="National ID"
            value={formData.nationalNumber}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              id="gender"
              label="Gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: e.target.value as "male" | "female",
                }))
              }
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>User Type</InputLabel>
            <Select
              id="userType"
              label="User Type"
              value={formData.userType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  userType: e.target.value as
                    | "customer"
                    | "worker"
                    | "superadmin"
                    | "workshopAdmin",
                }))
              }
            >
              <MenuItem value="customer">customer</MenuItem>
              <MenuItem value="worker">worker</MenuItem>
              <MenuItem value="superadmin">superadmin</MenuItem>
              <MenuItem value="workshopAdmin">workshopAdmin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Add Labels"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={handleLabelAdd}
            helperText="Press Enter to add labels"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {formData.labels?.map((label, index) => (
              <Chip
                key={index}
                label={label}
                onDelete={() => handleDeleteLabel(index)}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>

          {/* Vehicle Information */}
          {formData.userType === "customer" ? (
            <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Vehicle Information
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Brand</InputLabel>
                <Select
                  name="vehicle.brand_id"
                  value={formData.vehicle?.brand_id || ""}
                  onChange={handleBrandChange}
                >
                  {carBrands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                name="vehicle.model"
                label="Vehicle Model"
                value={formData.vehicle?.model || ""}
                onChange={handleVehicleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                name="vehicle.license_plate"
                label="License Plate"
                value={formData.vehicle?.license_plate || ""}
                onChange={handleVehicleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                name="vehicle.vin_number"
                label="VIN Number"
                value={formData.vehicle?.vin_number || ""}
                onChange={handleVehicleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="number"
                name="vehicle.year"
                label="Year"
                value={formData.vehicle?.year || ""}
                onChange={handleVehicleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                name="vehicle.car_type"
                label="Car Type"
                value={formData.vehicle?.car_type || ""}
                onChange={handleVehicleChange}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.vehicle?.turbo || false}
                      onChange={handleCheckboxChange("turbo")}
                    />
                  }
                  label="Turbo"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.vehicle?.exotic || false}
                      onChange={handleCheckboxChange("exotic")}
                    />
                  }
                  label="Exotic"
                />
              </Box>
            </Box>
          ) : null}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={() => setActiveStep(0)}
              variant="outlined"
              disabled={loading}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleBackendRegistration}
              disabled={loading}
            >
              Register User
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AddUserForm;
