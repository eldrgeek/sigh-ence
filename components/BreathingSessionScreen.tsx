
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BreathPhase } from '../types';

interface BreathingSessionScreenProps {
  breathPace: number; // in ms
  sessionDuration: number; // in minutes
  onComplete: (breathCount: number) => void;
  startAudio: () => void;
  stopAudio: () => void;
}

const BreathingSessionScreen: React.FC<BreathingSessionScreenProps> = ({ breathPace, sessionDuration, onComplete, startAudio, stopAudio }) => {
    const [countdown, setCountdown] = useState(4); // 4 seconds: "Get Ready", 3, 2, 1
    const [sessionStarted, setSessionStarted] = useState(false);
    const [phase, setPhase] = useState<BreathPhase>(BreathPhase.INHALE1);
    
    const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    
    const sessionDurationMs = useMemo(() => sessionDuration * 60 * 1000, [sessionDuration]);
    const [remainingTime, setRemainingTime] = useState(sessionDurationMs);

    // Countdown effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setSessionStarted(true);
        }
    }, [countdown]);

    // Main session effect
    useEffect(() => {
        if (!sessionStarted) return;

        startAudio();
        
        // --- Phase management ---
        const inhale1Duration = breathPace * 0.30;
        const inhale2Duration = breathPace * 0.10;
        // Exhale is the remaining 60%

        const updatePhase = () => {
            setPhase(BreathPhase.INHALE1);
            setTimeout(() => {
                setPhase(BreathPhase.INHALE2);
            }, inhale1Duration);
            setTimeout(() => {
                setPhase(BreathPhase.EXHALE);
            }, inhale1Duration + inhale2Duration);
        };
        updatePhase(); // Initial call
        const phaseInterval = setInterval(updatePhase, breathPace);
        // --- End of phase management ---
        
        setRemainingTime(sessionDurationMs);
        const startTime = Date.now();

        // Interval to update the displayed timer
        intervalTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setRemainingTime(Math.max(0, sessionDurationMs - elapsed));
        }, 1000);

        // Timer to end the session
        sessionTimerRef.current = setTimeout(() => {
            const breathCount = Math.floor(sessionDurationMs / breathPace);
            onComplete(breathCount);
        }, sessionDurationMs);

        return () => {
            stopAudio();
            clearInterval(phaseInterval);
            if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
            if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
        };
    }, [sessionStarted, breathPace, sessionDurationMs, onComplete, startAudio, stopAudio]);
    
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const pulseStyle = {
      animation: `pulse ${breathPace}ms infinite ease-in-out`,
    };

    const spinnerStyle = {
        animation: `spin ${breathPace}ms infinite linear`,
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fadeIn">
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); } 
              30% { transform: scale(1.08); } 
              40% { transform: scale(1.1); } 
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .marker-track {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
            .marker {
                position: absolute;
                width: 4px;
                height: 12px;
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 2px;
                /* Position marker in the center of the container */
                top: 50%;
                left: 50%;
                /* Move origin to the center for rotation, then translate out to the edge */
                transform-origin: center;
                /* 144px is half the container width (288px), minus half the marker width (2px) */
                transform: rotate(var(--angle)) translate(140px); 
            }
          `}</style>

          {!sessionStarted ? (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-5xl font-bold text-slate-200">
                    {countdown > 3 ? "Get Ready" : countdown > 0 ? countdown : "Begin"}
                </h1>
            </div>
          ) : (
            <>
              <div
                  className="relative w-72 h-72 rounded-full flex items-center justify-center transition-all duration-1000 bg-slate-700"
                  style={pulseStyle}
              >
                  {/* --- Markers --- */}
                  <div className="marker-track">
                      {/* 0% / 100% mark */}
                      <div className="marker" style={{ '--angle': '-90deg' } as React.CSSProperties}></div>
                      {/* 30% mark (Inhale 1 -> Inhale 2) */}
                      <div className="marker" style={{ '--angle': '18deg' /* -90 + (360 * 0.3) */ } as React.CSSProperties}></div>
                      {/* 40% mark (Inhale 2 -> Exhale) */}
                      <div className="marker" style={{ '--angle': '54deg' /* -90 + (360 * 0.4) */ } as React.CSSProperties}></div>
                  </div>

                  {/* --- Spinning Indicator --- */}
                   <div className="absolute w-full h-full" style={spinnerStyle}>
                        {/* The -translate-x-1/2 moves it left by half its own width to center it */}
                        <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-lg"></div>
                   </div>

                  <p className="text-3xl font-medium text-white z-10">
                      {phase}
                  </p>
              </div>

              <p className="text-4xl font-mono text-slate-400 tracking-wider">{timerDisplay}</p>
            </>
          )}
        </div>
    );
};

export default BreathingSessionScreen;
