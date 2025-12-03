import ThemeSwitch from '@/components/ui/custom-ui/ThemeSwitch';
import Link from 'next/link';
import React from 'react';

function AdminHeader() {
  return (
    <div className="border-muted-foreground bg-input dark:bg-background flex w-full flex-col items-center justify-center border-b py-8">
      <h1 className="mx-0 text-xl font-bold">Admin Header</h1>
      <nav className="flex items-center justify-center">
        <ul className="text-sidebar-accent-foreground flex items-center gap-10 text-lg font-semibold">
          <li>
            <Link href="/">START</Link>
          </li>
          <li>
            <Link href="/admin">Admin</Link>
          </li>
          <li>
            <Link href="/admin/business">Усі Businesses</Link>
          </li>
          <li>
            <Link href="/admin/review">Усі Reviews</Link>
          </li>
          <li>
            <Link href="/admin/category">Усі Categories</Link>
          </li>
          <li>
            <Link href="/admin/business/new">Form+</Link>
          </li>
        </ul>
      </nav>
      <ThemeSwitch />
    </div>
  );
}

export default AdminHeader;
