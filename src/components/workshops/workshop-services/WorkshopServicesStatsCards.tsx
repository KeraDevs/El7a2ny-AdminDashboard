import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Settings, Percent, Building } from "lucide-react";
import { WorkshopServicesStats } from "@/types/workshopServiceTypes";

interface WorkshopServicesStatsProps {
  stats: WorkshopServicesStats;
  loading?: boolean;
}

export const WorkshopServicesStatsCards: React.FC<
  WorkshopServicesStatsProps
> = ({ stats, loading = false }) => {
  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const statCards = [
    {
      title: "Total Services",
      value: stats.totalServices,
      icon: Settings,
      color: "blue",
      bgColor:
        "from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20",
      iconColor: "text-blue-600",
      textColor: "text-blue-700 dark:text-blue-400",
      valueColor: "text-blue-800 dark:text-blue-300",
    },
    {
      title: "Average Percentage",
      value: formatPercentage(stats.averagePercentage),
      icon: Percent,
      color: "purple",
      bgColor:
        "from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20",
      iconColor: "text-purple-600",
      textColor: "text-purple-700 dark:text-purple-400",
      valueColor: "text-purple-800 dark:text-purple-300",
      isPercentage: true,
    },
    {
      title: "Workshops with Services",
      value: stats.workshopsWithServices,
      icon: Building,
      color: "orange",
      bgColor:
        "from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20",
      iconColor: "text-orange-600",
      textColor: "text-orange-700 dark:text-orange-400",
      valueColor: "text-orange-800 dark:text-orange-300",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card
            className={`border-0 shadow-lg bg-gradient-to-br ${card.bgColor}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm font-medium ${card.textColor}`}>
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.valueColor}`}>
                {card.isPercentage
                  ? card.value
                  : typeof card.value === "number"
                  ? card.value.toLocaleString()
                  : card.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
