import React, { FC } from 'react';
import { MicroAmount } from '../types';

export const colorMap: Record<MicroAmount, string> = {
  High: 'bg-emerald-300',
  Moderate: 'bg-amber-300',
  Low: 'bg-rose-300',
};

export type MicroNutrientType = {
  nutrients: Array<{ nutrient: string; amount: string; note: string }>;
  category: MicroAmount;
};

const NutrientSection: FC<MicroNutrientType> = ({
  category,
  nutrients = [],
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs uppercase tracking-wider">{category}</h3>
      <ul className="text-sm relative">
        <div
          className={`absolute h-full w-1 ${colorMap[category]} left-0 top-0 rounded-sm`}
        ></div>
        {nutrients.map(({ nutrient, amount, note }, index) => (
          <li
            key={index}
            className="flex flex-col px-4 py-2 first-of-type:pt-0 last-of-type:pb-0"
          >
            <div key={index} className="flex justify-between">
              <span>{nutrient}</span>
              <span>{amount}</span>
            </div>
            <span className="text-xs capitalize">{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutrientSection;
