'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Calculator, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function SIPCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [duration, setDuration] = useState(10);
  const [isDurationYears, setIsDurationYears] = useState(true);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const months = isDurationYears ? duration * 12 : duration;
  const monthlyRate = expectedReturn / 12 / 100;
  
  // Future Value = P * [((1 + i)^n - 1) / i] * (1 + i)
  const futureValue = useMemo(() => {
    return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  }, [monthlyInvestment, monthlyRate, months]);

  const totalInvestment = monthlyInvestment * months;
  const wealthGained = futureValue - totalInvestment;

  const chartData = useMemo(() => {
    const data = [];
    const step = Math.max(1, Math.floor(months / 20)); // Keep graph data points reasonable
    for (let i = 1; i <= months; i += step) {
        const invested = monthlyInvestment * i;
        const fv = monthlyInvestment * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate) * (1 + monthlyRate);
        data.push({
            period: isDurationYears ? `Year ${(i/12).toFixed(1)}` : `Month ${i}`,
            investment: invested,
            wealth: fv - invested,
            total: fv
        });
    }
    // Add final point
    data.push({
        period: isDurationYears ? `Year ${(months/12).toFixed(1)}` : `Month ${months}`,
        investment: totalInvestment,
        wealth: wealthGained,
        total: futureValue
    });
    return data;
  }, [monthlyInvestment, months, monthlyRate, isDurationYears, totalInvestment, wealthGained, futureValue]);

  const resetCalculator = () => {
    setMonthlyInvestment(10000);
    setDuration(10);
    setIsDurationYears(true);
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
                <Calculator className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">SIP Calculator</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Estimate the potential growth of your mutual fund investments using our interactive Systematic Investment Plan (SIP) calculator.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Investment Details</h2>
            
            <InputSlider
               label="Monthly Investment"
               value={monthlyInvestment}
               min={500}
               max={1000000}
               step={500}
               onChange={setMonthlyInvestment}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <div>
              <div className="flex justify-between items-center mb-6">
                 <label className="font-sans font-medium text-on-surface">Time Period</label>
                 <div className="flex bg-surface-container rounded-lg p-1">
                   <button 
                     onClick={() => {
                        if(!isDurationYears) setDuration(Math.max(1, Math.floor(duration/12)));
                        setIsDurationYears(true);
                     }}
                     className={`px-3 py-1 text-sm font-sans font-bold rounded-md transition-colors ${isDurationYears ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'}`}
                   >
                     Years
                   </button>
                   <button 
                     onClick={() => {
                        if(isDurationYears) setDuration(duration * 12);
                        setIsDurationYears(false);
                     }}
                     className={`px-3 py-1 text-sm font-sans font-bold rounded-md transition-colors ${!isDurationYears ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'}`}
                   >
                     Months
                   </button>
                 </div>
              </div>
              <InputSlider
                 label=""
                 value={duration}
                 min={1}
                 max={isDurationYears ? 40 : 480}
                 step={1}
                 onChange={setDuration}
                 suffix={isDurationYears ? " Yrs" : " Mo"}
              />
            </div>

            <InputSlider
               label="Expected Return Rate (p.a)"
               value={expectedReturn}
               min={1}
               max={30}
               step={0.1}
               onChange={setExpectedReturn}
               suffix="%"
            />
          </motion.div>

          {/* Results & Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 space-y-6"
          >
             {/* Result Cards - Light Background */}
             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative overflow-hidden">
               <div className="sm:col-span-2 md:col-span-3">
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Total Value (Maturity)</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate">
                   {formatCurrency(futureValue)}
                 </div>
               </div>
               
               <div className="bg-surface-container-low p-6 rounded-2xl">
                 <p className="text-on-surface-variant font-sans text-sm mb-2">Invested Amount</p>
                 <p className="text-xl md:text-2xl font-sans font-bold text-primary truncate">{formatCurrency(totalInvestment)}</p>
               </div>
               
               <div className="bg-secondary/10 p-6 rounded-2xl sm:col-span-1 md:col-span-2">
                 <p className="text-secondary font-sans text-sm mb-2">Est. Wealth Gained</p>
                 <p className="text-xl md:text-2xl font-sans font-bold text-secondary truncate">{formatCurrency(wealthGained)}</p>
               </div>
             </div>

             {/* Chart */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm h-[400px]">
               <h3 className="text-lg font-serif font-bold text-primary mb-6">Wealth Projection</h3>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B1924E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#B1924E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                       dataKey="period" 
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
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
                       itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="investment" 
                       name="Invested" 
                       stackId="1"
                       stroke="#0F172A" 
                       strokeWidth={2}
                       fill="url(#colorInvest)" 
                       animationDuration={1000}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="wealth" 
                       name="Wealth Gained" 
                       stackId="1"
                       stroke="#B1924E" 
                       strokeWidth={2}
                       fill="url(#colorWealth)" 
                       animationDuration={1000}
                    />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </motion.div>
        </div>
        
        <ConsultationCTA />
        
        <div className="mt-12 text-center max-w-2xl mx-auto">
           <p className="text-xs text-on-surface-variant/80 font-sans leading-relaxed text-balance">
             * Mutual fund investments are subject to market risks, read all scheme related documents carefully. The returns shown here are estimates based on expected rates and are not guaranteed. For actual advisory and precise portfolio planning, please consult our experts.
           </p>
        </div>
      </div>
    </div>
  );
}

