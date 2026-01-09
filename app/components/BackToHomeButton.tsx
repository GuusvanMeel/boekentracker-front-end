"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackToHomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="p-2 bg-white rounded-xl shadow-md"
    >
      <ChevronLeft className="w-6 h-6 text-blue-600" />
    </button>
  );
}
