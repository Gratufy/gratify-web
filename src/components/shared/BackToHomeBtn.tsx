import React from 'react';
import Link from 'next/link';

function BackToHomeBtn() {
  return (
    <Link href="/" className="xl:w-58 btn-aprove lg:w-50 flex w-44">
      Повернутись на головну
    </Link>
  );
}

export default BackToHomeBtn;
