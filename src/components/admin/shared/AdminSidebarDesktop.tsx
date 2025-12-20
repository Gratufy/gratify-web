'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconCategory from '@/assets/icons/menu/icon-category.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import IconSettings from '@/assets/icons/admin/icon-setting.svg';
import IconMain from '@/assets/icons/admin/icon-main.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';

function AdminSidebarDesktop() {
  const pathname = usePathname();

  return (
    <nav className="lg:w-65 xl:w-100 bg-background-main-50 min-h-screen lg:gap-8 lg:pb-8 lg:pl-[50px] lg:pt-3 xl:pl-[100px]">
      {/*isactive background-main-100 text-text-800-main */}
      <Link
        href="/admin"
        className={`admin-link ${pathname === '/admin' ? 'admin-link-active' : ''}`}
      >
        <IconMain className="lg:size-5 xl:size-6" />
        <span>Головна</span>
      </Link>
      <Link
        href="/admin/modering"
        className={`admin-link ${pathname === '/admin/modering' ? 'admin-link-active' : ''}`}
      >
        <IconModering className="lg:size-5 xl:size-6" />
        <span>Модерування</span>
      </Link>
      <Link
        href="/admin/categories"
        className={`admin-link ${pathname === '/admin/categories' ? 'admin-link-active' : ''}`}
      >
        <IconCategory className="lg:size-5 xl:size-6" />
        <span>Категорії</span>
      </Link>
      <Link
        href="/admin/review"
        className={`admin-link ${pathname === '/admin/review' ? 'admin-link-active' : ''}`}
      >
        <EditPen className="lg:size-5 xl:size-6" />
        <span>Відгуки</span>
      </Link>
      <Link
        href="/admin/settings"
        className={`admin-link ${pathname === '/admin/settings' ? 'admin-link-active' : ''}`}
      >
        <IconSettings className="lg:size-5 xl:size-6" />
        <span>Налаштування</span>
      </Link>
      <LogoutBtn customClassName="admin-link cursor-pointer" />
    </nav>
  );
}

export default AdminSidebarDesktop;
