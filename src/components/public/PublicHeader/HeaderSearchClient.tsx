'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import debounce from 'lodash/debounce';

import { useDashboardSearchStore } from '@/stores/dashboardSearchStore';
import { useFavoritesSearchStore } from '@/stores/FavoritesSearchStore';
import { useAuth } from '@/stores/useUserStore';
import { useFilters } from '@/hooks/useFilters';

import FavoriteHeaderIcon from '@/assets/icons/general/favorite-h.svg';

import ThemeSwitch from '@/components/ui/custom-ui/ThemeSwitch';
import AuthHeaderSkeleton from '@/components/shared/skeletons/AuthHeaderSkeleton';

import InputSearch from '@/components/public/PublicHeader/InputSearch';
import LoginHeaderBtn from '@/components/public/PublicHeader/LoginHeaderBtn';
import UserMenu from '@/components/public/PublicHeader/UserMenu';

import BusinessMenu from '@/components/business/BusinessHeader/BusinessMenu';
import AdminMenu from '@/components/admin/AdminHeader/AdminMenu';

function PublicHeaderClient() {
  const pathname = usePathname();
  const { filters, updateFilter } = useFilters(); // for search ib public
  const {
    search: dashboardLocal,
    setSearch: setDashboardSearch,
    clearSearch: clearDashboardSearch,
  } = useDashboardSearchStore();

  const {
    search: favoriteslocal,
    setSearch: setFavoritesSearch,
    clearSearch: clearFavoritesSearch,
  } = useFavoritesSearchStore();

  const isPublic = pathname === '/';
  const isDashboard = pathname.startsWith('/dashboard');
  const isFavorites = pathname === '/favorites';
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    setInputValue(''); // clear input value on path change
    clearDashboardSearch();
    clearFavoritesSearch();
  }, [clearDashboardSearch, clearFavoritesSearch, pathname]);

  const [inputValue, setInputValue] = useState(
    isPublic
      ? (filters.search ?? '')
      : isDashboard || isAdmin
        ? dashboardLocal
        : isFavorites
          ? favoriteslocal
          : ''
  );

  const { session, profile: user, hasCheckedSession } = useAuth();

  const debouncedUpdate = useMemo(
    () => debounce((val: string) => updateFilter('search', val), 500),
    [updateFilter]
  );
  const debouncedFavoritesSearch = useMemo(
    () => debounce((val: string) => setFavoritesSearch(val), 500),
    [setFavoritesSearch]
  );
  const debouncedDashboardSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDashboardSearch(val);
      }, 500),
    [setDashboardSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (isPublic) {
      debouncedUpdate(val); // / URL
    } else if (isDashboard || isAdmin) {
      debouncedDashboardSearch(val); //  Dashboard Zustand and Admin!
    } else if (isFavorites) {
      debouncedFavoritesSearch(val); //  Favorites  Zustand
    }
  };
  return (
    <>
      <div className="container hidden items-center py-3 lg:flex lg:justify-between">
        <Link href="/" className="w-[169px] xl:w-[181px]">
          <Image
            src="/images/logo.png"
            width={181}
            height={38}
            alt="Логотип Gratify"
            className="w-full dark:hidden"
          />
          <Image
            src="/images/logo_dark.png"
            width={181}
            height={38}
            alt="Логотип Gratify"
            className="hidden w-full dark:block"
          />
        </Link>

        <InputSearch
          id="search-desktop"
          name="search-desktop"
          value={inputValue}
          onChange={handleChange}
        />

        <div className="w-25 lg:w-34 xl:w-42 flex items-center justify-between">
          <ThemeSwitch />
          {!hasCheckedSession ? (
            <AuthHeaderSkeleton />
          ) : session ? (
            <div className="xl:w-15 flex w-14 items-start justify-between">
              <div
                className={`${user?.role ? '' : 'bg-icons-grey-300/80'} h-6 w-[18px]`}
              >
                {user?.role === 'USER' && <UserMenu />}
                {user?.role === 'BUSINESS' && <BusinessMenu />}
                {user?.role === 'ADMIN' && <AdminMenu />}
              </div>
              <Link href="/favorites" className="hover-focus-card-dark">
                <FavoriteHeaderIcon
                  className={`ml-auto h-5 w-4 ${
                    isFavorites
                      ? 'text-icons-color-accent fill-icons-color-accent'
                      : 'fill-transparent'
                  }`}
                />
              </Link>
            </div>
          ) : (
            <LoginHeaderBtn />
          )}
        </div>
      </div>
      {/* mobile */}
      <div className="bg-background-main-50 flex w-full flex-col px-4 py-3 lg:hidden">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="w-[169px] xl:w-[181px]">
              <Image
                src="/images/logo.png"
                width={169}
                height={35}
                alt="Логотип Gratify"
                className="dark:hidden"
              />
              <Image
                src="/images/logo_dark.png"
                width={169}
                height={35}
                alt="Логотип Gratify"
                className="hidden dark:block"
              />
            </Link>

            {/* w-25 it was so before House */}
            <div className="w-25 flex items-center justify-between">
              <ThemeSwitch />

              {!hasCheckedSession ? (
                <AuthHeaderSkeleton />
              ) : session ? (
                <div className="flex w-12 items-start justify-between">
                  <div
                    className={`${user?.role ? '' : 'bg-icons-grey-300/80'} h-5 w-5`}
                  >
                    {user?.role === 'USER' && <UserMenu />}
                    {user?.role === 'BUSINESS' && <BusinessMenu />}
                    {user?.role === 'ADMIN' && <AdminMenu />}
                  </div>
                  <Link href="/favorites">
                    <FavoriteHeaderIcon
                      className={`ml-auto h-5 w-4 ${
                        isFavorites
                          ? 'text-icons-color-accent fill-icons-color-accent'
                          : 'fill-transparent'
                      }`}
                    />
                  </Link>
                </div>
              ) : (
                <LoginHeaderBtn />
              )}
            </div>
          </div>

          {!isAdmin && (
            <InputSearch
              id="search-mobile"
              name="search-mobile"
              value={inputValue}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default PublicHeaderClient;
