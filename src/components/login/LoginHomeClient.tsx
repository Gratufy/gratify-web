'use client';
import React from 'react';

import Link from 'next/link';
import GoogleBtn from '../ui/GoogleBtn';

function LoginHomeClient() {
  return (
    <div className="border-elements-grey-300 flex w-[355px] flex-col gap-5 border p-12 lg:w-[570px] xl:gap-6 xl:p-16">
      <h3 className="title-h3">Ласкаво просимо</h3>
      {/* <button className="flex cursor-pointer items-center border border-gray-950 px-5 py-3">
        <IconGoogle className="mr-3 size-4 xl:size-6" />
        <span className="xl:placeholder-base lg:placeholder-sm placeholder-xs">
          Продовжити з Google
        </span>
      </button> */}
      <GoogleBtn />
      <div className="xl:placeholder-sm lg:placeholder-xs placeholder-small">
        <span>Продовжуючи, ви погоджуєтесь з </span>
        {/* "/terms */}
        <Link href="/terms" className="text-text-link leading-[140%] underline">
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
  );
}

export default LoginHomeClient;
