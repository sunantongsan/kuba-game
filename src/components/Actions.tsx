import React from 'react';

interface ActionsProps {
  onWatchAd: () => void;
  onOpenMissions: () => void;
  isAdLoading: boolean;
}

const ActionButton: React.FC<{onClick: () => void, disabled?: boolean, children: React.ReactNode, className?: string}> = ({ onClick, disabled, children, className }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-center text-lg font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-opacity-50 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-100'}`}
    >
        {children}
    </button>
);


export const Actions: React.FC<ActionsProps> = ({ onWatchAd, onOpenMissions, isAdLoading }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-3">
        <ActionButton 
            onClick={onWatchAd}
            disabled={isAdLoading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white focus:ring-indigo-400"
        >
            {isAdLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading Ad...</span>
                </div>
            ) : "📺 Watch Ad (+1 Hit)"}
        </ActionButton>
       <ActionButton 
            onClick={onOpenMissions}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 focus:ring-orange-300"
        >
            🚀 Missions
        </ActionButton>
    </div>
  );
};
