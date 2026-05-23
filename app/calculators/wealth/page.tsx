'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Landmark, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function WealthGrowthCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(20);

  const { totalWealth, investedAmount, chartData } = useMemo(() => {
    const months = years * 12;
    const mRate = expectedReturn / 12 / 100;
    
    const futureInitial = initialInvestment * Math.pow(1 + expectedReturn / 100, years);
    let futureSIP = 0;
    if (mRate > 0) {
      futureSIP = monthlyContribution * ((Math.pow(1 + mRate, months) - 1) / mRate) * (1 + mRate);
    } else {
      futureSIP = monthlyContribution * months;
    }

    const tWealth = futureInitial + futureSIP;
    const invAmt = initialInvestment + (monthlyContribution * months);

    const data = [];
    const step = Math.max(1, Math.floor(years / 20));
    for (let i = 0; i <= years; i += step) {
      const fi = initialInvestment * Math.pow(1 + expectedReturn / 100, i);
      let fsip = 0;
      if (mRate > 0 && i > 0) {
        fsip = monthlyContribution * ((Math.pow(1 + mRate, i * 12) - 1) / mRate) * (1 + mRate);
      } else if (i > 0) {
        fsip = monthlyContribution * i * 12;
      }
      
      const totalInvForYear = initialInvestment + (monthlyContribution * i * 12);
      
      data.push({
        year: `Year ${i}`,
        wealth: fi + fsip,
        invested: totalInvForYear
      });
    }

    return { totalWealth: tWealth, investedAmount: invAmt, chartData: data };
  }, [initialInvestment, monthlyContribution, expectedReturn, years]);

  const resetCalculator = () => {
    setInitialInvestment(500000);
    setMonthlyContribution(25000);
    setExpectedReturn(12);
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
                <Landmark className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Wealth Growth</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Visualize the long-term compound growth of your assets by combining lumpsum initial investments with ongoing monthly contributions.
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
               label="Initial Lumpsum Investment"
               value={initialInvestment}
               min={0}
               max={10000000}
               step={50000}
               onChange={setInitialInvestment}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Monthly Contribution"
               value={monthlyContribution}
               min={0}
               max={5000000}
               step={5000}
               onChange={setMonthlyContribution}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Investment Duration"
               value={years}
               min={1}
               max={40}
               step={1}
               onChange={setYears}
               suffix=" Yrs"
            />

            <InputSlider
               label="Expected Return Rate (p.a)"
               value={expectedReturn}
               min={5}
               max={25}
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
             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
               <div className="sm:col-span-2">
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Projected Future Wealth</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate">
                   {formatCurrency(totalWealth)}
                 </div>
               </div>
               
               <div className="bg-surface-container-low p-6 rounded-2xl">
                 <p className="text-on-surface-variant font-sans text-sm mb-2">Total Invested Amount</p>
                 <p className="text-2xl font-sans font-bold text-primary truncate">{formatCurrency(investedAmount)}</p>
               </div>
               
               <div className="bg-secondary/10 p-6 rounded-2xl">
                 <p className="text-secondary font-sans text-sm mb-2">Estimated Wealth Gained</p>
                 <p className="text-2xl font-sans font-bold text-secondary truncate">{formatCurrency(totalWealth - investedAmount)}</p>
               </div>
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Compounding Curve</h3>
                <div className="h-[300px]">
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
                       <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} tickFormatter={formatCompactCurrency} dx={-10} />
                       <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" dataKey="invested" name="Invested Amount" stroke="#0F172A" strokeWidth={2} fill="url(#colorInvest)" animationDuration={1000} stackId="1" />
                       <Area type="monotone" dataKey="wealth" name="Total Wealth" stroke="#B1924E" strokeWidth={3} fill="url(#colorWealth)" animationDuration={1500} stackId="2" />
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
