'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden flex flex-col items-center text-center px-6">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl"
      >
        <motion.h1 
          className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.landing.hero.tagline.split(' ').map((word, i) => (
            <span key={i} className={word.toLowerCase().includes('github') ? 'text-indigo-500' : 'text-zinc-100'}>
              {word}{' '}
            </span>
          ))}
        </motion.h1>

        <motion.p 
          className="text-zinc-400 text-lg md:text-xl font-mono mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.landing.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link 
            href="/builder"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-zinc-100 text-zinc-950 font-black italic uppercase tracking-widest overflow-hidden transition-all hover:pr-12"
          >
            <span className="relative z-10">{t.landing.hero.cta}</span>
            <span className="absolute right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              →
            </span>
            <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0" />
            {/* Button Glow */}
            <div className="absolute -inset-1 bg-indigo-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};
