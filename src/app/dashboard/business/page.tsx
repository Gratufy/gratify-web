import React from "react";

import BusinessHomeClient from "@/components/business/BusinessHomeClient";

export default function BusinessHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Business Home Page
      </h1>

      <h2 className="text-xl font-bold mb-2">
        Список ВЛАСНИХ бізнесів with all status
      </h2>
      <BusinessHomeClient />
    </div>
  );
}
