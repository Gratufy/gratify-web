import ThemeSwitch from '@/components/shared/ThemeSwitch';
import Link from 'next/link';
import React from 'react';

function FakeBusinessHeader() {
  return (
    <div className="border-muted-foreground bg-input dark:bg-background flex w-full flex-col items-center justify-center border-b py-8">
      <h1 className="mx-0 text-xl font-bold">Business Header</h1>
      <nav className="flex items-center justify-center">
        <ul className="text-sidebar-accent-foreground flex items-center gap-10 text-lg font-semibold">
          <li>
            <Link href="/">START</Link>
          </li>
          <li>
            <Link href="/dashboard/business">My Businesses</Link>
          </li>
          <li>
            <Link href="/dashboard/business/new">Form+</Link>
          </li>
        </ul>
      </nav>
      <ThemeSwitch />
    </div>
  );
}

export default FakeBusinessHeader;
