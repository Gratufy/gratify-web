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
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="sr-only">My Account</DropdownMenuLabel>

        <DropdownMenuGroup className="p-3">
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-base leading-[140%]"
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
