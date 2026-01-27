import React from 'react';
import Link from 'next/link';

import IconUser from '@/assets/icons/general/icon-user.svg';

function LoginHeaderBtn() {
  return (
    <Link
      href="/login"
      className="xl:w-17 hover-focus-card-dark flex w-14 items-center justify-between px-1 py-[6px] lg:w-16"
    >
      <IconUser className="text-icons-grey-950 size-5" />

      <span className="placeholder-xs xl:placeholder-base lg:placeholder-sm">
        Вхід
      </span>
    </Link>
  );
}

export default LoginHeaderBtn;
