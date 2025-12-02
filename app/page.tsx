'use client';
import { useEffect, useState } from 'react';
import ImageCapture from './components/ImageCapture';
import { NutritionResponse } from './types';
import { motion } from 'motion/react';
import DragResultSheet from './components/DragResultSheet';
export default function Home() {
  const [output, setOutput] = useState<NutritionResponse | null>();
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoSubmit = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    setOutput(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/analyse-food`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const result = await response.json();
      setIsLoading(false);
      setOutput(result);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    console.log('Home mounted');
    return () => console.log('Home unmounted');
  }, []);

  return (
    // <div className="flex flex-col h-screen w-screen overflow-hidden">
    //   <h1 className="text-3xl text-center py-6 shrink-0">Nutri Lens</h1>

    //   <div className="flex-1 flex flex-col min-h-0">
    //     <ImageCapture onPhotoSubmit={handlePhotoSubmit} />
    //   </div>
    // </div>
    <main className="flex h-dvh w-full flex-col relative overflow-hidden">
      <h1 className="text-3xl text-center py-10 w-full absolute top-0 left-0 z-1 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
        Nutri Lens
      </h1>
      <section className="flex-1 flex min-h-0 relative">
        {isLoading && (
          <div className="absolute w-full h-full bg-emerald-500/40 z-10">
            <motion.div
              className="w-full h-[3px] bg-white shadow-[0_0_22px_rgba(255,255,255,1)] absolute"
              initial={{ y: 0 }}
              animate={{ y: window.innerHeight }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            ></motion.div>
          </div>
        )}
        <ImageCapture
          onPhotoSubmit={handlePhotoSubmit}
          onRetake={() => setOutput(null)}
          isApiCallLoading={isLoading}
        />
      </section>
      {output && !isLoading && <DragResultSheet apiResponse={output} />}
    </main>
  );
}
