
import React from 'react';
import Fireworks from './Fireworks';

interface SessionCompleteScreenProps {
  sessionDuration: number;
  breathCount: number;
  onDoAnother: () => void;
  onLogMood: () => void;
}

const SessionCompleteScreen: React.FC<SessionCompleteScreenProps> = ({ sessionDuration, breathCount, onDoAnother, onLogMood }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full animate-fadeIn space-y-8">
      <Fireworks />
      <h1 className="text-5xl font-bold text-white z-10">Session Complete!</h1>
      <p className="text-xl text-slate-300 z-10">
        You completed a <span className="text-cyan-400">{sessionDuration} minute</span> session with <span className="text-cyan-400">{breathCount}</span> breaths.
      </p>
      <div className="flex space-x-4 z-10">
        <button
          onClick={onDoAnother}
          className="px-6 py-3 bg-slate-700 text-white text-lg font-semibold rounded-full hover:bg-slate-600 transition-colors"
        >
          Do Another Session
        </button>
        <button
          onClick={onLogMood}
          className="px-6 py-3 bg-cyan-500 text-white text-lg font-semibold rounded-full hover:bg-cyan-600 transition-colors"
        >
          Log My Mood
        </button>
      </div>
    </div>
  );
};

export default SessionCompleteScreen;
