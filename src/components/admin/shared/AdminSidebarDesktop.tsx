'use client';
import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';
import { ADMIN_LINKS } from '@/const/admin-links';

function AdminSidebarDesktop() {
  const pathname = usePathname();

  return (
    <nav className="lg:w-65 xl:w-100 bg-background-main-50 min-h-screen lg:flex lg:flex-col lg:gap-6 lg:pb-8 lg:pl-[50px] lg:pt-3 xl:pl-[100px]">
      {/*isactive background-main-100 text-text-800-main */}
      {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`admin-link ${pathname === href ? 'admin-link-active' : ''} `}
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </Link>
      ))}

      {/* <LogoutBtn customClassName="admin-link cursor-pointer" /> */}
    </nav>
  );
}

export default AdminSidebarDesktop;

//  <Link
//         href="/admin"
//         className={`admin-link ${pathname === '/admin' ? 'admin-link-active' : ''}`}
//       >
//         <IconMain className="lg:size-5 xl:size-6" />
//         <span>Головна</span>
//       </Link>
//       <Link
//         href="/admin/modering"
//         className={`admin-link ${pathname === '/admin/modering' ? 'admin-link-active' : ''}`}
//       >
//         <IconModering className="lg:size-5 xl:size-6" />
//         <span>Модерування</span>
//       </Link>
//       <Link
//         href="/admin/categories"
//         className={`admin-link ${pathname === '/admin/categories' ? 'admin-link-active' : ''}`}
//       >
//         <IconCategory className="lg:size-5 xl:size-6" />
//         <span>Категорії</span>
//       </Link>
//       <Link
//         href="/admin/review"
//         className={`admin-link ${pathname === '/admin/review' ? 'admin-link-active' : ''}`}
//       >
//         <EditPen className="lg:size-5 xl:size-6" />
//         <span>Відгуки</span>
//       </Link>
//       <Link
//         href="/admin/settings"
//         className={`admin-link ${pathname === '/admin/settings' ? 'admin-link-active' : ''}`}
//       >
//         <IconSettings className="lg:size-5 xl:size-6" />
//         <span>Налаштування</span>
//       </Link>
