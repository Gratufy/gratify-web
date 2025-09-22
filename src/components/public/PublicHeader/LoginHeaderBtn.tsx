import React from 'react';

import IconUser from '@/assets/icons/general/icon-user.svg';
import Link from 'next/link';

function LoginHeaderBtn() {
  return (
    <Link href="/login" className="flex items-center gap-1 lg:gap-2">
      <IconUser className="text-icons-grey-950 size-5" />
      <span className="placeholder-xs xl:placeholder-base lg:placeholder-sm">
        Вхід
      </span>
    </Link>
  );
}

export default LoginHeaderBtn;
