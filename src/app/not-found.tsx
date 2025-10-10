import BackToHomeBtn from '@/components/shared/BackToHomeBtn';
import Image from 'next/image';

export default function NotFound() {
  return (
    <section className="container flex w-full flex-col items-center justify-center py-20">
      <div className="w-72 lg:w-[1135px]">
        <Image
          src="/images/404.png"
          width={1135}
          height={600}
          alt="Logo"
          className="h-auto w-full"
        />
      </div>

      <p className="title-h4 text-center">
        Навіть сторінки іноді беруть відпустку
      </p>

      <BackToHomeBtn />
    </section>
  );
}
