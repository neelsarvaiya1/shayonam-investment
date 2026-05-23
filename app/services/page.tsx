'use client';

import { motion } from 'motion/react';
import { Landmark, PiggyBank, Receipt, Building, Briefcase, GraduationCap } from 'lucide-react';

const services = [
  {
    title: "Mutual Funds Distributor",
    description: "Expert guidance on selecting the right mutual funds aligned with your risk appetite, investment horizon, and financial goals. We provide ongoing monitoring and rebalancing.",
    icon: PiggyBank,
    bg: "bg-blue-50 text-blue-700",
  },
  {
    title: "Tax Optimization",
    description: "Strategic planning to minimize your tax liabilities. We help structure your investments utilizing tax-efficient vehicles and strategies under the latest tax laws.",
    icon: Receipt,
    bg: "bg-purple-50 text-purple-700",
  },
  {
    title: "Corporate Treasury",
    description: "Optimizing excess cash for businesses. We provide secure, liquid, and yield-generating solutions for corporate funds.",
    icon: Building,
    bg: "bg-slate-50 text-slate-700",
  },
  {
    title: "Children's Future",
    description: "Dedicated strategies to fund your child education and marriage without compromising your retirement.",
    icon: GraduationCap,
    bg: "bg-rose-50 text-rose-700",
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-5xl font-serif font-bold text-primary mb-6">Our Services</h1>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            As an AMFI Registered Mutual Fund Distributor, we provide holistic advisory across your entire financial spectrum.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-surface rounded-2xl p-8 border border-outline-variant hover:shadow-xl transition-shadow group flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${service.bg}`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">{service.title}</h3>
              <p className="text-on-surface-variant font-sans leading-relaxed flex-grow">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
