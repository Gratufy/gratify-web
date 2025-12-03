import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IconUser from '@/assets/icons/general/icon-user.svg';
import IconCategory from '@/assets/icons/menu/icon-category.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import Link from 'next/link';
import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';
import DeleteAccountButton from '@/components/ui/custom-ui/DeleteAccountButton';

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-hidden cursor-pointer border-none focus:ring-0">
          <IconUser className="text-icons-grey-950 size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // shadow-menu border-icons-grey-400 border
        className="xl:w-75 lg:w-65 w-50 border-icons-grey-400 shadow-menu rounded-none border"
        align="center"
        side="bottom"
      >
        <DropdownMenuLabel className="sr-only">My Account</DropdownMenuLabel>

        <DropdownMenuItem
          asChild
          className="placeholder-sm xl:placeholder-base cursor-pointer gap-0 px-3 lg:px-2"
        >
          <Link href="/business/new">
            <IconCategory className="mr-2 size-4 xl:mr-3 xl:size-5" />
            <span>Створити бізнес-картку</span>у
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LogoutBtn />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteAccountButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
