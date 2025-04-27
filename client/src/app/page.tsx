"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";

export default function HomePage() {
  const { isAuthorized, loading, authInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authInitialized) return;

    if (!loading) {
      if (isAuthorized) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthorized, loading, router, authInitialized]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading Dashboard...</p>
      </div>
    </div>
  );
}
