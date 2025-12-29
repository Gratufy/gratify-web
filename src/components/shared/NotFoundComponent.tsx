import React from 'react';

import Image from 'next/image';

import BackToHomeBtn from '@/components/ui/custom-ui/BackToHomeBtn';

interface NotFoundComponentProps {
  IfFavorites?: boolean;
  business?: boolean;
}

function NotFoundComponent({ IfFavorites, business }: NotFoundComponentProps) {
  return (
    <div className="lg:w-125 w-90 my-20 flex flex-col items-center self-center xl:my-40">
      <div className="lg:w-88 w-72">
        <Image
          src="/images/not-found.png"
          width={358}
          height={193}
          alt="Logo"
          className="h-auto w-full"
        />
      </div>

      <p className="title-h4 text-center">
        {IfFavorites
          ? 'Жодного улюбленця...'
          : business
            ? 'Жодного бізнесу...'
            : 'Жодного збігу...'}
      </p>
      <p className="title-h4 mb-8 text-center">
        Але ми віримо, що скоро з’являться
      </p>
      {/* {!IfFavorites && <BackToHomeBtn />} */}
      <BackToHomeBtn />
    </div>
  );
}

export default NotFoundComponent;
