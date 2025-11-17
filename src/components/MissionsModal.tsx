import React, { useState } from 'react';
import { Mission } from '../types';
import { MISSIONS, INVITE_REWARD_KUBA } from '../constants';

interface MissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedMissions: string[];
  onCompleteMission: (rewardKuba: number, rewardHits: number, missionId: string) => void;
  userId: string;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({ isOpen, onClose, completedMissions, onCompleteMission, userId }) => {
  const [isCopied, setIsCopied] = useState(false);
  if (!isOpen) return null;

  const handleMissionClick = (mission: Mission) => {
    window.open(mission.link, '_blank');
    onCompleteMission(mission.rewardKuba, mission.rewardHits, mission.id);
  };
  
  const handleCopyLink = () => {
    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${userId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy link.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md text-white flex flex-col max-h-[90vh]">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-yellow-400">Missions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <ul className="space-y-4">
            {MISSIONS.map(mission => {
              const isCompleted = completedMissions.includes(mission.id);
              return (
                <li key={mission.id} className={`bg-gray-900 p-4 rounded-lg border border-gray-700 transition-all ${isCompleted ? 'opacity-60' : ''}`}>
                  <h3 className="font-bold text-lg">{mission.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-400">
                      +{mission.rewardKuba} KUBA & +{mission.rewardHits} Hits
                    </span>
                    <button
                      onClick={() => handleMissionClick(mission)}
                      disabled={isCompleted}
                      className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {isCompleted ? 'Completed' : 'Go!'}
                    </button>
                  </div>
                </li>
              );
            })}

             <li className="bg-gray-900 p-4 rounded-lg border border-teal-500 border-opacity-50">
                <h3 className="font-bold text-lg text-teal-300">Invite a Friend</h3>
                <p className="text-sm text-gray-400 mb-3">
                    Share your referral link. New players who join get a bonus of {INVITE_REWARD_KUBA.toLocaleString()} KUBA!
                </p>
                <div className="bg-gray-700 p-2 rounded-md text-center mb-3">
                    <p className="text-xs text-gray-400">Your Referral Code</p>
                    <span className="text-gray-300 font-mono break-all">{userId}</span>
                </div>
                <button
                    onClick={handleCopyLink}
                    className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition hover:bg-teal-700 disabled:bg-teal-800"
                    disabled={isCopied}
                >
                    {isCopied ? 'Copied!' : 'Copy Referral Link'}
                </button>
            </li>
          </ul>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};
