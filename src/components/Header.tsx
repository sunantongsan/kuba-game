import React from 'react';

interface HeaderProps {
  kubaBalance: number;
  dailyHitsLeft: number;
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const Header: React.FC<HeaderProps> = ({ kubaBalance, dailyHitsLeft }) => {
  return (
    <header className="w-full max-w-md mx-auto p-4 text-white">
      <div className="flex justify-between items-center bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-lg">
        <div className="flex flex-col items-start">
          <span className="text-sm text-yellow-400 font-semibold">KUBA Balance</span>
          <span className="text-2xl font-bold tracking-wider">{formatNumber(kubaBalance)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-cyan-400 font-semibold">Hits Left</span>
          <span className="text-2xl font-bold">{dailyHitsLeft}</span>
        </div>
      </div>
    </header>
  );
};
