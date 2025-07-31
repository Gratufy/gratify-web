import Link from "next/link";
import React from "react";

function PublicHeader() {
  return (
    <div className="border-black/10 border-b bg-gray-200 py-8 w-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mx-0">Public Header</h1>
      <nav className="flex items-center justify-center">
        <ul className="flex items-center gap-10 ">
          <li>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              START
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/business"
              className="text-gray-600 hover:text-gray-900"
            >
              Business
            </Link>
          </li>
          <li>
            <Link href="admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          </li>
          <li>
            <Link
              href="/favorites"
              className="text-gray-600 hover:text-gray-900"
            >
              User_Favorites
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-gray-900"
            >
              User_Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PublicHeader;
