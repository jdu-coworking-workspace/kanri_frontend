import Link from 'next/link';
import React from 'react';
import HourlyBlock from '../Layout/details/hourly-block';
import DetailedBtns from '../Layout/details/detailed-btns';
import MobileMenu from '../Layout/details/mobile-menu';

const ModernHeader = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 w-full py-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] dark:shadow-none border-b border-transparent dark:border-gray-800 transition-colors duration-300">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <span className="text-sm sm:text-lg md:text-[28px] font-bold text-kanri-primary dark:text-white">
            COWORK 管理
          </span>
        </Link>
        
        {/* Mobile View: HourlyBlock + MobileMenu */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3">
          <HourlyBlock />
          <MobileMenu />
        </div>

        {/* Desktop View: HourlyBlock + DetailedBtns */}
        <div className="hidden lg:flex items-center gap-3">
          <HourlyBlock />
          <DetailedBtns />
        </div>
      </div>
    </nav>
  );
};

export default ModernHeader;