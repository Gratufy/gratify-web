import React from 'react';
import Link from 'next/link';

function BackToHomeBtn() {
  return (
    <Link
      href="/"
      className="xl:w-58 bg-background-main-300 shadow-menu placeholder-xs lg:placeholder-sm xl:placeholder-base lg:w-50 w-44 px-3 py-2 lg:px-4 xl:px-5"
    >
      Повернутись на головну
    </Link>
  );
}

export default BackToHomeBtn;
