'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconCategory from '@/assets/icons/menu/icon-category.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import IconSettings from '@/assets/icons/admin/icon-setting.svg';
import IconMain from '@/assets/icons/admin/icon-main.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

import IconSidebar from '@/assets/icons/admin/icon-sidebar.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';

function AdminSidebarMobile() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="ml-auto mr-4 py-4">
          <IconSidebar className="size-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="bg-background-main-50 mt-[148px] flex flex-col"
      >
        <SheetHeader className="sr-only">
          <SheetTitle className="sr-only">Адміністративне меню</SheetTitle>
          <SheetDescription className="sr-only">
            Відкриття адміністративного меню навігації
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Link
              href="/admin"
              className={`admin-link ${pathname === '/admin' ? 'admin-link-active' : ''}`}
            >
              <IconMain className="size-5" />
              <span>Головна</span>
            </Link>
            <Link
              href="/admin/modering"
              className={`admin-link ${pathname === '/admin/modering' ? 'admin-link-active' : ''}`}
            >
              <IconModering className="size-5" />
              <span>Модерування</span>
            </Link>
            <Link
              href="/admin/categories"
              className={`admin-link ${pathname === '/admin/categories' ? 'admin-link-active' : ''}`}
            >
              <IconCategory className="size-5" />
              <span>Категорії</span>
            </Link>
            <Link
              href="/admin/review"
              className={`admin-link ${pathname === '/admin/review' ? 'admin-link-active' : ''}`}
            >
              <EditPen className="size-5" />
              <span>Відгуки</span>
            </Link>
            <Link
              href="/admin/settings"
              className={`admin-link ${pathname === '/admin/settings' ? 'admin-link-active' : ''}`}
            >
              <IconSettings className="size-5" />
              <span>Налаштування</span>
            </Link>
            <LogoutBtn customClassName="admin-link cursor-pointer" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AdminSidebarMobile;
