import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const GlassCard = ({ children, className, ...props }: any) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.01 }}
    {...props}
    className={cn(
      "glass p-8 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden relative group",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    {children}
  </motion.div>
);

export const BackgroundGlow = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="glow-overlay top-[-100px] left-[-100px] w-[500px] h-[500px] bg-accent-blue/10" />
    <div className="glow-overlay bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-accent-red/5" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.02)_0%,transparent_70%)]" />
  </div>
);
