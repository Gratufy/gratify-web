'use client';
import React from 'react';
import ThemeSwitch from '@/components/shared/ThemeSwitch';
import Link from 'next/link';
import GoogleBtn from '@/components/ui/GoogleBtn';
import Logout from '@/components/ui/Logout';
import { useUserStore } from '@/stores/useUserStore';
import Image from 'next/image';

function PublicHeader() {
  const session = useUserStore((s) => s.session);
  const isLoading = useUserStore((s) => s.isLoading);
  const user = useUserStore((s) => s.profile);
  // const error = useUserStore((s) => s.error);
  // if (isLoading) return <p>Загрузка...</p>;
  // if (!session) return null;
  return (
    <>
      <div className="border-muted-foreground bg-input dark:bg-background flex w-full flex-col items-center justify-center border-b py-8">
        <h1 className="mx-0 text-xl font-bold">Public Header</h1>
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
        <div className="gap-63 bg-background-main-50 container hidden items-center py-3 lg:flex">
          <div className="w-[169px] xl:w-[181px]">
            <Image
              src="/images/logo.png"
              width={181}
              height={38}
              alt="Logo"
              className="h-auto w-full"
            />
          </div>
          <div>input</div>
          <div>TEMA and LOGIN</div>
        </div>
        <div className="bg-background-main-50 flex w-full flex-col px-4 py-3 lg:hidden">
          <div className="container">
            {' '}
            <div>
              <div>
                <Image
                  src="/images/logo.png"
                  width={169}
                  height={35}
                  alt="Logo"
                />
              </div>
              <div>TEMA and LOGIN</div>
            </div>
            <div>input</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicHeader;
