'use client';
import React from 'react';

import Link from 'next/link';
import GoogleBtn from '../ui/custom-ui/GoogleBtn';
import CrossIcon from '@/assets/icons/form/x-cross.svg';

function LoginHomeClient() {
  return (
    <div className="border-elements-grey-300 flex w-[355px] flex-col border p-5 lg:w-[570px]">
      <Link
        href="/"
        className="hover:bg-icons-grey-50 mb-3 ml-auto flex cursor-pointer p-2 xl:mb-6"
      >
        <CrossIcon className="size-3 xl:size-4" />
      </Link>
      <div className="flex flex-col gap-5 px-7 pb-7 xl:gap-6 xl:px-11 xl:pb-11">
        <h3 className="title-h3">Ласкаво просимо</h3>
        <GoogleBtn />
        <div className="xl:placeholder-sm lg:placeholder-xs placeholder-small">
          <span>Продовжуючи, ви погоджуєтесь з </span>
          {/* "/terms */}
          <Link
            href="/terms"
            className="text-text-link leading-[140%] underline"
          >
            Політикою конфеденційності
          </Link>
          <span> та </span>

          <Link
            href="/privacy"
            className="text-text-link leading-[140%] underline"
          >
            Умовами використання
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginHomeClient;
