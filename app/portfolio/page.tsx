'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, User } from 'lucide-react';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function PortfolioPage() {
  return (
    <main className="pt-24 pb-16 min-h-screen bg-surface">
      {/* Header Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
            <Lock className="w-4 h-4 text-secondary" />
            Secure Access
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6 tracking-tight">
            Client Portfolio
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant font-sans leading-relaxed">
            Access your consolidated wealth dashboard. Track your investments, review performance, and monitor your progress towards your financial goals.
          </p>
        </motion.div>
      </section>

      {/* Login Section */}
      <section className="px-6 py-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="max-w-md mx-auto"
        >
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6 text-center">Login to your account</h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-sans">Email ID / Client ID</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input 
                    type="text" 
                    placeholder="Enter your registered email" 
                    className="w-full bg-surface-container-low text-primary border border-outline-variant/50 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-sans"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-sans">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full bg-surface-container-low text-primary border border-outline-variant/50 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-sans"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="flex text-sm text-secondary hover:text-primary transition-colors font-medium">Forgot Password?</a>
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-sans font-bold transition-all shadow-[0_4px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.3)] flex items-center justify-center gap-2 group hover:-translate-y-0.5">
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-secondary" />
              </button>
            </form>
            
            <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
              <p className="text-sm text-on-surface-variant font-sans flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary" /> 
                256-bit bank-grade encryption
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Elements */}
      <section className="px-6 py-16">
        <ConsultationCTA />
      </section>
    </main>
  );
}
