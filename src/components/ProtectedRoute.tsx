"use client";

import React, { ReactNode, useEffect } from "react";
import { useUser } from "../store/UserContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user?.email) {
      router.replace(redirectPath);
    }
  }, [user, loading, redirectPath, router]);

  if (loading || !user?.email) return null;

  return <>{children}</>;
}
