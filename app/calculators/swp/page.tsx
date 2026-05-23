'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Calculator, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function SWPCalculatorPage() {
  const [initialCorpus, setInitialCorpus] = useState(10000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [years, setYears] = useState(20);

  const { finalValue, totalWithdrawn, isDepleted, depletionYear, chartData } = useMemo(() => {
    let balance = initialCorpus;
    const monthlyRate = expectedReturn / 12 / 100;
    const months = years * 12;
    let withdrawn = 0;
    
    let depleted = false;
    let depYear = 0;

    const data = [];
    const step = Math.max(1, Math.floor(months / 20));

    for (let i = 1; i <= months; i++) {
      if (balance > 0) {
        balance += (balance * monthlyRate); // add interest
        if (balance >= monthlyWithdrawal) {
          balance -= monthlyWithdrawal; // subtract withdrawal
          withdrawn += monthlyWithdrawal;
        } else {
          withdrawn += balance;
          balance = 0;
          if (!depleted) {
            depleted = true;
            depYear = i / 12;
          }
        }
      }

      if (i % step === 0 || i === months) {
        data.push({
          year: `Year ${(i/12).toFixed(1)}`,
          balance: Math.max(0, balance),
          withdrawn: withdrawn
        });
      }
    }

    return { 
      finalValue: balance, 
      totalWithdrawn: withdrawn, 
      isDepleted: depleted, 
      depletionYear: depYear,
      chartData: data 
    };
  }, [initialCorpus, monthlyWithdrawal, expectedReturn, years]);

  const resetCalculator = () => {
    setInitialCorpus(10000000);
    setMonthlyWithdrawal(50000);
    setExpectedReturn(8);
    setYears(20);
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
                <Calculator className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">SWP Calculator</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Plan your Systematic Withdrawal Plan (SWP). See how long your retirement corpus will last at your desired monthly withdrawal rate.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Withdrawal Plan</h2>
            
            <InputSlider
               label="Initial Corpus"
               value={initialCorpus}
               min={100000}
               max={100000000}
               step={100000}
               onChange={setInitialCorpus}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Monthly Withdrawal Need"
               value={monthlyWithdrawal}
               min={1000}
               max={1000000}
               step={1000}
               onChange={setMonthlyWithdrawal}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Expected Return (p.a)"
               value={expectedReturn}
               min={4}
               max={15}
               step={0.5}
               onChange={setExpectedReturn}
               suffix="%"
            />

            <InputSlider
               label="Time Period"
               value={years}
               min={1}
               max={40}
               step={1}
               onChange={setYears}
               suffix=" Yrs"
            />
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
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Final Corpus Value</p>
                 <div className={`text-4xl md:text-5xl font-serif font-bold truncate ${isDepleted ? 'text-rose-600' : 'text-primary'}`}>
                   {formatCurrency(finalValue)}
                 </div>
                 {isDepleted && (
                   <p className="text-rose-600/80 font-sans mt-2 text-sm">
                     Warning: Your corpus depletes entirely in Year {depletionYear.toFixed(1)}. Please lower withdrawals or increase capital.
                   </p>
                 )}
               </div>
               
               <div className="bg-surface-container-low p-6 rounded-2xl">
                 <p className="text-on-surface-variant font-sans text-sm mb-2">Initial Corpus</p>
                 <p className="text-2xl font-sans font-bold text-primary truncate">{formatCurrency(initialCorpus)}</p>
               </div>
               
               <div className="bg-emerald-50 p-6 rounded-2xl">
                 <p className="text-emerald-700 font-sans text-sm mb-2">Total Amount Withdrawn</p>
                 <p className="text-2xl font-sans font-bold text-emerald-700 truncate">{formatCurrency(totalWithdrawn)}</p>
               </div>
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Corpus Preservation</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor={isDepleted ? "#ef4444" : "#B1924E"} stopOpacity={0.3}/>
                           <stop offset="95%" stopColor={isDepleted ? "#ef4444" : "#B1924E"} stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} tickFormatter={formatCompactCurrency} dx={-10} />
                       <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                       <Area 
                         type="monotone" 
                         dataKey="balance" 
                         name="Remaining Balance" 
                         stroke={isDepleted ? "#ef4444" : "#B1924E"} 
                         strokeWidth={3} 
                         fill="url(#colorBalance)" 
                         animationDuration={1500} 
                       />
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
