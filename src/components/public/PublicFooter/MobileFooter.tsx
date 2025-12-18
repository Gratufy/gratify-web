import React from 'react';
import Image from 'next/image';
import IconMail from '@/assets/icons/footer/icon-mail.svg';
import IconTelegram from '@/assets/icons/footer/icon-telegram.svg';
import { Copyright } from 'lucide-react';
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
          className="mb-3"
        />
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <IconTelegram className="size-3" />
              <a
                href="mailto:info@example.com"
                className="flex items-center gap-2"
              >
                <IconMail className="size-3" />
                <span className="link-big text-text-950-grey">
                  Зв’язатись з нами
                </span>
              </a>
            </div>

            <div className="flex items-center gap-1">
              {/* <span className="placeholder-sm">&copy;</span> */}
              <Copyright className="size-3" />
              <span className="caption">2025</span>

              <span className="caption">Всі права захищено</span>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-1">
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

export default MobileFooter;
