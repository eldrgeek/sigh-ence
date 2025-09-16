import React from 'react';

const Firework: React.FC<{ left: string; top: string; delay: string }> = ({ left, top, delay }) => {
  return (
    <div className="firework" style={{ top, left, animationDelay: delay }}></div>
  );
};

const Fireworks: React.FC = () => {
  return (
    <>
      <style>{`
        .firework {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          opacity: 0;
          animation: firework-animation 1.5s ease-out infinite;
        }

        .firework::before,
        .firework::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        @keyframes firework-animation {
          0% {
            transform: scale(0.1);
            opacity: 1;
          }
          70% {
            transform: scale(25);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
        
        .firework:nth-child(1) { background-color: #ffcc00; }
        .firework:nth-child(2) { background-color: #ff6666; }
        .firework:nth-child(3) { background-color: #66ff66; }
        .firework:nth-child(4) { background-color: #66ccff; }
        .firework:nth-child(5) { background-color: #cc66ff; }
        .firework:nth-child(6) { background-color: #ff99cc; }
      `}</style>
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Firework left="20%" top="50%" delay="0s" />
        <Firework left="80%" top="50%" delay="0.2s" />
        <Firework left="50%" top="20%" delay="0.4s" />
        <Firework left="30%" top="80%" delay="0.6s" />
        <Firework left="70%" top="20%" delay="0.8s" />
        <Firework left="50%" top="70%" delay="1s" />
      </div>
    </>
  );
};

export default Fireworks;
