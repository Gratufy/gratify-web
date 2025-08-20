"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const clear = useUserStore((s) => s.clear);
  const setError = useUserStore((s) => s.setError);

  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const confirmed = window.confirm("Confirm account deletion?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error: ${text}`);
      }
      // const supabase = createClient();
      // await supabase.auth.signOut();
      clear();
      queryClient.clear();
      alert("Your account has been successfully deleted.");
      router.push("/"); // or wherever you want to redirect
    } catch (err) {
      console.error("Error deleting account:", err);
      if (err instanceof Error) {
        setError(err.message);
        alert(err.message);
      } else {
        setError("Unknown error");
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 cursor-pointer mt-2 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Account"}
    </button>
  );
}
