import React from 'react';
import type { Session } from '@supabase/supabase-js';

import IconUser from '@/assets/icons/general/icon-user.svg';
import Link from 'next/link';
// import FavoriteHeaderIcon from '@/assets/icons/general/favorite-header.svg';
import FavoriteHeaderIcon from '@/assets/icons/general/favorite-h.svg';

type LoginHeaderBtnProps = { session: Session | null };

function LoginHeaderBtn({ session }: LoginHeaderBtnProps) {
  return (
    <Link href="/login" className="flex items-center gap-1 lg:gap-2">
      <IconUser className="text-icons-grey-950 size-5" />
      {!session ? (
        <span className="placeholder-xs xl:placeholder-base lg:placeholder-sm">
          Вхід
        </span>
      ) : (
        <FavoriteHeaderIcon className="text-background-white h-5 w-4" />
      )}
    </Link>
  );
}

export default LoginHeaderBtn;
