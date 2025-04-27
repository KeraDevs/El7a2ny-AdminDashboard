"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const isPublicRoute = pathname === "/login";

  useEffect(() => {
    if (!loading && !currentUser && !isPublicRoute) {
      setShouldRedirect(true);
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentUser, loading, router, isPublicRoute]);

  if (shouldRedirect) {
    return (
      <div className="flex h-screen items-center justify-center text-center px-4">
        <p className="text-muted-foreground text-sm">
          Kindly login to access this page. Redirecting to login...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
