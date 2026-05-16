// API client abstraction — swap localStorage for real API calls when backend is ready
// Every service method returns a Promise to match future async API calls

import type { Madrasa, User, MadrasaSubscription, PendingMadrasa } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Generic fetch wrapper — currently returns local data,
 * will be replaced with actual fetch calls when backend is ready.
 *
 * Usage:
 *   const data = await apiClient<Madrasa[]>("/madrasas");
 *   const result = await apiClient<Madrasa>("/madrasas/1", { method: "PUT", body: updated });
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  if (!API_BASE) {
    // No backend configured — this will be handled by individual services
    throw new Error(`No API configured. Endpoint: ${endpoint}`);
  }

  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}
