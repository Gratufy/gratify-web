'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import IconCategory from '@/assets/icons/menu/icon-category.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import IconSettings from '@/assets/icons/admin/icon-setting.svg';
import IconMain from '@/assets/icons/admin/icon-main.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconSidebar from '@/assets/icons/admin/icon-sidebar.svg';

import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';

function AdminNewSidebarMobile() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ESC
  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);
  return (
    <>
      <button
        className="mr-auto py-2"
        aria-label="Відкрити меню адміністратора"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <IconSidebar className="size-6" />
      </button>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          'bg-background-main-50 absolute left-0 top-[100px] z-50 h-full w-64 shadow-lg',

          'transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-6">
          <div className="grid gap-3">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className={`admin-link ${pathname === '/admin' ? 'admin-link-active' : ''}`}
            >
              <IconMain className="size-5" />
              <span>Головна</span>
            </Link>
            <Link
              href="/admin/modering"
              onClick={() => setSidebarOpen(false)}
              className={`admin-link ${pathname === '/admin/modering' ? 'admin-link-active' : ''}`}
            >
              <IconModering className="size-5" />
              <span>Модерування</span>
            </Link>
            <Link
              href="/admin/categories"
              onClick={() => setSidebarOpen(false)}
              className={`admin-link ${pathname === '/admin/categories' ? 'admin-link-active' : ''}`}
            >
              <IconCategory className="size-5" />
              <span>Категорії</span>
            </Link>
            <Link
              href="/admin/review"
              onClick={() => setSidebarOpen(false)}
              className={`admin-link ${pathname === '/admin/review' ? 'admin-link-active' : ''}`}
            >
              <EditPen className="size-5" />
              <span>Відгуки</span>
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => setSidebarOpen(false)}
              className={`admin-link ${pathname === '/admin/settings' ? 'admin-link-active' : ''}`}
            >
              <IconSettings className="size-5" />
              <span>Налаштування</span>
            </Link>
          </div>
          <div className="mt-auto" onClick={() => setSidebarOpen(false)}>
            <LogoutBtn customClassName="admin-link cursor-pointer" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminNewSidebarMobile;
