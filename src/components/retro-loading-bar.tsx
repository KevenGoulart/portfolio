'use client'

import React from 'react'

type Props = {
  bars?: number
  loop?: boolean
  className?: string
}

export default function RetroLoadingBar({
  bars = 10,
  loop = true,
  className = ''
}: Props) {
  const segments = Array.from({ length: bars })

  return (
    <div
      className={`retro-loading ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="retro-track" aria-hidden>
        {segments.map((_, i) => (
          <span
            key={i}
            className="retro-segment"
            style={{
              animationDelay: `${i * 120}ms`,
              animationIterationCount: loop ? 'infinite' : '1'
            }}
          />
        ))}
      </div>

      <style>{`
        .retro-loading { display: inline-block; }
        .retro-track {
          width: 350px;
          height: 25px;
          padding: 4px;
          background: linear-gradient(180deg,#04100a,#021006);
          border: 3px solid #0b3b16;
          border-radius: 8px;
          box-shadow: 0 6px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .retro-segment{
          flex: 1;
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(180deg, rgba(99,255,94,0.95), rgba(30,180,60,0.9));
          transform-origin: left center;
          transform: scaleX(0);
          box-shadow: 0 0 8px rgba(60,255,110,0.12), 0 1px 0 rgba(255,255,255,0.03) inset;
          opacity: 0.25;
          animation-name: retro-fill;
          animation-duration: 900ms;
          animation-timing-function: cubic-bezier(.2,.9,.2,1);
          animation-fill-mode: forwards;
        }

        @keyframes retro-fill {
          0% { transform: scaleX(0); opacity: 0.25; filter: blur(0.5px); }
          60% { transform: scaleX(1.05); opacity: 1; filter: blur(0px); }
          100% { transform: scaleX(1); opacity: 1; }
        }

        .retro-segment[style*="animation-iteration-count: infinite"] {
          animation-direction: alternate;
        }

        @media (max-width: 520px) {
          .retro-track { width: 200px; gap: 4px; height: 14px; }
        }
      `}</style>
    </div>
  )
}
