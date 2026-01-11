import React from 'react';
import MobileFooter from './MobileFooter';
import DesktopFooter from './DesktopFooter';

function Footer() {
  return (
    <footer className="bg-background-main-200 h-40 w-full py-5 max-[1024px]:px-4 lg:flex lg:h-[96px] lg:py-5 xl:h-[112px]">
      <MobileFooter />
      <DesktopFooter />
    </footer>
  );
}

export default Footer;
