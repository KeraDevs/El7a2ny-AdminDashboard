"use client";
import { LoginForm } from "@/components/login/login-form";
import PublicRoute from "@/components/tools/PublicRoute";
import Image from "next/image";

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center gap-3 self-center font-medium text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <Image
                src="/images/logo.png"
                alt="El7a2ny Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            El7a2ny Admin Dashboard
          </div>
          <LoginForm />
        </div>
      </div>
    </PublicRoute>
  );
}
