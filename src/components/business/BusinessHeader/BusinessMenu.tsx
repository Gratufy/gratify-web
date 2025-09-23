import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IconBusinessUser from '@/assets/icons/general/icon-business-user.svg';
import Link from 'next/link';
import LogoutBtn from '@/components/ui/LogoutBtn';
import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

function BusinessMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-hidden cursor-pointer border-none focus:ring-0">
          <IconBusinessUser className="text-icons-grey-950 h-6 w-[18px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="bottom">
        <DropdownMenuLabel className="sr-only">
          Business Account
        </DropdownMenuLabel>

        <DropdownMenuGroup className="p-3">
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-base leading-[140%]"
          >
            <Link href="/dashboard/business/new">Створити бізнес-картку</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-base leading-[140%]"
          >
            <Link href="/dashboard/business">
              Переглянути створені карточки
            </Link>
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

export default BusinessMenu;
