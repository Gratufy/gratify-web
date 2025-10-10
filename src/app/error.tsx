'use client'; // Error boundaries must be Client Components

import Image from 'next/image';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="container flex min-h-screen w-full flex-col items-center justify-center py-20">
      <div className="w-72 xl:w-[358px]">
        <Image
          src="/images/global-err.png"
          width={358}
          height={206}
          alt="Error image"
          className="h-auto w-full"
        />
      </div>
      <p className="title-h4 text-center">
        Здається, ця сторінка зараз на службі.
      </p>
      <p className="title-h4 mb-8 text-center">Повернеться з перемогою!</p>
      <button
        className="xl:w-58 bg-background-main-300 shadow-menu placeholder-xs lg:placeholder-sm xl:placeholder-base lg:w-50 flex w-44 items-center justify-center border-none px-3 py-2 outline-none lg:px-4 xl:px-5"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Перезавантажити
      </button>
    </section>
  );
}
