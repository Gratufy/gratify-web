import React from 'react';

import Link from 'next/link';
// import FavoriteHeaderIcon from '@/assets/icons/general/favorite-header.svg';

import IconUser from '@/assets/icons/general/icon-user.svg';

function LoginHeaderBtn() {
  return (
    <Link
      href="/login"
      className="xl:w-15 flex w-12 items-center justify-between lg:w-14"
    >
      <IconUser className="text-icons-grey-950 size-5" />

      <span className="placeholder-xs xl:placeholder-base lg:placeholder-sm">
        Вхід
      </span>
    </Link>
  );
}

export default LoginHeaderBtn;
