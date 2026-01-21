import React from 'react';
import Image from 'next/image';
import IconMail from '@/assets/icons/footer/icon-mail.svg';
import IconTelegram from '@/assets/icons/footer/icon-telegram.svg';
import { Copyright } from 'lucide-react';
//import FooterCategoryList from './FooterCategoryList';
import Link from 'next/link';

function DesktopFooter() {
  return (
    <>
      <div className="container mx-auto hidden items-center justify-between lg:flex">
        {/* lg:mr-54 xl:mr-60*/}
        <div className="xl:h-18 lg:h-14 lg:w-[260px] xl:w-[344px]">
          <Image
            src="/images/logo.png"
            width={344}
            height={72}
            alt="Логотип Gratify"
            className="h-auto dark:hidden"
          />
          <Image
            src="/images/logo_dark.png"
            width={344}
            height={72}
            alt="Логотип Gratify"
            className="hidden h-auto dark:block"
          />
        </div>
        {/* lg:gap-4 xl:gap-7*/}
        <div className="h-full flex-col justify-between lg:flex">
          <div className="flex items-center gap-2 xl:gap-4">
            <IconTelegram className="size-4 xl:size-5" />
            <a
              href="mailto:info@example.com"
              className="flex items-center lg:gap-1 xl:gap-2"
            >
              <IconMail className="lg:size-4 xl:size-5" />
              <span className="link-big text-text-950-grey">
                Зв’язатись з нами
              </span>
            </a>
          </div>
          <div className="flex items-center lg:gap-6">
            <div className="flex items-center lg:gap-1">
              <Copyright className="size-3" />
              <span className="caption">2025</span>

              <span className="caption">Всі права захищено</span>
            </div>

            <Link href="/privacy" className="caption">
              Політика конфеденційності
            </Link>
            <Link href="/terms" className="caption">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesktopFooter;
