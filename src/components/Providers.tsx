"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SWRProvider } from "@/components/SWRProvider";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <SWRProvider>
            <AuthProvider>
              <AdminProvider>
                {children}
                <Toaster position="top-center" richColors />
              </AdminProvider>
            </AuthProvider>
          </SWRProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
