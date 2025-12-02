import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IconAdminUser from '@/assets/icons/general/icon-admin-user.svg';
import Link from 'next/link';
import LogoutBtn from '@/components/ui/LogoutBtn';
//import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

function AdminMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-hidden cursor-pointer border-none focus:ring-0">
          <IconAdminUser className="text-icons-grey-950 h-6 w-[18px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="lg:w-55 w-50" align="start" side="bottom">
        <DropdownMenuLabel className="sr-only">Admin Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          {/* <DropdownMenuItem
            asChild
            className="text-text-950-grey cursor-pointer px-3 text-sm leading-[140%] lg:px-2 xl:text-base"
          >
            <Link href="/admin/business/new">Створити бізнес-картку</Link>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem
            asChild
            className="text-text-950-grey cursor-pointer px-3 text-sm leading-[140%] lg:px-2 xl:text-base"
          >
            <Link href="/dashboard/business">
              Переглянути створені карточки
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            asChild
            className="text-text-950-grey cursor-pointer px-3 text-sm leading-[140%] lg:px-2 xl:text-base"
          >
            <Link href="/admin">Перейти до адмін-панелі</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LogoutBtn />
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <DeleteAccountButton />
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminMenu;
