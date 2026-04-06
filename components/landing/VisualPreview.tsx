'use client';

import { motion } from 'framer-motion';

export const VisualPreview = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-6 py-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-indigo-500/20 blur-[100px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative group"
      >
        {/* Border Glow Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 opacity-50 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] rounded-xl" />
        
        <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
          {/* Browser Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="ml-4 h-5 w-48 bg-zinc-800 rounded-md" />
          </div>

          {/* README Mockup Content */}
          <div className="p-8 space-y-8 min-h-[400px]">
            {/* Banner Section */}
            <div className="w-full h-32 bg-zinc-900 rounded-lg animate-pulse" />
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Pic Placeholder */}
              <div className="w-32 h-32 rounded-full bg-zinc-900 flex-shrink-0 animate-pulse" />
              
              <div className="flex-1 space-y-4">
                <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-900 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-900 rounded animate-pulse" />
                
                {/* Badges */}
                <div className="flex gap-2 pt-4">
                  <div className="h-6 w-20 bg-indigo-500/20 rounded-full border border-indigo-500/30" />
                  <div className="h-6 w-20 bg-indigo-500/20 rounded-full border border-indigo-500/30" />
                  <div className="h-6 w-20 bg-indigo-500/20 rounded-full border border-indigo-500/30" />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-40 bg-zinc-900/50 border border-zinc-800 rounded-lg" />
              <div className="h-40 bg-zinc-900/50 border border-zinc-800 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 blur-2xl rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-2xl rounded-full"
        />
      </motion.div>
    </div>
  );
};
