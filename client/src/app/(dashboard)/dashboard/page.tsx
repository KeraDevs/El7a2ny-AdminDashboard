"use client";

import { DashboardAnalytics } from "@/components/dashboard/DashboardAnalytics";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconClipboardList,
  IconCreditCard,
  IconSettings,
} from "@tabler/icons-react";
import { FaWrench } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Counter animation hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

// Dynamic location-based time component
function DynamicTime() {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState<{
    city: string;
    timezone: string;
  }>({
    city: "Loading...",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user's timezone automatically
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Extract city from timezone (e.g., "America/New_York" -> "New York")
    const getCityFromTimezone = (timezone: string) => {
      const parts = timezone.split("/");
      if (parts.length > 1) {
        return parts[parts.length - 1].replace(/_/g, " ");
      }
      return timezone;
    };

    // Try to get more accurate location using geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using a free geolocation API to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();

            setLocation({
              city:
                data.city || data.locality || getCityFromTimezone(userTimezone),
              timezone: userTimezone,
            });
          } catch (error) {
            // Fallback to timezone-based city name
            setLocation({
              city: getCityFromTimezone(userTimezone),
              timezone: userTimezone,
            });
          }
          setIsLoading(false);
        },
        () => {
          // If geolocation fails, use timezone-based city name
          setLocation({
            city: getCityFromTimezone(userTimezone),
            timezone: userTimezone,
          });
          setIsLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      // If geolocation is not supported
      setLocation({
        city: getCityFromTimezone(userTimezone),
        timezone: userTimezone,
      });
      setIsLoading(false);
    }

    // Update time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: location.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: location.timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-right"
    >
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Detecting location...
          </motion.div>
        ) : (
          `${location.city} Time`
        )}
      </div>
      <div className="text-lg font-bold font-mono">{formatTime(time)}</div>
      <div className="text-xs text-muted-foreground">{formatDate(time)}</div>
      {!isLoading && (
        <div className="text-xs text-muted-foreground/70 mt-1">
          {location.timezone}
        </div>
      )}
    </motion.div>
  );
}

// Stats card component
function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  change: string;
  icon: any;
  trend: "up" | "down";
}) {
  const animatedValue = useCounter(value, 1500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <motion.div
              className="text-2xl font-bold"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {animatedValue.toLocaleString()}
            </motion.div>
            <div className="flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <IconTrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <IconTrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={trend === "up" ? "text-green-500" : "text-red-500"}
              >
                {change}
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Function to get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 17) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get user's first name
  const getFirstName = () => {
    if (userData?.first_name) {
      return userData.first_name;
    } else if (userData?.fullName) {
      return userData.fullName.split(" ")[0];
    }
    return "Admin";
  };

  const stats = [
    {
      title: "Total Users",
      value: 1234,
      change: "+12.5%",
      icon: IconUsers,
      trend: "up" as const,
    },
    {
      title: "Total Workshops",
      value: 89,
      change: "+8.2%",
      icon: FaWrench,
      trend: "up" as const,
    },
    {
      title: "Total Requests",
      value: 567,
      change: "+15.3%",
      icon: IconClipboardList,
      trend: "up" as const,
    },
    {
      title: "Monthly Revenue",
      value: 45670,
      change: "-2.1%",
      icon: IconCreditCard,
      trend: "down" as const,
    },
  ];

  const activities = [
    {
      id: 1,
      title: "New workshop registered",
      description: "AutoCare Plus joined the platform",
      time: "2 minutes ago",
      type: "success",
    },
    {
      id: 2,
      title: "User payment completed",
      description: "Service payment of $245 processed",
      time: "15 minutes ago",
      type: "info",
    },
    {
      id: 3,
      title: "Service request approved",
      description: "Oil change request #1234 approved",
      time: "1 hour ago",
      type: "warning",
    },
    {
      id: 4,
      title: "System maintenance scheduled",
      description: "Scheduled for tonight at 2:00 AM",
      time: "3 hours ago",
      type: "default",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header with Dynamic Time */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            {getGreeting()}, {getFirstName()}! Welcome to Admin dashboard
          </p>
        </div>
        <DynamicTime />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Service Requests Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconSettings className="h-5 w-5 text-primary" />
                  Service Requests Overview
                </CardTitle>
                <CardDescription>
                  Real-time service request statistics
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                Live Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <motion.div
                  className="text-2xl font-bold text-green-600 dark:text-green-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  {useCounter(342)}
                </motion.div>
                <p className="text-sm text-green-600/80 dark:text-green-400/80">
                  Completed
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <motion.div
                  className="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  {useCounter(89)}
                </motion.div>
                <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80">
                  Pending
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <motion.div
                  className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.0, type: "spring" }}
                >
                  {useCounter(136)}
                </motion.div>
                <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                  In Progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="col-span-4"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Revenue Overview</span>
                <Badge variant="secondary" className="ml-auto">
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Monthly revenue trends and projections
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 200 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="w-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-muted-foreground relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-primary mb-2"
                  >
                    📊
                  </motion.div>
                  <p>Chart will be rendered here</p>
                  <p className="text-xs">Connect your analytics service</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="col-span-3"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        activity.type === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : activity.type === "info"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : activity.type === "warning"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {activity.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <motion.a
                href="#"
                whileHover={{ x: 5 }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                View all activity
                <span>→</span>
              </motion.a>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
