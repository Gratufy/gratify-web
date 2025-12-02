'use client';
import React from 'react';

import Link from 'next/link';
import GoogleBtn from '../ui/GoogleBtn';

function LoginHomeClient() {
  return (
    <div className="border-icons-grey-950 flex w-[355px] flex-col gap-5 border p-12 lg:w-[570px] xl:gap-6 xl:p-16">
      <h3 className="title-h3">Ласкаво просимо</h3>

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
