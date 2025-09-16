
import React, { useState, useMemo } from 'react';

interface SessionSetupScreenProps {
  breathPace: number;
  onStart: (duration: number) => void;
}

const SessionSetupScreen: React.FC<SessionSetupScreenProps> = ({ breathPace, onStart }) => {
  const [duration, setDuration] = useState(3); // in minutes

  const approximateBreaths = useMemo(() => {
    if (breathPace === 0) return 0;
    const paceInSeconds = breathPace / 1000;
    const durationInSeconds = duration * 60;
    return Math.round(durationInSeconds / paceInSeconds);
  }, [duration, breathPace]);

  const presets = [1, 3, 5];

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fadeIn">
      <h1 className="text-3xl font-light text-slate-300">Choose your session length.</h1>
      
      <div className="flex space-x-4">
        {presets.map(preset => (
          <button
            key={preset}
            onClick={() => setDuration(preset)}
            className={`px-6 py-2 rounded-full text-lg font-medium transition-colors ${
              duration === preset ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {preset} MIN
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm">
        <input
          type="range"
          min="1"
          max="15"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>1 MIN</span>
          <span>15 MIN</span>
        </div>
      </div>
      
      <p className="text-xl text-slate-200">{duration} minute{duration > 1 && 's'}</p>
      
      <p className="text-lg text-slate-400">
        Approximately <span className="text-cyan-400 font-bold">{approximateBreaths}</span> breaths.
      </p>
      
      <button
        onClick={() => onStart(duration)}
        className="px-12 py-4 bg-green-500 text-white text-2xl font-bold rounded-full hover:bg-green-600 transition-transform transform hover:scale-105"
      >
        Start
      </button>
    </div>
  );
};

export default SessionSetupScreen;
