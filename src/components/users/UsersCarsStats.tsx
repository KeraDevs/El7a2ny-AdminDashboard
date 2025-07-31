import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarWithDetails } from "@/types/carTypes";
import { motion } from "framer-motion";
import { Car, Users, Wrench, Calendar } from "lucide-react";

export interface UsersCarsStatsProps {
  cars: CarWithDetails[];
}

export const UsersCarsStats: React.FC<UsersCarsStatsProps> = ({ cars }) => {
  const totalCars = cars.length;
  const turboCars = cars.filter((car) => car.turbo).length;
  const exoticCars = cars.filter((car) => car.exotic).length;
  const uniqueOwners = new Set(cars.map((car) => car.owner_id)).size;

  const stats = [
    {
      title: "Total Cars",
      value: totalCars.toString(),
      icon: Car,
      description: "All registered cars",
      trend: "+12.5%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Unique Owners",
      value: uniqueOwners.toString(),
      icon: Users,
      description: "Car owners",
      trend: "+8.2%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Turbo Cars",
      value: turboCars.toString(),
      icon: Wrench,
      description: "Turbocharged vehicles",
      trend: "+15.3%",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Exotic Cars",
      value: exoticCars.toString(),
      icon: Calendar,
      description: "Luxury vehicles",
      trend: "+5.7%",
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
