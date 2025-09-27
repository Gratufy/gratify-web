import React from 'react';
import Image from 'next/image';
import IconMail from '@/assets/icons/footer/icon-mail.svg';
import FooterCategoryList from './FooterCategoryList';
import Link from 'next/link';

function PublicFooter() {
  return (
    <div className="bg-background-main-200 hidden w-full lg:flex lg:py-5 xl:py-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex h-full flex-col justify-between">
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
            <a
              href="mailto:info@example.com"
              className="flex items-end lg:gap-1 xl:gap-2"
            >
              <IconMail className="lg:size-4 xl:size-5" />
              <span className="lg:placeholder-sm xl:placeholder-base underline">
                Зв’язатись з нами
              </span>
            </a>
            {/* <div className="flex items-end lg:gap-1 xl:gap-2">
              <IconMail className="lg:size-4 xl:size-5" />
              <span className="lg:placeholder-sm xl:placeholder-base underline">
                Зв’язатись з нами
              </span>
            </div> */}
            <div className="flex items-center lg:gap-1">
              <span className="placeholder-sm">&copy;</span>
              <span className="placeholder-small">2025</span>

              <span className="placeholder-small text-icons-grey-950">
                Всі права захищено
              </span>
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col justify-between">
          <p className="lg:placeholder-sm xl:placeholder-base font-medium">
            Каталог послуг
          </p>
          <div className="flex flex-col lg:gap-3">
            <Link href="/privacy" className="placeholder-small">
              Політика конфеденційності
            </Link>
            <Link href="/privacy" className="placeholder-small">
              Умови використання
            </Link>
          </div>
        </div>
        <FooterCategoryList />
      </div>
    </div>
  );
}

export default PublicFooter;
