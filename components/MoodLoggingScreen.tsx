
import React, { useState } from 'react';

interface MoodLoggingScreenProps {
  onComplete: () => void;
}

const MoodLoggingScreen: React.FC<MoodLoggingScreenProps> = ({ onComplete }) => {
  const [mood, setMood] = useState(5);

  const handleSubmit = () => {
    const newLog = {
      mood: mood,
      timestamp: Date.now(),
    };
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    history.push(newLog);
    localStorage.setItem('moodHistory', JSON.stringify(history));
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fadeIn">
      <h1 className="text-3xl font-light text-slate-300">How are you feeling?</h1>
      
      <div className="w-full max-w-sm">
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-sm text-slate-400 mt-2 px-1">
          <span>Stressed</span>
          <span>Calm</span>
        </div>
      </div>
      
      <p className="text-5xl font-bold text-cyan-400">{mood}</p>
      
      <button
        onClick={handleSubmit}
        className="px-10 py-3 bg-green-500 text-white text-xl font-bold rounded-full hover:bg-green-600 transition-colors"
      >
        Submit
      </button>
    </div>
  );
};

export default MoodLoggingScreen;
