"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Car, MapPin, Settings, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CarsOverview: React.FC = () => {
  const modules = [
    {
      title: "Car Brands",
      description: "Manage car brands, their details and availability",
      icon: Car,
      href: "/cars/brands",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      features: [
        "Add and edit car brands",
        "Manage brand details",
        "Control availability",
        "View brand statistics",
      ],
    },
    {
      title: "Car Regions",
      description: "Manage car regions and geographical classifications",
      icon: MapPin,
      href: "/cars/regions",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      features: [
        "Add and edit regions",
        "Manage geographical data",
        "Control region availability",
        "View region analytics",
      ],
    },
    {
      title: "Settings",
      description: "Configure car management settings and preferences",
      icon: Settings,
      href: "/cars/settings",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      features: [
        "Brand-Region associations",
        "Import/Export data",
        "System preferences",
        "Advanced configurations",
      ],
    },
    {
      title: "Analytics",
      description: "View comprehensive analytics and reports",
      icon: BarChart3,
      href: "/cars/analytics",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      features: [
        "Brand performance metrics",
        "Region distribution",
        "Usage statistics",
        "Trend analysis",
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cars Management</h1>
          <p className="text-muted-foreground">
            Manage car brands, regions and their relationships
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`border-0 shadow-md bg-gradient-to-br ${module.bgColor} hover:shadow-lg transition-all duration-300 h-full`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${module.color}`}
                    >
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-4">
                  {module.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-current rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={module.href}>
                  <Button
                    className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 transition-opacity`}
                  >
                    Manage {module.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/cars/brands">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Add New Brand
                </Button>
              </Link>
              <Link href="/cars/regions">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Add New Region
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Brands Service</span>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Regions Service</span>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>No recent activity</div>
              <div className="text-xs">
                Activity will appear here when you start managing cars
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarsOverview;
