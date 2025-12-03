import { motion, PanInfo, useMotionValue } from 'motion/react';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import Donut from './Donut';
import MultiDonut from './MultiDonut';
import NutrientSection, { MicroNutrientType } from './NutrientSection';
import { MicroAmount, NutritionResponse } from '../types';

const ItemChip: FC<{ name: string; qty: string }> = ({ name, qty }) => (
  <div className="rounded-3xl bg-emerald-100 pl-4 flex items-center overflow-hidden gap-2 text-xs capitalize">
    {name}
    <div className=" bg-emerald-200 px-4 py-1 flex">{qty}</div>
  </div>
);

const InfoSection: FC<{ title: string; children?: ReactNode }> = ({
  title,
  children,
}) => (
  <section className="flex flex-col gap-2 w-full">
    <h3 className="font-semibold text-sm uppercase tracking-wide">{title}</h3>
    {children}
  </section>
);

const DragResultSheet: FC<{ apiResponse: NutritionResponse }> = ({
  apiResponse: data,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const [dragEnabled, setDragEnabled] = useState(true);
  const [dragBounds, setDragBounds] = useState(() => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0 };
    const height = window.innerHeight;
    return { top: 0, bottom: height - 50 };
  });

  useEffect(() => {
    // Set initial position AFTER mount (safe)
    if (typeof window !== 'undefined') {
      y.set(window.innerHeight / 2);
    }

    // Handle resize updates
    const handleResize = () => {
      const height = window.innerHeight;
      setDragBounds({ top: 0, bottom: height - 50 });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [y]);

  const handleDragEnd = (_: Event, info: PanInfo) => {
    const dragDistance = info.point.y;

    if (dragDistance > window.innerHeight / 3) {
      y.set(window.innerHeight - 50);
    } else {
      y.set(0);
    }
  };

  // 🔥 Listen to scroll inside the sheet
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onScroll = () => {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
      // enable drag only when near the top
      setDragEnabled(atTop || atBottom);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (data.error)
    return (
      <div role="alert" className="p-4 text-sm rounded-xl">
        {data.error}
      </div>
    );

  const micronutrientsData = Object.entries(data.micronutrients).reduce(
    (acc, [key, value]) => {
      const category = acc[value.category];
      if (!category) {
        acc[value.category] = [];
      }
      acc[value.category].push({
        nutrient: key,
        amount: value.amount,
        note: value.note,
      });
      return acc;
    },
    {} as Record<MicroAmount, MicroNutrientType['nutrients']>
  );

  return (
    <motion.section
      ref={sheetRef}
      style={{ y }}
      drag={dragEnabled ? 'y' : false}
      dragConstraints={dragBounds}
      onDragEnd={handleDragEnd}
      dragElastic={0.2}
      className="absolute w-full h-dvh bottom-0 bg-white rounded-t-3xl flex flex-col items-center px-10 pt-2 pb-20 z-2 text-black overflow-y-auto touch-pan-y"
    >
      <div className="w-[100px] h-[5px] bg-gray-200 rounded-sm absolute"></div>
      <section className="flex flex-col items-start w-full pt-10 gap-8">
        <InfoSection title="Identified items">
          <div className="flex flex-wrap gap-4">
            {data.estimatedPortionSize.map(({ itemName, itemSize }) => (
              <ItemChip key={itemName} name={itemName} qty={itemSize} />
            ))}
          </div>
        </InfoSection>
        <InfoSection title="Macros">
          <div className="flex gap-8 overflow-x-auto">
            <MultiDonut
              value={data.macros.calories}
              strokeWidth={5}
              size={50}
              values={[
                { value: data.macros.protein, ringColor: '#fab1a0' },
                { value: data.macros.carbs, ringColor: '#badc58' },
                { value: data.macros.fats, ringColor: '#fdcb6e' },
              ]}
              title="Calories"
            />
            <Donut
              value={data.macros.protein}
              strokeWidth={5}
              size={50}
              ringColor="#fab1a0"
              title="Protein"
            />
            <Donut
              value={data.macros.carbs}
              strokeWidth={5}
              size={50}
              ringColor="#badc58"
              title="Carbs"
            />
            <Donut
              value={data.macros.fats}
              strokeWidth={5}
              size={50}
              ringColor="#fdcb6e"
              title="Fats"
            />
          </div>
        </InfoSection>
        <InfoSection title="Micronutrients">
          <div className="flex flex-col gap-6 pt-2">
            <NutrientSection
              category={'High' as MicroAmount}
              nutrients={micronutrientsData.High}
            />
            <NutrientSection
              category={'Moderate' as MicroAmount}
              nutrients={micronutrientsData.Moderate}
            />
            <NutrientSection
              category={'Low' as MicroAmount}
              nutrients={micronutrientsData.Low}
            />
          </div>
        </InfoSection>
        <InfoSection title="Health notes">
          <ul className="text-sm">
            {data.health_notes.map((note, i) => (
              <li key={i} className="pb-1">
                {note}
              </li>
            ))}
          </ul>
        </InfoSection>
        <InfoSection title="Health suggestions">
          <ul className="text-sm">
            {data.healthier_suggestions.map((suggestion, i) => (
              <li key={i} className="pb-1">
                {suggestion}
              </li>
            ))}
          </ul>
        </InfoSection>
      </section>
    </motion.section>
  );
};

export default DragResultSheet;
