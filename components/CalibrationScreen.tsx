
import React from 'react';

type AudioStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

interface CalibrationScreenProps {
  audioStatus: AudioStatus;
  isPlaying: boolean;
  currentPace: number;
  onTogglePlay: () => void;
  onAdjustSpeed: (adjustment: number) => void;
  onComplete: () => void;
  onSkip: () => void;
}

const CalibrationScreen: React.FC<CalibrationScreenProps> = ({
  audioStatus,
  isPlaying,
  currentPace,
  onTogglePlay,
  onAdjustSpeed,
  onComplete,
  onSkip,
}) => {

  const isAudioReady = audioStatus === 'ready';

  const renderStatus = () => {
    switch (audioStatus) {
      case 'loading':
        return <p className="text-slate-400">Loading audio...</p>;
      case 'error':
        return <p className="text-red-400 text-lg">Audio failed. <br/> Please refresh.</p>;
      case 'ready':
        if (isPlaying) {
            return (
                <div className="text-center">
                    <p className="text-4xl font-bold text-cyan-400">
                        {(currentPace / 1000).toFixed(1)}s
                    </p>
                    <span className="block text-lg font-light text-slate-400 mt-1">per breath</span>
                </div>
            )
        }
        return <p className="text-2xl font-semibold text-white">Tap to Listen</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn text-center">
      <h1 className="text-3xl font-light text-slate-300 mb-4">Find your ideal pace.</h1>
      <p className="text-slate-400 mb-8 max-w-sm">
        Listen to the breath sound. Use the buttons below to adjust the speed until it feels comfortable and calming for you.
      </p>

      <div 
        onClick={onTogglePlay}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onTogglePlay(); }}
        className="relative w-64 h-64 rounded-full bg-slate-800 flex items-center justify-center mb-8 cursor-pointer transition-colors hover:bg-slate-700"
        role="button"
        aria-label={isAudioReady ? (isPlaying ? 'Pause audio' : 'Play audio') : 'Loading audio'}
        tabIndex={isAudioReady ? 0 : -1}
      >
        {renderStatus()}
      </div>

      <div className="flex items-center space-x-6 mb-10">
        <button
          onClick={() => onAdjustSpeed(-0.05)} // Slower = decrease playback rate
          className="px-8 py-3 bg-slate-700 text-white text-lg font-semibold rounded-full hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isAudioReady || !isPlaying}
        >
          Slower
        </button>
        <button
          onClick={() => onAdjustSpeed(0.05)} // Faster = increase playback rate
          className="px-8 py-3 bg-slate-700 text-white text-lg font-semibold rounded-full hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isAudioReady || !isPlaying}
        >
          Faster
        </button>
      </div>
      
      <button
        onClick={onComplete}
        disabled={!isAudioReady || !isPlaying}
        className="px-12 py-4 bg-green-500 text-white text-2xl font-bold rounded-full hover:bg-green-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Use this Pace
      </button>

      <button
        onClick={onSkip}
        className="mt-6 text-slate-500 hover:text-slate-300 transition-colors text-sm"
      >
        Skip for now
      </button>
    </div>
  );
};

export default CalibrationScreen;
