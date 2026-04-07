'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadmeStore } from '@/store/useReadmeStore';

const steps = [
  { id: 'step1' },
  { id: 'step2' },
  { id: 'step3' },
];

export const HowItWorks = () => {
  const { t } = useTranslation();
  const { uiTheme } = useReadmeStore();
  const isDark = uiTheme === 'dark';

  return (
    <section className={`py-24 px-6 transition-colors duration-500 border-y ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`px-4 py-1 border rounded-full text-[10px] font-mono uppercase tracking-widest mb-4 ${isDark ? 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' : 'border-indigo-500/50 bg-indigo-50 text-indigo-600'}`}
          >
            The Protocol
          </motion.div>
          <h2 className={`text-3xl md:text-5xl font-black italic tracking-tighter uppercase ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
            How it <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className={`hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[1px] -z-10 ${isDark ? 'bg-gradient-to-r from-transparent via-zinc-800 to-transparent' : 'bg-gradient-to-r from-transparent via-zinc-200 to-transparent'}`} />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              // ... (rest of motion props)
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-mono text-lg mb-8 transition-all duration-500 relative ${isDark ? 'bg-zinc-900 border-zinc-800 text-indigo-500 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10' : 'bg-zinc-50 border-zinc-200 text-indigo-600 group-hover:border-indigo-500/50 group-hover:bg-indigo-50'}`}>
                {/* Step Number Glow */}
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">{index + 1}</span>
              </div>

              <h3 className={`text-xl font-black italic tracking-tighter uppercase mb-4 transition-colors ${isDark ? 'text-zinc-100 group-hover:text-indigo-400' : 'text-zinc-900 group-hover:text-indigo-600'}`}>
                {t.landing.howItWorks[step.id as keyof typeof t.landing.howItWorks].title.split('. ')[1]}
              </h3>

              <p className={`font-mono text-sm max-w-[250px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t.landing.howItWorks[step.id as keyof typeof t.landing.howItWorks].desc}
              </p>

              {/* Decorative Tech Detail */}
              <div className={`mt-8 overflow-hidden h-[1px] w-12 transition-all duration-700 group-hover:w-24 group-hover:bg-indigo-500/50 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
