import ThemeSwitch from "@/components/shared/ThemeSwitch";
import Link from "next/link";
import React from "react";

function UserHeader() {
  return (
    <div className="border-muted-foreground bg-input dark:bg-background border-b  py-8 w-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mx-0">User Header</h1>
      <nav className="flex items-center justify-center">
        <ul className="flex items-center gap-10 text-lg font-semibold text-sidebar-accent-foreground ">
          <li>
            <Link href="/">START</Link>
          </li>
          <li>
            <Link href="/favorites">My_Favorites</Link>
          </li>
          <li>
            <Link href="/settings">My_Settings</Link>
          </li>
        </ul>
      </nav>
      <ThemeSwitch />
    </div>
  );
}

export default UserHeader;
