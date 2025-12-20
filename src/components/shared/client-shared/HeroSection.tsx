import Image from 'next/image';
import React from 'react';

function HeroSection() {
  return (
    // max-[1023px]:bg-[url('/images/hero-img-sm@2x.png')] lg:bg-[url('/images/hero-img-lg@2x.png')] xl:bg-[url('/images/hero-img-xl@2x.png')]
    <section className="lg:h-46 xl:h-65 relative mx-auto flex h-[150px] w-full justify-center bg-cover bg-center">
      <Image
        src="/images/hero-img.png"
        alt="Платформа знижок для військових від українського бізнесу"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* <picture>
        <source
          media="(min-width: 1440px)"
          srcSet="/images/hero-img-xl@2x.png"
        />
        <source
          media="(min-width: 1024px)"
          srcSet="/images/hero-img-lg@2x.png"
        />
        <Image
          src="/images/hero-img-sm@2x.png"
          alt="Знижки та бонуси для військових"
          fill
          priority
        />
      </picture> */}
      <div className="container relative flex h-full">
        <div className="flex h-full flex-col px-4 text-left lg:pl-14 xl:px-0">
          <div className="xl:mt-30 mb-auto mt-auto lg:mt-20">
            <h1 className="title-h1 text-text-white mb-1 lg:mb-2">
              Cила єдності у кожному дні
            </h1>
            <h5 className="title-h5 text-text-50-grey">
              Знижки та бонуси від бізнесу для військових
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
