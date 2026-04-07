'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadmeStore } from '@/store/useReadmeStore';

interface Feature {
  id: 'autofill' | 'dragdrop' | 'livepreview';
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: 'autofill',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'dragdrop',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
  },
  {
    id: 'livepreview',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
];

export const FeaturesGrid = () => {
  const { t } = useTranslation();
  const { uiTheme } = useReadmeStore();
  const isDark = uiTheme === 'dark';

  return (
    <section className={`py-24 px-6 transition-colors duration-500 ${isDark ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card Background & Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500" />
              
              <div className={`relative h-full p-8 rounded-lg border transition-all duration-300 flex flex-col items-start ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50' : 'bg-white border-zinc-200 hover:border-indigo-500/50 shadow-sm'}`}>
                <div className={`mb-6 p-3 rounded-md transition-colors ${isDark ? 'bg-zinc-800/50 text-indigo-500' : 'bg-zinc-100 text-indigo-600'}`}>
                  {feature.icon}
                </div>
                
                <h3 className={`text-xl font-black italic tracking-tighter uppercase mb-4 transition-colors ${isDark ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'}`}>
                  {t.landing.features[feature.id].title}
                </h3>
                
                <p className={`font-mono text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {t.landing.features[feature.id].desc}
                </p>

                <div className={`mt-8 flex items-center text-[10px] font-mono uppercase tracking-widest group-hover:text-indigo-500 transition-colors ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  <span className="mr-2">Status:</span>
                  <span className="animate-pulse">Active_</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
