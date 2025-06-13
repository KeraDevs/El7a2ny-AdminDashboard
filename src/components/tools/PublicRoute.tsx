"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthorized, loading, authInitialized } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!authInitialized) return;

    if (!loading && isAuthorized) {
      router.push("/dashboard");
    } else if (!loading) {
      setIsReady(true);
    }
  }, [isAuthorized, loading, router, authInitialized]);

  if (loading || !isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return !isAuthorized ? <>{children}</> : null;
}
