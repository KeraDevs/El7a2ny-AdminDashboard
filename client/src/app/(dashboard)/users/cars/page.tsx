"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Vehicle, CarBrand } from "@/types/vehicleTypes";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Car,
  Settings,
  TrendingUp,
  Calendar,
  Star,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { FaCar, FaCarSide, FaTools, FaChartLine } from "react-icons/fa";
import { SiToyota, SiBmw, SiHonda, SiMercedes, SiNissan } from "react-icons/si";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconRefresh as TablerRefresh } from "@tabler/icons-react";

// Mock data for cars
const mockCars: Vehicle[] = [
  {
    id: "1",
    brand_id: "toyota_001",
    model: "Camry",
    year: 2023,
    license_plate: "ABC-1234",
    vin_number: "1HGBH41JXMN109186",
    car_type: "Sedan",
    turbo: false,
    exotic: false,
  },
  {
    id: "2",
    brand_id: "bmw_001",
    model: "X5",
    year: 2022,
    license_plate: "XYZ-5678",
    vin_number: "WBAFR9C50BC123456",
    car_type: "SUV",
    turbo: true,
    exotic: true,
  },
  {
    id: "3",
    brand_id: "honda_001",
    model: "Civic",
    year: 2021,
    license_plate: "DEF-9012",
    vin_number: "19XFC2F59CE012345",
    car_type: "Hatchback",
    turbo: false,
    exotic: false,
  },
  {
    id: "4",
    brand_id: "mercedes_001",
    model: "C-Class",
    year: 2024,
    license_plate: "GHI-3456",
    vin_number: "WDDGF4HB0CA123456",
    car_type: "Sedan",
    turbo: true,
    exotic: true,
  },
  {
    id: "5",
    brand_id: "nissan_001",
    model: "Altima",
    year: 2020,
    license_plate: "JKL-7890",
    vin_number: "1N4AL3AP0LC123456",
    car_type: "Sedan",
    turbo: false,
    exotic: false,
  },
];

// Cars Statistics Component
const CarsStats = ({ cars }: { cars: Vehicle[] }) => {
  const totalCars = cars.length;
  const turboCars = cars.filter((c) => c.turbo).length;
  const exoticCars = cars.filter((c) => c.exotic).length;
  const recentCars = cars.filter((c) => c.year >= 2022).length;
  const stats = [
    {
      title: "Total Cars",
      value: totalCars.toString(),
      icon: Car,
      description: "All registered vehicles",
      trend: "+15.2%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Turbo Cars",
      value: turboCars.toString(),
      icon: FaTools,
      description: "Turbocharged vehicles",
      trend: "+8.7%",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
    },
    {
      title: "Exotic Cars",
      value: exoticCars.toString(),
      icon: Star,
      description: "Luxury vehicles",
      trend: "+12.3%",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Recent Models",
      value: recentCars.toString(),
      icon: Calendar,
      description: "2022 and newer",
      trend: "+23.1%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`border-0 shadow-md bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className="text-xs text-green-600 font-medium">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Vehicle[]>(mockCars);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const getBrandName = (brandId: string) => {
    const brandMap: { [key: string]: string } = {
      toyota_001: "Toyota",
      bmw_001: "BMW",
      honda_001: "Honda",
      mercedes_001: "Mercedes-Benz",
      nissan_001: "Nissan",
    };
    return brandMap[brandId] || "Unknown";
  };

  const getBrandIcon = (brandId: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      toyota_001: SiToyota,
      bmw_001: SiBmw,
      honda_001: SiHonda,
      mercedes_001: SiMercedes,
      nissan_001: SiNissan,
    };
    return iconMap[brandId] || FaCar;
  };

  const getCarTypeColor = (carType: string) => {
    const colors: { [key: string]: string } = {
      Sedan: "bg-blue-100 text-blue-800",
      SUV: "bg-green-100 text-green-800",
      Hatchback: "bg-purple-100 text-purple-800",
      Coupe: "bg-orange-100 text-orange-800",
      Convertible: "bg-pink-100 text-pink-800",
    };
    return colors[carType] || "bg-gray-100 text-gray-800";
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getBrandName(car.brand_id)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        car.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.vin_number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || car.car_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [cars, searchQuery, typeFilter]);

  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCars.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCars, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredCars.length / rowsPerPage);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Cars data refreshed");
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Cars Management
          </h1>
          <p className="text-muted-foreground">
            Manage vehicle inventory and information
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <TablerRefresh
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      <CarsStats cars={cars} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Cars List
                </CardTitle>
                <CardDescription>
                  View and manage all registered vehicles
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Convertible">Convertible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-muted-foreground mt-2">
                          Loading cars...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : paginatedCars.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No cars found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCars.map((car, index) => (
                      <TableRow
                        key={car.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 transition-all duration-300"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              {(() => {
                                const IconComponent = getBrandIcon(
                                  car.brand_id
                                );
                                return (
                                  <IconComponent className="h-5 w-5 text-white" />
                                );
                              })()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {getBrandName(car.brand_id)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {car.model}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {car.year}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            {car.license_plate}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCarTypeColor(car.car_type)}>
                            {car.car_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {car.turbo && (
                              <Badge
                                variant="outline"
                                className="text-red-600 border-red-200"
                              >
                                <FaTools className="h-3 w-3 mr-1" />
                                Turbo
                              </Badge>
                            )}
                            {car.exotic && (
                              <Badge
                                variant="outline"
                                className="text-purple-600 border-purple-200"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Exotic
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {car.vin_number.slice(0, 8)}...
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Car
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * rowsPerPage + 1} to
                  {Math.min(currentPage * rowsPerPage, filteredCars.length)} of
                  {filteredCars.length} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Cars;
