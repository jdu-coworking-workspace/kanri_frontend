import Link from 'next/link';
import React from 'react';
import HourlyBlock from '../Layout/details/hourly-block';
import DetailedBtns from '../Layout/details/detailed-btns';

const ModernHeader = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 w-full py-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] dark:shadow-none border-b border-transparent dark:border-gray-800 transition-colors duration-300">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <span className="text-sm sm:text-lg md:text-[28px] font-bold text-kanri-primary dark:text-white">
            COWORK 管理
          </span>
        </Link>
        <div className="flex gap-3">
          <HourlyBlock />
        </div>
        <div className="lg:flex hidden items-center gap-3">
          <DetailedBtns />
        </div>
      </div>
    </nav>
  );
};

export default ModernHeader;