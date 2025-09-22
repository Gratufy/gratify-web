import React from 'react';

function HeroSection() {
  return (
    <section className="h-65 lg:h-46 xl:h-65 mx-auto flex w-full justify-center bg-[url('/images/hero-img@2x.png')] bg-cover bg-center">
      <div className="container flex h-full flex-col justify-center">
        <div className="xl:pt-30 px-4 text-center lg:px-14 lg:pt-20 lg:text-left xl:px-0">
          <h1 className="title-h1 text-text-white mb-2 lg:mb-[6px] xl:mb-1">
            Cила єдності у кожному дні
          </h1>
          <h5 className="title-h5 text-text-50-grey">
            Знижки та бонуси від бізнесу для військових
          </h5>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
