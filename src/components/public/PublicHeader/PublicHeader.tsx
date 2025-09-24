'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import ThemeSwitch from '@/components/shared/ThemeSwitch';

import Image from 'next/image';

import InputSearch from './InputSearch';
import LoginHeaderBtn from './LoginHeaderBtn';
import FavoriteHeaderIcon from '@/assets/icons/general/favorite-h.svg';
import IconUser from '@/assets/icons/general/icon-user.svg';
import UserMenu from './UserMenu';
import BusinessMenu from '@/components/business/BusinessHeader/BusinessMenu';
import Link from 'next/link';

function PublicHeader() {
  const pathname = usePathname();
  // to highlight the current page in the menu if needed
  // const isHome = pathname === '/';
  // const isAbout = pathname === '/about';
  // const isContact = pathname === '/contact';
  const isFavorites = pathname === '/favorites';
  const session = useUserStore((s) => s.session);
  const user = useUserStore((s) => s.profile);
  return (
    <header className="bg-background-main-50 w-full">
      <div className="container hidden items-center py-3 lg:flex lg:justify-between">
        <div className="w-[169px] xl:w-[181px]">
          <Image
            src="/images/logo.png"
            width={181}
            height={38}
            alt="Logo"
            className="h-auto w-full"
          />
        </div>
        <InputSearch id="search-desktop" name="search-desktop" />
        {/* lg:gap-11 xl:gap-20 */}
        <div className="w-25 lg:w-34 xl:w-42 flex items-center justify-between">
          <ThemeSwitch />

          {session ? (
            // gap-1 lg:gap-3
            <div className="flex w-12 items-start justify-between">
              {user?.role === 'USER' && <UserMenu />}
              {user?.role === 'BUSINESS' && <BusinessMenu />}
              {user?.role === 'ADMIN' && (
                <IconUser className="text-icons-grey-950 size-5" />
              )}
              <Link href="/favorites">
                <FavoriteHeaderIcon
                  className={`text-background-white h-5 w-4 ${isFavorites ? 'text-icons-color-accent' : 'text-background-white'}`}
                />
              </Link>
            </div>
          ) : (
            <LoginHeaderBtn />
          )}
        </div>
      </div>
      {/* mobile */}
      <div className="bg-background-main-50 flex w-full flex-col px-4 py-3 lg:hidden">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <Image
                src="/images/logo.png"
                width={169}
                height={35}
                alt="Logo"
              />
            </div>
            <div className="w-25 flex items-center justify-between">
              <ThemeSwitch />

              {session ? (
                // gap-1 lg:gap-3
                <div className="flex w-12 items-start justify-between">
                  {user?.role === 'USER' && <UserMenu />}
                  {user?.role === 'BUSINESS' && <BusinessMenu />}
                  {user?.role === 'ADMIN' && (
                    <IconUser className="text-icons-grey-950 size-5" />
                  )}
                  <Link href="/favorites">
                    <FavoriteHeaderIcon className="text-background-white h-5 w-4" />
                  </Link>
                </div>
              ) : (
                <LoginHeaderBtn />
              )}
            </div>
          </div>

          <InputSearch id="search-mobile" name="search-mobile" />
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;
