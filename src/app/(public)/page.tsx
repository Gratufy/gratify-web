"use client";
import React from "react";
import { useUserStore } from "@/stores/useUserStore";
import DeleteAccountButton from "@/components/ui/DeleteAccountButton";

export default function PublicHome() {
  const user = useUserStore((s) => s.profile);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Public Home Page
      </h1>
      <p className="mb-1 text-lg">Тут будуть картки бізнесів та фільтри</p>
      <p className="mb-1 text-lg">З можливістю переходити на окрему картку</p>
      <p className="italic">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
      {user && <DeleteAccountButton />}
    </div>
  );
}
