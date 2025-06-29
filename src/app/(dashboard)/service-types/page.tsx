"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ServiceType } from "@/types/serviceTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2 as Trash,
  Plus,
  RefreshCw,
  Settings,
} from "lucide-react";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";
import { DataPagination } from "@/components/ui/DataPagination";

// Mock data for service types
const mockServiceTypes: ServiceType[] = [
  {
    id: "1",
    name: "Oil Change",
    name_ar: "تغيير الزيت",
    description: "Complete engine oil and filter replacement",
    description_ar: "تغيير زيت المحرك والفلتر بالكامل",
    service_category: "maintenance",
    category: "Maintenance",
    basePrice: 250,
    price: 250,
    estimatedDuration: 45,
    percentageModifier: 0,
    requiresSpecialist: false,
    isActive: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    compatibleVehicleTypes: ["Sedan", "SUV", "Hatchback"],
    percentage: 0,
  },
  {
    id: "2",
    name: "Brake Service",
    name_ar: "خدمة الفرامل",
    description: "Brake pad replacement and system check",
    description_ar: "تغيير تيل الفرامل وفحص النظام",
    service_category: "repair",
    category: "Repair",
    basePrice: 800,
    price: 800,
    estimatedDuration: 120,
    percentageModifier: 15,
    requiresSpecialist: true,
    isActive: true,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    createdAt: "2024-01-02T00:00:00Z",
    compatibleVehicleTypes: ["Sedan", "SUV"],
    percentage: 15,
  },
  {
    id: "3",
    name: "Engine Diagnostics",
    name_ar: "فحص المحرك",
    description: "Complete engine diagnostic and analysis",
    description_ar: "فحص وتحليل المحرك الكامل",
    service_category: "diagnostic",
    category: "Diagnostic",
    basePrice: 150,
    price: 150,
    estimatedDuration: 60,
    percentageModifier: 5,
    requiresSpecialist: true,
    isActive: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    createdAt: "2024-01-03T00:00:00Z",
    compatibleVehicleTypes: ["Sedan", "SUV", "Hatchback", "Coupe"],
    percentage: 5,
  },
  {
    id: "4",
    name: "Tire Replacement",
    name_ar: "تغيير الإطارات",
    description: "Professional tire installation and balancing",
    description_ar: "تركيب الإطارات المهني والموازنة",
    service_category: "maintenance",
    category: "Maintenance",
    basePrice: 400,
    price: 400,
    estimatedDuration: 90,
    percentageModifier: 10,
    requiresSpecialist: false,
    isActive: false,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
    createdAt: "2024-01-04T00:00:00Z",
    compatibleVehicleTypes: ["Sedan", "SUV", "Hatchback"],
    percentage: 10,
  },
];

// Service Types Statistics Component
const ServiceTypesStats = ({
  serviceTypes,
}: {
  serviceTypes: ServiceType[];
}) => {
  const totalServices = serviceTypes.length;
  const activeServices = serviceTypes.filter((s) => s.isActive).length;
  const avgPrice =
    serviceTypes.reduce((sum, s) => sum + s.basePrice, 0) / totalServices;
  const specialistRequired = serviceTypes.filter(
    (s) => s.requiresSpecialist
  ).length;

  const stats = [
    {
      title: "Total Services",
      value: totalServices.toString(),
      description: "All service types",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Active Services",
      value: activeServices.toString(),
      description: "Currently available",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Average Price",
      value: `${Math.round(avgPrice)} EGP`,
      description: "Average service cost",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Specialist Required",
      value: specialistRequired.toString(),
      description: "Need specialist technicians",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
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
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const ServiceTypesPage = () => {
  const [serviceTypes] = useState<ServiceType[]>(mockServiceTypes);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      maintenance: "bg-blue-100 text-blue-800",
      repair: "bg-red-100 text-red-800",
      diagnostic: "bg-purple-100 text-purple-800",
      inspection: "bg-orange-100 text-orange-800",
    };
    return colors[category.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const filteredServiceTypes = useMemo(() => {
    return serviceTypes.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        service.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.isActive) ||
        (statusFilter === "inactive" && !service.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [serviceTypes, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredServiceTypes.length / itemsPerPage);
  const paginatedServiceTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServiceTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredServiceTypes, currentPage, itemsPerPage]);

  return (
    <div
      className="container mx-auto p-4 space-y-4 overflow-y-auto"
      style={{ scrollbarGutter: "stable" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Service Types Management
          </h1>
          <p className="text-muted-foreground">
            Manage your service types effectively.
          </p>
        </div>
      </motion.div>

      <ServiceTypesStats serviceTypes={serviceTypes} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search service types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setLoading(!loading)}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service Type
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Specialist Required</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Loading service types...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedServiceTypes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No service types found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedServiceTypes.map((service, index) => (
                      <motion.tr
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            {service.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {service.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(service.category)}>
                            {service.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">
                            {service.basePrice} EGP
                          </div>
                          {service.percentageModifier &&
                            service.percentageModifier > 0 && (
                              <div className="text-xs text-green-600">
                                +{service.percentageModifier}% modifier
                              </div>
                            )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {service.estimatedDuration} min
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              service.requiresSpecialist
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {service.requiresSpecialist ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={service.isActive ? "default" : "secondary"}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(service.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
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
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <DataPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredServiceTypes.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemType="service types"
            />
          </CardContent>
        </Card>
      </motion.div>

      <FloatingDownloadButton
        data={paginatedServiceTypes.map((service) => ({
          name: service.name,
          category: service.category,
          basePrice: service.basePrice.toString(),
          estimatedDuration: service.estimatedDuration.toString(),
          requiresSpecialist: service.requiresSpecialist ? "Yes" : "No",
          isActive: service.isActive ? "Active" : "Inactive",
          created_at: new Date(service.created_at).toLocaleDateString(),
        }))}
        filename="service-types"
        pageName="Service Types"
        headers={[
          { key: "name", label: "Service Name" },
          { key: "category", label: "Category" },
          { key: "basePrice", label: "Base Price (EGP)" },
          { key: "estimatedDuration", label: "Duration (min)" },
          { key: "requiresSpecialist", label: "Requires Specialist" },
          { key: "isActive", label: "Status" },
          { key: "created_at", label: "Created Date" },
        ]}
      />
    </div>
  );
};

export default ServiceTypesPage;
