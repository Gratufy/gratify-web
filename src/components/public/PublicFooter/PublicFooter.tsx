import React from 'react';
import Image from 'next/image';
import IconMail from '@/assets/icons/footer/icon-mail.svg';
import FooterCategoryList from './FooterCategoryList';
import Link from 'next/link';

function PublicFooter() {
  return (
    <div className="bg-background-main-200 hidden w-full lg:flex lg:py-5">
      <div className="container mx-auto flex items-center">
        <div className="lg:mr-54 lg:w-[260px] xl:mr-60 xl:w-[344px]">
          <Image
            src="/images/logo.png"
            width={344}
            height={71}
            alt="Logo"
            className="h-auto w-full"
          />
        </div>
        <div className="flex-col lg:flex lg:gap-4 xl:gap-7">
          <a
            href="mailto:info@example.com"
            className="flex items-end lg:gap-1 xl:gap-2"
          >
            <IconMail className="lg:size-4 xl:size-5" />
            <span className="lg:placeholder-sm xl:placeholder-base underline">
              Зв’язатись з нами
            </span>
          </a>
          <div className="flex items-center lg:gap-6">
            <div className="flex items-center lg:gap-1">
              <span className="placeholder-xs">&copy;</span>
              <span className="placeholder-small">2025</span>

              <span className="placeholder-small text-icons-grey-950">
                Всі права захищено
              </span>
            </div>

            <Link href="/privacy" className="placeholder-small">
              Політика конфеденційності
            </Link>
            <Link href="/terms" className="placeholder-small">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicFooter;
