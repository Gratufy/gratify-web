'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import IconSidebar from '@/assets/icons/admin/icon-sidebar.svg';

// import LogoutBtn from '@/components/ui/custom-ui/LogoutBtn';
import { ADMIN_LINKS } from '@/const/admin-links';

function AdminSidebarMobile() {
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
        className="mr-auto py-2 outline-none"
        aria-label="Відкрити меню адміністратора"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <IconSidebar className="size-6" />
      </button>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="bg-overlay-foreground fixed inset-0 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          'bg-background-main-50 w-54 absolute left-0 top-[100px] z-50 h-full shadow-lg',

          'transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="grid flex-1 auto-rows-min gap-3 px-4 py-6">
          <nav className="grid gap-8">
            {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'admin-link',
                  pathname === href && 'admin-link-active'
                )}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          {/* <div className="mt-auto" onClick={() => setSidebarOpen(false)}>
            <LogoutBtn customClassName="admin-link cursor-pointer" />
          </div> */}
        </div>
      </aside>
    </>
  );
}

export default AdminSidebarMobile;
