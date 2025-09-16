
import React, { useState, useEffect, useRef } from 'react';
import { Screen } from './types';
import CalibrationScreen from './components/CalibrationScreen';
import SessionSetupScreen from './components/SessionSetupScreen';
import BreathingSessionScreen from './components/BreathingSessionScreen';
import SessionCompleteScreen from './components/SessionCompleteScreen';
import MoodLoggingScreen from './components/MoodLoggingScreen';

type AudioStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.CALIBRATION);
  const [breathPace, setBreathPace] = useState<number>(8000); // Default 8 seconds
  const [sessionDuration, setSessionDuration] = useState<number>(3);
  const [breathCount, setBreathCount] = useState<number>(0);
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  // --- Centralized Audio State ---
  const audioRef = useRef<HTMLAudioElement>(null);
  const originalDurationRef = useRef<number>(0);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('loading');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const handleAudioReady = () => {
    console.log('handleAudioReady triggered.');
    const audio = audioRef.current;
    if (!audio || originalDurationRef.current) return; // Already run

    console.log(`Audio metadata loaded. Duration: ${audio.duration}s`);
    originalDurationRef.current = audio.duration;
    const storedPace = localStorage.getItem('breathPace');
     setAudioStatus('ready');
    if (storedPace) {
      console.log(`Found stored pace: ${storedPace}ms`);
      const pace = Number(storedPace);
      setBreathPace(pace);
      const targetDurationSec = pace / 1000;
      const rate = originalDurationRef.current / targetDurationSec;
      setPlaybackRate(rate);
      setScreen(Screen.SETUP);
    } else {
      console.log('No stored pace found. Setting default pace.');
      const initialPace = originalDurationRef.current * 1000;
      setBreathPace(initialPace);
    }
    console.log('Setting audioStatus to ready.');
    setAudioStatus('ready');
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio Error:", e);
    setAudioStatus('error');
  }
  
  // Update audio playback rate when the state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  
  const currentPace = originalDurationRef.current > 0 ? (originalDurationRef.current * 1000) / playbackRate : 0;

  const handleInit = () => {
    setIsAppInitialized(true);
  };

  const handleTogglePlay = () => {
    if (!audioRef.current || audioStatus !== 'ready') return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };
  
  const adjustSpeed = (adjustment: number) => {
    setPlaybackRate(prev => Math.max(0.5, Math.min(2.0, prev + adjustment)));
  };

  const handleCalibrationComplete = () => {
    handleTogglePlay(); // Stop the audio
    const finalPace = (originalDurationRef.current * 1000) / playbackRate;
    setBreathPace(finalPace);
    localStorage.setItem('breathPace', finalPace.toString());
    setScreen(Screen.SETUP);
  };

  const handleSkipCalibration = () => {
    // Just use the default 8-second pace and move on
    setBreathPace(8000);
    setScreen(Screen.SETUP);
  };
  
  const startSessionAudio = () => {
     if (!audioRef.current || !originalDurationRef.current) return;
     const targetDurationSec = breathPace / 1000;
     const rate = originalDurationRef.current / targetDurationSec;
     audioRef.current.playbackRate = rate;
     audioRef.current.loop = true;
     audioRef.current.play().catch(e => console.error("Session audio play failed:", e));
  }
  
  const stopSessionAudio = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          // Restore the rate used for calibration
          audioRef.current.playbackRate = playbackRate;
      }
  }

  const handleStartSession = (duration: number) => {
    setSessionDuration(duration);
    setScreen(Screen.SESSION);
  };
  
  const handleSessionComplete = (count: number) => {
    stopSessionAudio();
    setBreathCount(count);
    setScreen(Screen.COMPLETE);
  };

  const handleDoAnother = () => {
    setScreen(Screen.SETUP);
  };

  const handleLogMood = () => {
    setScreen(Screen.MOOD_LOG);
  };
  
  const handleMoodLogged = () => {
    const storedPace = localStorage.getItem('breathPace');
    if (storedPace) {
        setScreen(Screen.SETUP);
    } else {
        setScreen(Screen.CALIBRATION);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.CALIBRATION:
        return (
          <CalibrationScreen
            audioStatus={audioStatus}
            isPlaying={isPlaying}
            currentPace={currentPace}
            onTogglePlay={handleTogglePlay}
            onAdjustSpeed={adjustSpeed}
            onComplete={handleCalibrationComplete}
            onSkip={handleSkipCalibration}
          />
        );
      case Screen.SETUP:
        return <SessionSetupScreen breathPace={breathPace} onStart={handleStartSession} />;
      case Screen.SESSION:
        return (
          <BreathingSessionScreen
            breathPace={breathPace}
            sessionDuration={sessionDuration}
            onComplete={handleSessionComplete}
            startAudio={startSessionAudio}
            stopAudio={stopSessionAudio}
          />
        );
      case Screen.COMPLETE:
        return <SessionCompleteScreen sessionDuration={sessionDuration} breathCount={breathCount} onDoAnother={handleDoAnother} onLogMood={handleLogMood} />;
      case Screen.MOOD_LOG:
        return <MoodLoggingScreen onComplete={handleMoodLogged} />;
      default:
        return (
          <CalibrationScreen
            audioStatus={audioStatus}
            isPlaying={isPlaying}
            currentPace={currentPace}
            onTogglePlay={handleTogglePlay}
            onAdjustSpeed={adjustSpeed}
            onComplete={handleCalibrationComplete}
            onSkip={handleSkipCalibration}
          />
        );
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-900 font-sans p-4">
      <audio 
        ref={audioRef} 
        src="/Breath.mp3"
        preload="auto" 
        style={{ display: 'none' }} 
        onLoadedMetadata={handleAudioReady}
        onError={handleAudioError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="w-full max-w-md mx-auto text-center">
        {!isAppInitialized ? (
          <div className="flex flex-col items-center justify-center h-full animate-fadeIn text-center">
            <h1 className="text-4xl font-light text-slate-200 mb-2">The Sighence of Sighing</h1>
            <p className="text-slate-400 mb-10">A guided cyclic sighing experience.</p>
            <button
              onClick={handleInit}
              className="px-12 py-4 bg-cyan-500 text-white text-2xl font-bold rounded-full hover:bg-cyan-600 transition-transform transform hover:scale-105"
            >
              Begin
            </button>
          </div>
        ) : (
          renderScreen()
        )}
      </div>

       {/* --- VISIBLE DIAGNOSTICS PANEL --- */}
       <div className="fixed bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded font-mono">
        <p>isAppInitialized: {isAppInitialized.toString()}</p>
        <p>audioStatus: <span className={audioStatus === 'error' ? 'text-red-500' : audioStatus === 'ready' ? 'text-green-500' : 'text-yellow-500'}>{audioStatus}</span></p>
        <p>isPlaying: {isPlaying.toString()}</p>
      </div>
    </main>
  );
};

export default App;
