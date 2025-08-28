import React from "react";
import PublicHomeClient from "@/components/public/PublicHomeClient";

export default function PublicHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Public Home Page
      </h1>

      <PublicHomeClient />
    </div>
  );
}
