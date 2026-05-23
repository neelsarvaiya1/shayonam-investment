'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Target, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function GoalPlanningCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState(5000000);
  const [years, setYears] = useState(5);
  const [existingSavings, setExistingSavings] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const months = years * 12;
  const monthlyRate = expectedReturn / 12 / 100;

  const { requiredSip, chartData } = useMemo(() => {
    // Future value of existing savings
    const futureSavings = existingSavings * Math.pow(1 + expectedReturn / 100, years);
    
    const shortfall = Math.max(0, targetAmount - futureSavings);

    let sip = 0;
    if (shortfall > 0) {
      if (monthlyRate === 0) {
        sip = shortfall / months;
      } else {
        sip = shortfall / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      }
    }

    const data = [];
    const step = Math.max(1, Math.floor(years / 20)); // Keep graph data points reasonable
    for (let i = 0; i <= years; i += step) {
      const yearSavings = existingSavings * Math.pow(1 + expectedReturn / 100, i);
      let yearSip = 0;
      if (monthlyRate > 0 && i > 0) {
        yearSip = sip * ((Math.pow(1 + monthlyRate, i * 12) - 1) / monthlyRate) * (1 + monthlyRate);
      } else if (i > 0) {
        yearSip = sip * i * 12;
      }
      data.push({
        year: `Year ${i}`,
        accumulated: yearSavings + yearSip,
        target: targetAmount
      });
    }

    return { requiredSip: sip, chartData: data };
  }, [targetAmount, years, existingSavings, expectedReturn, months, monthlyRate]);

  const resetCalculator = () => {
    setTargetAmount(5000000);
    setYears(5);
    setExistingSavings(500000);
    setExpectedReturn(12);
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
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Goal Planning</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Find out exactly how much you need to invest every month to reach a specific financial goal down the line.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Goal Details</h2>
            
            <InputSlider
               label="Target Amount"
               value={targetAmount}
               min={100000}
               max={50000000}
               step={100000}
               onChange={setTargetAmount}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Years to Goal"
               value={years}
               min={1}
               max={30}
               step={1}
               onChange={setYears}
               suffix=" Yrs"
            />

            <InputSlider
               label="Existing Savings allocated to this goal"
               value={existingSavings}
               min={0}
               max={20000000}
               step={50000}
               onChange={setExistingSavings}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Expected Return (p.a)"
               value={expectedReturn}
               min={5}
               max={20}
               step={0.5}
               onChange={setExpectedReturn}
               suffix="%"
            />

          </motion.div>

          {/* Results */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 space-y-6"
          >
             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden">
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Required Monthly Investment (SIP)</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate">
                   {formatCurrency(requiredSip)}
                 </div>
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Goal Progress Timeline</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#B1924E" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#B1924E" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis 
                          dataKey="year" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#707781' }}
                          dy={10}
                       />
                       <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#707781' }}
                          tickFormatter={formatCompactCurrency}
                          dx={-10}
                       />
                       <Tooltip 
                          formatter={(value: any) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontWeight: 'bold' }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="accumulated" 
                          name="Projected Wealth" 
                          stroke="#B1924E" 
                          strokeWidth={3}
                          fill="url(#colorGoal)" 
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
