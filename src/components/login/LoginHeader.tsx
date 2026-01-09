'use client';
import React from 'react';
import ThemeSwitch from '@/components/ui/custom-ui/ThemeSwitch';

import Image from 'next/image';
import Link from 'next/link';
import { House } from 'lucide-react';

function LoginHeader() {
  return (
    <header className="bg-background-main-50 w-full">
      <div className="container py-3">
        <div className="flex w-full items-center justify-between px-4 lg:px-0">
          <div className="w-[169px] xl:w-[181px]">
            <Image
              src="/images/logo.png"
              width={181}
              height={38}
              alt="Логотип Gratify"
              className="h-auto w-full"
            />
          </div>
          {/* gap-5 lg:gap-11 xl:gap-20 */}
          <div className="w- w-25 lg:w-34 xl:w-42 flex items-center justify-between">
            <ThemeSwitch />

            <Link
              aria-label="перейти на головну сторинку"
              href="/"
              className="bg-icons-grey-50 flex w-8 items-center justify-center p-1.5"
            >
              <House size={20} absoluteStrokeWidth aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LoginHeader;
