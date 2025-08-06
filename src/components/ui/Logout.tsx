"use client";
import React from "react";

import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { createClient } from "@/utils/supabase/client";

const Logout = () => {
  const clear = useUserStore((s) => s.clear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        console.error("Logout error:", error.message);
        //  toast / alert
        return;
      }

      clear();
    } catch (err) {
      console.error("Unexpected logout error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        //onClick={handleLogout}
        onClick={handleLogout}
        disabled={loading}
        className="flex cursor-pointer items-center gap-3 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-800 dark:text-gray-200 shadow hover:shadow-md transition"
      >
        {loading ? "Logging out..." : "Log out"}
      </button>
      {/* I change it later for TOAST */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Logout;
