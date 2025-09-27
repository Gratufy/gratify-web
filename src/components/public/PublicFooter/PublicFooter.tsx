import React from 'react';
import Image from 'next/image';
import IconMail from '@/assets/icons/footer/icon-mail.svg';

function PublicFooter() {
  return (
    <div className="bg-background-main-200 hidden w-full lg:flex lg:py-5">
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        <div className="flex flex-col justify-between">
          <div className="lg:mr-28 lg:w-[260px] xl:w-[260px]">
            <Image
              src="/images/logo.png"
              width={260}
              height={54}
              alt="Logo"
              className="h-auto w-full"
            />
          </div>
          <div className="lg:space-y-3">
            <div className="flex lg:gap-1">
              <IconMail className="size-4" />
              <span className="placeholder-sm underline">
                Зв’язатись з нами
              </span>
            </div>
            <div className="flex lg:gap-1">
              <span className="">&copy;</span>
              <span className="placeholder-sm">2025</span>

              <span className="placeholder-small text-icons-grey-950">
                Зв’язатись з нами
              </span>
            </div>
          </div>
        </div>
        <div className="">
          <div className="">
            catalog<div>Polit</div>
          </div>
        </div>
        <div className="">List category</div>
      </div>
    </div>
  );
}

export default PublicFooter;
