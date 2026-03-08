import Image from 'next/image';
import React from 'react';

function HeroSection() {
  return (
    
    <section className="lg:h-46 xl:h-65 relative mx-auto flex h-[150px] w-full justify-center bg-cover bg-center">
      <Image
        src="/images/hero-img.webp"
        alt="Платформа знижок для військових від українського бізнесу"
        fill
        priority={true}
        sizes="100vw"
        className="object-cover"
      />
    
      
      <div className="container relative flex h-full">
        <div className="flex h-full flex-col px-4 text-left lg:pl-14 xl:px-0">
          <div className="xl:mt-30 mb-auto mt-auto lg:mt-20 lg:hidden">
            <h1 className="title-h1 text-text-white dark:text-text-950-grey mb-1">
              Знижки та бонуси від бізнесу для військових
            </h1>
            <h2 className="title-h5 text-text-50-grey dark:text-text-800-grey">
              Cила єдності у кожному дні
            </h2>
          </div>
          <div className="xl:mt-30 mb-auto mt-auto hidden lg:mt-20 lg:block">
            <h2 className="title-h1 text-text-white dark:text-text-950-grey mb-1 lg:mb-2">
              Cила єдності у кожному дні
            </h2>
            <h1 className="title-h5 text-text-50-grey dark:text-text-800-grey">
              Знижки та бонуси від бізнесу для військових
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
