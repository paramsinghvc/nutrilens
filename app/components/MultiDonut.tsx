import React, { FC } from 'react';

function clamp(val: number, min = 0, max = 100) {
  return Math.min(Math.max(min, val), max);
}

export type MultiDonutValue = {
  value: number;
  ringColor?: string;
};

const MultiDonut: FC<{
  value: number;
  title: string;
  size: number;
  strokeWidth: number;
  trackColor?: string;
  values: MultiDonutValue[];
}> = ({ value, title, size, trackColor = '#e5e7eb', values, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumfrence = 2 * Math.PI * radius;

  const { ringsData } = values.reduce(
    (acc, { value, ringColor }) => {
      acc.ringsData.push({
        value,
        ringColor,
        rotation: (acc.accumulatedPercentage / 100) * 360,
      });
      acc.accumulatedPercentage = acc.accumulatedPercentage + value;
      return acc;
    },
    { accumulatedPercentage: 0, ringsData: [] } as {
      accumulatedPercentage: number;
      ringsData: Array<{
        value: number;
        ringColor?: string;
        rotation: number;
      }>;
    }
  );

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
          {ringsData.reverse().map(({ value, ringColor, rotation }, index) => (
            <g
              key={index}
              transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumfrence}
                strokeDashoffset={((100 - value) / 100) * circumfrence}
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
        <div className="absolute text-xs font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          {value}
          <span className="text-[10px]">kCal</span>
        </div>
      </div>
      <p className="text-xs">{title}</p>
    </div>
  );
};

export default MultiDonut;
