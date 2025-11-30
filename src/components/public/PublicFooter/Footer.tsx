import React from 'react';
import MobileFooter from './MobileFooter';
import DesktopFooter from './DesktopFooter';

function Footer() {
  return (
    <footer className="bg-background-main-200 w-full py-5 max-[1024px]:px-4 lg:flex lg:py-5">
      <MobileFooter />
      <DesktopFooter />
    </footer>
  );
}

export default Footer;
