'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Shield, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function EmergencyFundCalculatorPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [dependents, setDependents] = useState(2);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const { recommendedMonths, recommendedCorpus, chartData } = useMemo(() => {
    let baseMonths = 6;
    if (riskLevel === 'low') baseMonths = 3;
    if (riskLevel === 'high') baseMonths = 9;

    const totalMonths = baseMonths + dependents; // 1 month extra per dependent
    const corpus = totalMonths * monthlyExpenses;

    const data = [
      { name: 'Minimum (3 Months)', value: 3 * monthlyExpenses },
      { name: 'Recommended', value: corpus },
      { name: 'Ultra-safe (12+)', value: Math.max(12 * monthlyExpenses, corpus + (3 * monthlyExpenses)) }
    ];

    return { recommendedMonths: totalMonths, recommendedCorpus: corpus, chartData: data };
  }, [monthlyExpenses, dependents, riskLevel]);

  const resetCalculator = () => {
    setMonthlyExpenses(50000);
    setDependents(2);
    setRiskLevel('medium');
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
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Emergency Fund</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Protect yourself against job loss, medical emergencies, or unexpected expenses with an ideal buffer corpus designed for your lifestyle risk.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 bg-surface p-6 md:p-10 rounded-3xl border border-outline-variant shadow-sm h-fit space-y-10"
          >
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Risk Factors</h2>
            
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
               label="Number of Dependents"
               value={dependents}
               min={0}
               max={10}
               step={1}
               onChange={setDependents}
            />

            <div>
              <label className="font-sans font-medium text-on-surface block mb-4">Job / Income Risk Level</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setRiskLevel('low')}
                  className={`p-3 text-sm font-bold rounded-xl border ${riskLevel === 'low' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'}`}
                >
                  Low<br/><span className="text-xs font-normal opacity-80">(Govt / Stable Job)</span>
                </button>
                <button 
                  onClick={() => setRiskLevel('medium')}
                  className={`p-3 text-sm font-bold rounded-xl border ${riskLevel === 'medium' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'}`}
                >
                  Medium<br/><span className="text-xs font-normal opacity-80">(Pvt Sector)</span>
                </button>
                <button 
                  onClick={() => setRiskLevel('high')}
                  className={`p-3 text-sm font-bold rounded-xl border ${riskLevel === 'high' ? 'bg-rose-500 text-white border-rose-500' : 'bg-surface-container-low text-on-surface-variant border-outline-variant'}`}
                >
                  High<br/><span className="text-xs font-normal opacity-80">(Business / Gig)</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 space-y-6"
          >
             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden">
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Recommended Corpus ({recommendedMonths} Months of Expenses)</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate mb-4">
                   {formatCurrency(recommendedCorpus)}
                 </div>
                 <p className="text-sm text-on-surface-variant font-sans">
                   Park this money in high-liquidity instruments like Liquid Mutual Funds or Fixed Deposits where capital preservation is guaranteed.
                 </p>
             </div>
             
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm h-[300px]">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Safety Tiers</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }} barSize={60}>
                    <defs>
                       <linearGradient id="colorTier" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F172A" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0F172A" stopOpacity={0.4}/>
                       </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#707781', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompactCurrency} tick={{ fill: '#707781', fontSize: 12 }} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="url(#colorTier)" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>
        </div>
        <ConsultationCTA />
      </div>
    </div>
  );
}
