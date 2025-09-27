import React from 'react';
import Image from 'next/image';
import IconMail from '@/assets/icons/footer/icon-mail.svg';
import FooterCategoryList from './FooterCategoryList';

function PublicFooter() {
  return (
    <div className="bg-background-main-200 hidden w-full lg:flex lg:py-5 xl:py-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col justify-between">
          <div className="xl:mr-37 lg:mr-28 lg:w-[260px] xl:w-[344px]">
            <Image
              src="/images/logo.png"
              width={344}
              height={71}
              alt="Logo"
              className="h-auto w-full"
            />
          </div>
          <div className="lg:space-y-3">
            <div className="flex items-end lg:gap-1 xl:gap-2">
              <IconMail className="lg:size-4 xl:size-5" />
              <span className="lg:placeholder-sm underline">
                Зв’язатись з нами
              </span>
            </div>
            <div className="flex items-end lg:gap-1">
              <span className="placeholder-small">&copy;</span>
              <span className="placeholder-small">2025</span>

              <span className="placeholder-small text-icons-grey-950">
                Зв’язатись з нами
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <p className="placeholder-sm font-medium">Каталог послуг</p>
          <div className="lg:space-y-3">
            <p className="placeholder-small">Політика конфеденційності</p>
            <p className="placeholder-small">Умови використання</p>
          </div>
        </div>
        <FooterCategoryList />
      </div>
    </div>
  );
}

export default PublicFooter;
