'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import IconCategory from '@/assets/icons/menu/icon-category.svg';
import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-65 bg-background-main-50 flex h-full flex-col lg:gap-8 lg:pl-[50px] lg:pt-3">
      {/*isactive background-main-100 text-text-800-main */}
      <Link
        href="/admin"
        className={`admin-link ${pathname === '/admin' ? 'admin-link-active' : ''}`}
      >
        <IconCategory className="size-4 xl:mr-3 xl:size-5" />
        <span>Головна</span>
      </Link>
      <Link
        href="/admin/business"
        className={`admin-link ${pathname === '/admin/business' ? 'admin-link-active' : ''}`}
      >
        <IconCategory className="size-4 xl:mr-3 xl:size-5" />
        <span>Модерування</span>
      </Link>
      <Link
        href="/admin/categories"
        className={`admin-link ${pathname === '/admin/categorie' ? 'admin-link-active' : ''}`}
      >
        <IconCategory className="size-4 xl:mr-3 xl:size-5" />
        <span>Категорії</span>
      </Link>
      <Link
        href="/admin/settings"
        className={`admin-link ${pathname === '/admin/settings' ? 'admin-link-active' : ''}`}
      >
        <IconCategory className="size-4 xl:mr-3 xl:size-5" />
        <span>Налаштування</span>
      </Link>
      <LogoutBtn customClassName="admin-link" />
    </nav>
  );
}

export default AdminSidebar;
