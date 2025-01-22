import { Key } from "react";

export interface Vehicle {
  id: Key | null | undefined;
  brand_id: string;
  model: string;
  year: number;
  license_plate: string;
  vin_number: string;
  car_type: string;
  turbo: boolean;
  exotic: boolean;
}

export interface CarBrand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  brand_regions: Array<{
    id: string;
    brand_id: string;
    region_id: string;
    created_at: string;
    updated_at: string;
    region: {
      id: string;
      name: string;
      created_at: string;
      updated_at: string;
    };
  }>;
}
