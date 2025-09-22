'use client';
import React from 'react';
import ThemeSwitch from '@/components/shared/ThemeSwitch';
import Link from 'next/link';
import GoogleBtn from '@/components/ui/GoogleBtn';
import Logout from '@/components/ui/Logout';
import { useUserStore } from '@/stores/useUserStore';

function FakePublicHeader() {
  const session = useUserStore((s) => s.session);
  const isLoading = useUserStore((s) => s.isLoading);
  const user = useUserStore((s) => s.profile);
  // const error = useUserStore((s) => s.error);
  // if (isLoading) return <p>Загрузка...</p>;
  // if (!session) return null;
  return (
    <>
      <div className="border-muted-foreground bg-input dark:bg-background flex w-full flex-col items-center justify-center border-b py-8">
        <div className="flex w-full flex-col items-center justify-around lg:flex-row">
          <nav className="flex flex-col items-center justify-center">
            <ul className="text-sidebar-accent-foreground flex flex-col items-center gap-10 text-lg font-semibold lg:flex-row">
              <li>
                <Link href="/">START</Link>
              </li>
              <li>
                <Link href="/dashboard/business">Business</Link>
              </li>
              <li>
                <Link href="/admin">Admin</Link>
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
          {/* {isLoading && <p>Loading...</p>} */}
          {session && <p>{user?.email}</p>}
        </div>
        {/* xl:gap-63 lg:gap-42 */}
      </div>
    </>
  );
}

export default FakePublicHeader;
