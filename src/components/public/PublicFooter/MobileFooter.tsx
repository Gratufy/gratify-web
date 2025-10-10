import React from 'react';
import Image from 'next/image';
import IconMail from '@/assets/icons/footer/icon-mail.svg';
import Link from 'next/link';

function MobileFooter() {
  return (
    <>
      <div className="container mx-auto items-center lg:hidden">
        <Image
          src="/images/logo.png"
          width={136}
          height={28}
          alt="Logo"
          className="mb-3 h-auto"
        />
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <a
              href="mailto:info@example.com"
              className="flex items-center gap-2"
            >
              <IconMail className="size-3" />
              <span className="placeholder-xs underline">
                Зв’язатись з нами
              </span>
            </a>

            <div className="flex items-center gap-1">
              <span className="placeholder-xs">&copy;</span>
              <span className="placeholder-extrasmall">2025</span>

              <span className="placeholder-extrasmall text-icons-grey-950">
                Всі права захищено
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-1">
            <Link href="/privacy" className="placeholder-extrasmall">
              Політика конфеденційності
            </Link>
            <Link href="/terms" className="placeholder-extrasmall">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileFooter;
