"use client";

import { toast as sonnerToast } from "sonner";

export function Toaster({ position = "top-center" }: { position?: string }) {
  // Sonner is a global toast system, this is just a placeholder
  return null;
}

// Re-export toast for convenience
export { toast } from "sonner";
