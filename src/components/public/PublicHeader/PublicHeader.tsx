'use client';
import React from 'react';
import { useUserStore } from '@/stores/useUserStore';
import ThemeSwitch from '@/components/shared/ThemeSwitch';

import Image from 'next/image';

import InputSearch from './InputSearch';
import LoginHeaderBtn from './LoginHeaderBtn';

function PublicHeader() {
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
        <div className="flex items-center lg:gap-11 xl:gap-20">
          <ThemeSwitch />

          <LoginHeaderBtn session={session} />
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
            <div className="flex items-center gap-5">
              <ThemeSwitch />

              <LoginHeaderBtn session={session} />
            </div>
          </div>

          <InputSearch id="search-mobile" name="search-mobile" />
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;
