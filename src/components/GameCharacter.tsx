import React from 'react';
import { FloatingNumber } from '../types';
import { CHARACTER_IMAGE_URL } from '../constants';

interface GameCharacterProps {
  onHit: () => void;
  isHitting: boolean;
  canHit: boolean;
  floatingNumbers: FloatingNumber[];
}

export const GameCharacter: React.FC<GameCharacterProps> = ({ onHit, isHitting, canHit, floatingNumbers }) => {
  
  return (
    <div className="relative flex-grow flex items-center justify-center w-full">
      <div 
        onClick={canHit ? onHit : undefined} 
        className={`relative transition-transform duration-100 ${isHitting ? 'animate-wiggle' : ''} ${canHit ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed'}`}
        style={{ transformOrigin: 'bottom' }}
      >
        <img 
          src={CHARACTER_IMAGE_URL} 
          alt="Game Character" 
          className="w-64 h-auto md:w-80 noselect"
          draggable="false"
        />
        {!canHit && (
             <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">No Hits!</span>
             </div>
        )}
      </div>

      {floatingNumbers.map((num, index) => (
         <div
          key={num.id}
          className={`absolute text-3xl font-bold pointer-events-none animate-float-up ${num.isGrandPrize ? 'text-yellow-400 text-5xl' : 'text-white'}`}
          style={{
            left: `${40 + (index % 2) * 20}%`, // Stagger left/right
            bottom: '50%',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          }}
        >
          {num.isGrandPrize ? 'GRAND PRIZE!' : `+${num.amount}`}
        </div>
      ))}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          50% { transform: rotate(3deg) scale(1.02); }
        }
        .animate-wiggle {
          animation: wiggle 0.2s ease-in-out;
        }
        @keyframes float-up {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-150px); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        .noselect {
          -webkit-touch-callout: none;
            -webkit-user-select: none;
             -khtml-user-select: none;
               -moz-user-select: none;
                -ms-user-select: none;
                    user-select: none;
        }
      `}</style>
    </div>
  );
};
