"use client";

import { ReactNode, useEffect, useState } from "react";

interface ClientOnlyDevProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnlyDev({
  children,
  fallback = null,
}: ClientOnlyDevProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isDev) {
      setMounted(true);
    }
  }, [isDev]);

  if (!isDev) {
    return <>{children}</>;
  }

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
