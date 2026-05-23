'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, BarChart3, ChevronDown } from 'lucide-react';
import { useRef } from 'react';


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        ref={containerRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
           <Image
            src="https://picsum.photos/seed/wealth/1920/1080"
            alt="Abstract Wealth Management Background"
            fill
            className="object-cover opacity-30"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-surface-container border border-outline-variant text-primary text-sm font-semibold tracking-widest uppercase mb-6 shadow-sm">
              AMFI Registered Distributor
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary leading-tight mb-8">
              Precision Wealth <br className="hidden md:block" />
              <span className="text-gradient">Management</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
              We guide visionaries and their families through complex financial landscapes, ensuring your legacy is preserved and your wealth actively working for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "backOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/advisory" 
              className="px-8 py-4 bg-primary text-on-primary rounded-xl font-sans font-semibold transition-all shadow-[0_4px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.3)] flex items-center gap-2 group w-full sm:w-auto justify-center hover:-translate-y-0.5"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-secondary" />
            </Link>
            <Link 
              href="/services" 
              className="px-8 py-4 bg-surface-container-lowest border border-outline-variant/50 text-primary rounded-xl font-sans font-semibold hover:bg-surface-container-low transition-all flex items-center gap-2 w-full sm:w-auto justify-center hover:shadow-md hover:-translate-y-0.5"
            >
              Explore Our Services
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-on-surface-variant"
        >
          <span className="text-sm font-semibold uppercase tracking-widest">Scroll to discover</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section with 3D feel Cards */}
      <section className="py-24 md:py-32 bg-surface-container-low relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">A disciplined approach to long-term growth</h2>
            <p className="text-lg text-on-surface-variant font-sans">
              We focus on evidence-based strategies tailored to your unique financial situation, minimizing unnecessary risk while optimizing for sustainable returns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Capital Preservation",
                desc: "Safeguarding your hard-earned wealth is our first priority, building a resilient portfolio against market volatility."
              },
              {
                icon: TrendingUp,
                title: "Active Growth",
                desc: "Strategic asset allocation based on rigorous macroeconomic research to capture upside potential."
              },
              {
                icon: BarChart3,
                title: "Holistic Planning",
                desc: "Integrating tax optimization, estate planning, and cash flow management into one cohesive strategy."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 rounded-2xl flex flex-col items-start gap-6 hover:shadow-[0_20px_40px_rgba(115,91,40,0.1)] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-2">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary">{item.title}</h3>
                <p className="text-on-surface-variant font-sans leading-relaxed flex-grow">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Image / Feature Section */}
      <section className="py-24 md:py-32 overflow-hidden relative bg-primary text-on-primary">
         <div className="absolute inset-0 opacity-10">
           <Image
            src="https://picsum.photos/seed/buildings/1920/1080"
            alt="Architecture"
            fill
            className="object-cover mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
         </div>
         <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Expertise meets technology.</h2>
              <p className="text-lg text-outline-variant font-sans mb-8 leading-relaxed">
                We combine deep financial acumen with state-of-the-art analytical tools to give you unparalleled clarity over your entire net worth. Monitor your performance, understand your exposures, and make decisions with confidence.
              </p>
              <ul className="flex flex-col gap-4">
                {['Real-time portfolio tracking', 'Advanced tax-loss harvesting', 'Scenario modeling & forecasting'].map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-3 font-sans"
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7 }}
               className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://picsum.photos/seed/desk/800/1000"
                alt="Advisory Desk"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 bg-surface text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-low/50"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 tracking-tight">Ready to secure your legacy?</h2>
            <p className="text-lg md:text-xl text-on-surface-variant font-sans mb-10 max-w-2xl mx-auto leading-relaxed">
              Schedule a private consultation with our principal advisors to discuss your family&apos;s unique requirements and begin crafting a tailored wealth strategy.
            </p>
            <Link 
              href="/advisory" 
              className="inline-flex items-center justify-center px-10 py-5 bg-primary text-on-primary rounded-xl font-sans text-lg font-bold transition-all shadow-[0_4px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.3)] hover:-translate-y-1"
            >
              Request a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
