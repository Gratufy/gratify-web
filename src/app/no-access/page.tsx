import React from 'react';
import BackToHomeBtn from '@/components/shared/BackToHomeBtn';

function Page() {
  return (
    <section className="pt-30 xl:pt-50 container flex items-center justify-center pb-20">
      <div className="lg:w-125 w-90 flex flex-col items-center">
        <p className="title-h4 mb-8 text-center">
          Вибачте, але у вас немає прав доступу для перегляду цієї сторінці
        </p>
        <BackToHomeBtn />
      </div>
    </section>
  );
}

export default Page;
