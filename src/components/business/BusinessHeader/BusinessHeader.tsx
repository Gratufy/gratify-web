import Link from "next/link";
import React from "react";

function BusinessHeader() {
  return (
    <div className="border-black/10 border-b bg-gray-200 py-8 w-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mx-0">Business Header</h1>
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
              My Businesses
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/business/new"
              className="text-gray-600 hover:text-gray-900"
            >
              Form+
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BusinessHeader;
