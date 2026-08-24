'use client';

import React, { useEffect, useState } from 'react';
import { getScoreColor } from '@/lib/utils/formatters';

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg' | 'hero';
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export default function ScoreRing({
  score,
  size = 'md',
  label = 'COMPATIBILITY SCORE',
  showLabel = true,
  className = '',
}: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Circumference for r=45 is 2 * PI * 45 ≈ 282.74
  const circumference = 282.74;
  const strokeDash = ((Math.min(100, Math.max(0, animatedScore)) / 100) * circumference).toFixed(1);
  const colorInfo = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const sizeClasses = {
    sm: 'w-20 h-20 text-xl',
    md: 'w-28 h-28 text-2xl',
    lg: 'w-44 h-44 text-4xl',
    hero: 'w-72 h-72 md:w-96 md:h-96 text-7xl md:text-8xl',
  }[size];

  const strokeWidth = size === 'hero' ? 2.5 : size === 'lg' ? 3.5 : 4.5;

  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`}>
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e2e1"
            strokeWidth={strokeWidth}
          />
          {/* Animated score circle */}
          <circle
            className="score-ring"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={colorInfo.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span
            className={`font-bold tracking-tight text-on-surface leading-none ${
              size === 'hero' ? 'font-display-hero text-[72px] md:text-[96px]' : ''
            }`}
          >
            {animatedScore}
          </span>
          {size === 'hero' && showLabel && (
            <span className="font-label-caps text-[11px] text-on-surface-variant tracking-[0.25em] uppercase mt-3">
              {label}
            </span>
          )}
        </div>
      </div>

      {size !== 'hero' && showLabel && (
        <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase mt-2 text-center">
          {label}
        </span>
      )}
    </div>
  );
}
