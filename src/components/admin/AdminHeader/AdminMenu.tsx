import React from 'react';

import IconCategory from '@/assets/icons/menu/icon-category.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IconAdminUser from '@/assets/icons/general/icon-admin-user.svg';
import Link from 'next/link';
import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';
//import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

function AdminMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-hidden cursor-pointer border-none focus:ring-0">
          <IconAdminUser className="text-icons-grey-950 h-6 w-[18px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="xl:w-75 lg:w-65 w-50 border-icons-grey-400 shadow-menu rounded-none border"
        align="center"
        side="bottom"
      >
        <DropdownMenuLabel className="sr-only">Admin Account</DropdownMenuLabel>

        <DropdownMenuItem
          asChild
          className="text-text-950-grey cursor-pointer px-3 text-sm leading-[140%] lg:px-2 xl:text-base"
        >
          <Link href="/admin">
            <IconAdminUser className="mr-2 size-4 xl:mr-3 xl:size-5" />
            <span>Перейти до адмін-панелі</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="text-text-950-grey cursor-pointer px-3 text-sm leading-[140%] lg:px-2 xl:text-base"
        >
          <Link href="/admin/business">
            <IconModering className="mr-2 size-4 xl:mr-3 xl:size-5" />
            <span>Переглянути створені картки</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="xl:placeholder-base placeholder-sm cursor-pointer gap-0 px-3 lg:px-2"
        >
          <Link href="/admin/business/new">
            <IconCategory className="mr-2 size-4 xl:mr-3 xl:size-5" />
            <span>Створити бізнес-картку</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LogoutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminMenu;
