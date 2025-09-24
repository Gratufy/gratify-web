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
import Link from 'next/link';
import LogoutBtn from '@/components/ui/LogoutBtn';
import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

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
        className="lg:w-55 w-50"
        align="start"
        side="bottom"
      >
        <DropdownMenuLabel className="sr-only">My Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="text-text-950-grey cursor-pointer px-3 text-sm leading-[140%] lg:px-2 xl:text-base"
          >
            <Link href="/business/new">Створити бізнес-картку</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LogoutBtn />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteAccountButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
