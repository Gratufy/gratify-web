'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconCategory from '@/assets/icons/menu/icon-category.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import IconSettings from '@/assets/icons/admin/icon-setting.svg';
import IconMain from '@/assets/icons/admin/icon-main.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

import IconSidebar from '@/assets/icons/admin/icon-sidebar.svg';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  //   SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';
// import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

function AdminSidebarMobile() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  //   const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
        <SheetTrigger asChild>
          <button
            className="mr-auto py-2"
            aria-label="Відкрити меню адміністратора"
          >
            <IconSidebar className="size-6" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="bg-background-main-50 mt-[100px] flex flex-col"
        >
          <SheetHeader className="sr-only">
            <SheetTitle className="sr-only">Адміністративне меню</SheetTitle>
            <SheetDescription className="sr-only">
              Відкриття адміністративного меню навігації
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <SheetClose asChild>
                <Link
                  href="/admin"
                  className={`admin-link ${pathname === '/admin' ? 'admin-link-active' : ''}`}
                >
                  <IconMain className="size-5" />
                  <span>Головна</span>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/admin/modering"
                  className={`admin-link ${pathname === '/admin/modering' ? 'admin-link-active' : ''}`}
                >
                  <IconModering className="size-5" />
                  <span>Модерування</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/admin/categories"
                  className={`admin-link ${pathname === '/admin/categories' ? 'admin-link-active' : ''}`}
                >
                  <IconCategory className="size-5" />
                  <span>Категорії</span>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/admin/review"
                  className={`admin-link ${pathname === '/admin/review' ? 'admin-link-active' : ''}`}
                >
                  <EditPen className="size-5" />
                  <span>Відгуки</span>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/admin/settings"
                  className={`admin-link ${pathname === '/admin/settings' ? 'admin-link-active' : ''}`}
                >
                  <IconSettings className="size-5" />
                  <span>Налаштування</span>
                </Link>
              </SheetClose>

              {/* <SheetClose asChild> */}
              <LogoutBtn
                customClassName="admin-link cursor-pointer"
                // onRequestLogout={() => {
                //   setSheetOpen(false);
                //   setLogoutDialogOpen(true);
                // }}
              />
              {/* </SheetClose> */}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AdminSidebarMobile;
