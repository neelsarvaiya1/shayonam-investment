'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Target, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function FinancialFreedomCalculatorPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(60000);
  const [currentInvestments, setCurrentInvestments] = useState(1500000);
  const [monthlySavings, setMonthlySavings] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflation, setInflation] = useState(6);

  const { targetCorpus, yearsToFreedom, chartData, isReachable } = useMemo(() => {
    // FIRE (Financial Independence, Retire Early) Rule of 25x annual expenses.
    // However, we want to account for inflation, so the target grows over time, while our wealth also grows.
    
    let wealth = currentInvestments;
    let target = monthlyExpenses * 12 * 25; // Base target in today's money
    const monthlyReturnRate = expectedReturn / 12 / 100;
    const annualInflation = inflation / 100;

    const data = [];
    let years = 0;
    let reached = false;

    // Simulate year by year for max 40 years
    for (let i = 0; i <= 40; i++) {
        if (i > 0) {
            target = target * (1 + annualInflation); // Target corpus grows with inflation
            
            // Wealth grows by compounding + monthly SIP over 12 months
            wealth = wealth * Math.pow(1 + expectedReturn / 100, 1);
            if (monthlyReturnRate > 0) {
              wealth += monthlySavings * ((Math.pow(1 + monthlyReturnRate, 12) - 1) / monthlyReturnRate) * (1 + monthlyReturnRate);
            } else {
              wealth += monthlySavings * 12;
            }
        }

        if (i % 2 === 0 || i === 40) {
          data.push({
            year: `Year ${i}`,
            wealth: wealth,
            target: target
          });
        }

        if (wealth >= target && !reached) {
            reached = true;
            years = i;
        }
    }

    return { 
      targetCorpus: target, // Final actual target they hit conceptually
      yearsToFreedom: years,
      chartData: data,
      isReachable: reached
    };
  }, [monthlyExpenses, currentInvestments, monthlySavings, expectedReturn, inflation]);

  const resetCalculator = () => {
    setMonthlyExpenses(60000);
    setCurrentInvestments(1500000);
    setMonthlySavings(30000);
    setExpectedReturn(12);
    setInflation(6);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="max-w-3xl mb-12"
        >
          <Link href="/calculators" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-on-surface-variant hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Financial Freedom</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Discover exactly how many years you are away from financial independence, based on the 4% FIRE framework.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 bg-surface p-6 md:p-10 rounded-3xl border border-outline-variant shadow-sm h-fit space-y-10"
          >
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">My Numbers</h2>
            
            <InputSlider
               label="Monthly Expenses"
               value={monthlyExpenses}
               min={10000}
               max={500000}
               step={5000}
               onChange={setMonthlyExpenses}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Current Investments"
               value={currentInvestments}
               min={0}
               max={50000000}
               step={100000}
               onChange={setCurrentInvestments}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Monthly Contrib. towards FIRE"
               value={monthlySavings}
               min={0}
               max={500000}
               step={5000}
               onChange={setMonthlySavings}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <div className="grid grid-cols-2 gap-4">
               <InputSlider
                  label="Expected Return"
                  value={expectedReturn}
                  min={5}
                  max={20}
                  step={0.5}
                  onChange={setExpectedReturn}
                  suffix="%"
               />
               <InputSlider
                  label="Inflation"
                  value={inflation}
                  min={2}
                  max={12}
                  step={0.5}
                  onChange={setInflation}
                  suffix="%"
               />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 space-y-6"
          >
             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
               <div className="sm:col-span-2">
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Years to Financial Freedom</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate">
                   {isReachable ? `${yearsToFreedom} Years` : '40+ Years (Try investing more)'}
                 </div>
                 {isReachable && (
                   <p className="text-sm font-sans mt-2 text-on-surface-variant">
                     You will reach financial independence in {new Date().getFullYear() + yearsToFreedom}.
                   </p>
                 )}
               </div>
               
               <div className="bg-secondary/10 p-6 rounded-2xl sm:col-span-2">
                 <p className="text-secondary font-sans text-sm mb-2">25x Target FIRE Corpus (Inflation Adjusted)</p>
                 <p className="text-2xl md:text-3xl font-sans font-bold text-secondary truncate">{formatCurrency(targetCorpus)}</p>
               </div>
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col">
                <h3 className="text-lg font-serif font-bold text-primary mb-2">The Crossover Point</h3>
                <p className="text-sm text-on-surface-variant font-sans mb-6">When your wealth line crosses the target line, you are &apos;FIRE&apos; ready.</p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0F172A" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#0F172A" stopOpacity={0.2}/>
                         </linearGradient>
                         <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} tickFormatter={formatCompactCurrency} dx={-10} />
                       <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" dataKey="target" name="Moving Target Corpus" stroke="#ef4444" strokeWidth={2} fill="url(#colorTarget)" animationDuration={1000} />
                       <Area type="monotone" dataKey="wealth" name="Your Wealth" stroke="#0F172A" strokeWidth={3} fill="url(#colorWealth)" animationDuration={1500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </motion.div>
        </div>
        <ConsultationCTA />
      </div>
    </div>
  );
}
