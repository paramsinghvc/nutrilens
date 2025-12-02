import React, { FC } from 'react';

function clamp(val: number, min = 0, max = 100) {
  return Math.min(Math.max(min, val), max);
}

const Donut: FC<{
  value: number;
  size: number;
  strokeWidth: number;
  title: string;
  trackColor?: string;
  ringColor?: string;
}> = ({
  value,
  size,
  title,
  trackColor = '#e5e7eb',
  ringColor = '#ea5e4d',
  strokeWidth,
}) => {
  const clampedValue = clamp(value);
  const radius = (size - strokeWidth) / 2;
  const circumfrence = 2 * Math.PI * radius;
  const offset = ((100 - clampedValue) / 100) * circumfrence;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumfrence}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-xs font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {value}g
        </div>
      </div>
      <p className="text-xs">{title}</p>
    </div>
  );
};

export default Donut;
