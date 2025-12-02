import React from 'react';

function HeroSection() {
  return (
    <section className="lg:h-46 xl:h-65 mx-auto flex h-[150px] w-full justify-center bg-cover bg-center max-[1023px]:bg-[url('/images/hero-img-sm@2x.png')] lg:bg-[url('/images/hero-img-lg@2x.png')] xl:bg-[url('/images/hero-img-xl@2x.png')]">
      <div className="container flex h-full">
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
