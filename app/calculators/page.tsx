'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Calculator, LineChart, Shield, Home, GraduationCap, Banknote, Umbrella, Target, Landmark, BadgePercent } from 'lucide-react';

const categories = [
  {
    name: "Investment Planning",
    calculators: [
      { id: "sip", name: "SIP Calculator", desc: "Calculate wealth accumulated through regular monthly investments.", icon: LineChart, bestFor: "Wealth Builders", href: "/calculators/sip" },
      { id: "goal", name: "Goal Planning", desc: "Find out how much you need to invest for a specific financial goal.", icon: Target, href: "/calculators/goal" },
      { id: "wealth", name: "Wealth Growth", desc: "Visualize the long-term compound growth of your investments.", icon: Landmark, href: "/calculators/wealth" },
    ]
  },
  {
    name: "Family Security",
    calculators: [
      { id: "insurance", name: "Insurance Need", desc: "Discover the required life insurance cover for your family's safety.", icon: Umbrella, href: "/calculators/insurance" },
      { id: "education", name: "Child Education", desc: "Calculate investment required to fund your child's higher education.", icon: GraduationCap, href: "/calculators/education" },
      { id: "emergency", name: "Emergency Fund", desc: "Determine the ideal corpus to protect against unexpected expenses.", icon: Shield, href: "/calculators/emergency" },
    ]
  },
  {
    name: "Loans & Finance",
    calculators: [
      { id: "emi", name: "EMI Calculator", desc: "Calculate monthly installments for personal, auto, or home loans.", icon: Home, href: "/calculators/emi" },
      { id: "tax", name: "Tax Saving", desc: "Estimate tax savings and optimize your deductions.", icon: BadgePercent, href: "/calculators/tax" },
    ]
  },
  {
    name: "Retirement",
    calculators: [
      { id: "retirement", name: "Retirement Corpus", desc: "Find out how much you need to retire comfortably based on expenses.", icon: Banknote, href: "/calculators/retirement" },
      { id: "swp", name: "SWP Calculator", desc: "Plan systematic withdrawals for regular income during retirement.", icon: Calculator, href: "/calculators/swp" },
      { id: "freedom", name: "Financial Freedom", desc: "Calculate the exact years required to achieve financial independence.", icon: Target, href: "/calculators/freedom" },
    ]
  }
];

export default function PlanningToolsIndex() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <h1 className="text-5xl font-serif font-bold text-primary">Financial Planning Tools</h1>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Take guesswork out of your financial journey. Use our advanced calculators to plan for investments, loans, retirement, and your family&apos;s secure future.
          </p>
        </motion.div>

        <div className="space-y-16">
          {categories.map((category, catIndex) => (
            <motion.div 
               key={category.name}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-serif font-bold text-primary mb-8 border-b border-outline-variant pb-4">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {category.calculators.map((calc) => (
                     <Link 
                       key={calc.id} 
                       href={calc.href}
                       className="block rounded-2xl border border-outline-variant/30 p-8 transition-all duration-300 bg-surface-container-lowest hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:border-secondary/30"
                     >
                       <div className="flex items-start justify-between mb-6">
                         <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary/5 text-secondary">
                           <calc.icon className="w-7 h-7" />
                         </div>
                         {'bestFor' in calc && calc.bestFor && (
                           <span className="text-[10px] uppercase tracking-wider font-bold bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">
                             {calc.bestFor}
                           </span>
                         )}
                       </div>
                       <h3 className="text-xl font-serif font-bold text-primary mb-3">{calc.name}</h3>
                       <p className="text-sm text-on-surface-variant font-sans leading-relaxed">
                         {calc.desc}
                       </p>
                     </Link>
                 ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
