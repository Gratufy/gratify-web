import React from 'react';
import BackToHomeBtn from '@/components/ui/custom-ui/BackToHomeBtn';
import Image from 'next/image';

function NotFoundPageComponent() {
  return (
    <section className="container flex w-full flex-col items-center justify-center py-20">
      <div className="w-90 relative h-[190px] lg:h-[359px] lg:w-[680px] xl:h-[600px] xl:w-[1135px]">
        <div className="absolute left-[160px] top-[75px] w-[80px] lg:left-[290px] lg:top-[130px] lg:w-[170px] xl:left-[475px] xl:top-[228px] xl:h-[167px] xl:w-[286px]">
          <Image
            src="/images/404-1.png"
            width={286}
            height={167}
            alt=""
            aria-hidden="true"
            className="h-auto w-full"
          />
        </div>
        <div className="w-90 absolute z-10 h-[190px] rounded-md lg:h-[359px] lg:w-[680px] xl:h-[600px] xl:w-[1135px]">
          <Image
            src="/images/404.png"
            width={1135}
            height={600}
            alt="Зображення 404 помилки"
            className="h-auto w-full"
            priority
          />
        </div>
      </div>

      <p className="title-h4 mb-8 text-center">
        Навіть сторінки іноді беруть відпустку
      </p>

      <BackToHomeBtn />
    </section>
  );
}

export default NotFoundPageComponent;
