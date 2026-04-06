'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

const steps = [
  { id: 'step1' },
  { id: 'step2' },
  { id: 'step3' },
];

export const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 bg-zinc-950 border-y border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1 border border-indigo-500/30 bg-indigo-500/5 rounded-full text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-4"
          >
            The Protocol
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-zinc-100">
            How it <span className="text-zinc-500">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-500 font-mono text-lg mb-8 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all duration-500 relative">
                {/* Step Number Glow */}
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">{index + 1}</span>
              </div>

              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-4 text-zinc-100 group-hover:text-indigo-400 transition-colors">
                {t.landing.howItWorks[step.id as keyof typeof t.landing.howItWorks].title.split('. ')[1]}
              </h3>

              <p className="text-zinc-400 font-mono text-sm max-w-[250px]">
                {t.landing.howItWorks[step.id as keyof typeof t.landing.howItWorks].desc}
              </p>

              {/* Decorative Tech Detail */}
              <div className="mt-8 overflow-hidden h-[1px] w-12 bg-zinc-800 group-hover:w-24 group-hover:bg-indigo-500/50 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
