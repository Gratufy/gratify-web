import React from 'react';
import Link from 'next/link';
import IconCategory from '@/assets/icons/menu/icon-category.svg';
import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';

function AdminSidebar() {
  return (
    <ul className="w-65 bg-background-main-50 flex h-full flex-col lg:gap-8 lg:pl-[50px] lg:pt-3">
      {/*isactive background-main-100 text-text-800-main */}
      <Link
        href="/business/new"
        className="title-h4 bg-background-main-50 flex items-center lg:gap-3 lg:px-2 lg:py-3"
      >
        <IconCategory className="mr-2 size-4 xl:mr-3 xl:size-5" />
        <span>Головна</span>
      </Link>
      <Link
        href="/business/new"
        className="title-h4 bg-background-main-50 flex items-center lg:gap-3 lg:px-2 lg:py-3"
      >
        <IconCategory className="mr-2 size-4 xl:mr-3 xl:size-5" />
        <span>Модерування</span>
      </Link>
      <Link
        href="/business/new"
        className="title-h4 bg-background-main-50 flex items-center lg:gap-3 lg:px-2 lg:py-3"
      >
        <IconCategory className="mr-2 size-4 xl:mr-3 xl:size-5" />
        <span>Категорії</span>
      </Link>
      <Link
        href="/business/new"
        className="title-h4 bg-background-main-50 flex items-center lg:gap-3 lg:px-2 lg:py-3"
      >
        <IconCategory className="mr-2 size-4 xl:mr-3 xl:size-5" />
        <span>Налаштування</span>
      </Link>
      <LogoutBtn />
    </ul>
  );
}

export default AdminSidebar;
