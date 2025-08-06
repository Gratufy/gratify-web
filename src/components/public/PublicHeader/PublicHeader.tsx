"use client";
import React from "react";
import ThemeSwitch from "@/components/shared/ThemeSwitch";
import Link from "next/link";
import GoogleBtn from "@/components/ui/GoogleBtn";
import Logout from "@/components/ui/Logout";
import { useUserStore } from "@/stores/useUserStore";

function PublicHeader() {
  const session = useUserStore((s) => s.session);
  const isLoading = useUserStore((s) => s.isLoading);
  const user = useUserStore((s) => s.profile);
  // const error = useUserStore((s) => s.error);
  // if (isLoading) return <p>Загрузка...</p>;
  // if (!session) return null;
  return (
    <div className="border-muted-foreground border-b bg-input dark:bg-background py-8 w-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mx-0">Public Header</h1>
      <div className="flex justify-around items-center w-full ">
        <nav className="flex items-center justify-center">
          <ul className="flex items-center gap-10 text-lg font-semibold text-sidebar-accent-foreground ">
            <li>
              <Link href="/">START</Link>
            </li>
            <li>
              <Link href="/dashboard/business">Business</Link>
            </li>
            <li>
              <Link href="admin">Admin</Link>
            </li>
            <li>
              <Link href="/favorites" className="">
                User_Favorites
              </Link>
            </li>
            <li>
              <Link href="/settings" className="">
                User_Settings
              </Link>
            </li>
          </ul>
        </nav>
        <ThemeSwitch />
        {!session ? <GoogleBtn /> : <Logout />}
        {isLoading && <p>Loading...</p>}
        {session && <p>{user?.email}</p>}
      </div>
    </div>
  );
}

export default PublicHeader;
