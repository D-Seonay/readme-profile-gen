'use client';
import { motion } from 'framer-motion';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const OnboardingTour = () => {
  const { isTourActive, currentTourStep, setTourStep, completeTour } = useReadmeStore();
  const { t } = useTranslation();

  const steps = [t.tour.step1, t.tour.step2, t.tour.step3];

  if (!isTourActive) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 w-full md:w-1/2 p-6 z-[100] pointer-events-none"
    >
      <div className="bg-zinc-950/90 border border-indigo-500/50 backdrop-blur-md rounded-xl p-4 flex items-center justify-between shadow-[0_0_30px_rgba(99,102,241,0.2)] pointer-events-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">Step 0{currentTourStep + 1}</span>
          <p className="text-xs font-mono text-zinc-100">{steps[currentTourStep]}</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={completeTour} className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors">
            {t.tour.skip}
          </button>
          <button 
            onClick={() => currentTourStep < 2 ? setTourStep(currentTourStep + 1) : completeTour()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-mono px-4 py-2 rounded uppercase tracking-widest transition-all"
          >
            {currentTourStep < 2 ? t.tour.next : t.tour.finish}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
