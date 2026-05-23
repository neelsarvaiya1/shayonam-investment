'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Umbrella, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function InsuranceNeedCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [existingInsurance, setExistingInsurance] = useState(5000000);
  const [outstandingLoans, setOutstandingLoans] = useState(2500000);
  const [futureGoals, setFutureGoals] = useState(5000000); // Child education, marriage, etc.

  const yearsToSupport = Math.max(10, 60 - currentAge); // Support family until nominal retirement age, min 10 yrs

  const { requiredCover, incomeReplacement, chartData } = useMemo(() => {
    // Simple Rule: 10-15x Annual Income OR Income replacement until retirement
    const incomeReplacementVal = annualIncome * yearsToSupport;
    
    const totalNeeds = incomeReplacementVal + outstandingLoans + futureGoals;
    const coverNeeded = Math.max(0, totalNeeds - existingInsurance);

    const data = [
      {
        name: 'Needs',
        'Income Replacement': incomeReplacementVal,
        'Loans': outstandingLoans,
        'Future Goals': futureGoals,
      },
      {
        name: 'Coverage',
        'Existing Life Cover': existingInsurance,
        'Required New Cover': coverNeeded,
      }
    ];

    return { requiredCover: coverNeeded, incomeReplacement: incomeReplacementVal, chartData: data };
  }, [annualIncome, yearsToSupport, outstandingLoans, futureGoals, existingInsurance]);

  const resetCalculator = () => {
    setCurrentAge(30);
    setAnnualIncome(1200000);
    setExistingInsurance(5000000);
    setOutstandingLoans(2500000);
    setFutureGoals(5000000);
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
                <Umbrella className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Insurance Need Calculator</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Ensure your family is protected. Calculate the exact life insurance cover needed to replace your income, clear debts, and fund future goals.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Your Profile</h2>
            
            <InputSlider
               label="Current Age"
               value={currentAge}
               min={18}
               max={65}
               step={1}
               onChange={setCurrentAge}
               suffix=" Yrs"
            />

            <InputSlider
               label="Annual Income"
               value={annualIncome}
               min={300000}
               max={50000000}
               step={100000}
               onChange={setAnnualIncome}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Outstanding Loans (Home, Auto, etc.)"
               value={outstandingLoans}
               min={0}
               max={50000000}
               step={100000}
               onChange={setOutstandingLoans}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Future Goals (Education, Marriage)"
               value={futureGoals}
               min={0}
               max={50000000}
               step={100000}
               onChange={setFutureGoals}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Existing Life Cover (Term Plans)"
               value={existingInsurance}
               min={0}
               max={100000000}
               step={500000}
               onChange={setExistingInsurance}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
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
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Recommended Additional Life Cover</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-rose-600 truncate mb-4">
                   {formatCurrency(requiredCover)}
                 </div>
                 {requiredCover === 0 && (
                   <div className="inline-block bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                     You are adequately covered!
                   </div>
                 )}
                 {requiredCover > 0 && (
                   <p className="text-sm text-on-surface-variant font-sans">
                     Consider a pure term insurance plan for {formatCompactCurrency(requiredCover)} to bridge this gap.
                   </p>
                 )}
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm h-[400px]">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Needs vs Coverage Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={60}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#707781', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompactCurrency} tick={{ fill: '#707781' }} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    
                    {/* Needs Segment */}
                    <Bar dataKey="Income Replacement" stackId="a" fill="#0F172A" radius={[0,0,4,4]} />
                    <Bar dataKey="Loans" stackId="a" fill="#4B5563" />
                    <Bar dataKey="Future Goals" stackId="a" fill="#9CA3AF" radius={[4,4,0,0]} />
                    
                    {/* Coverage Segment */}
                    <Bar dataKey="Existing Life Cover" stackId="b" fill="#B1924E" radius={[0,0,4,4]} />
                    <Bar dataKey="Required New Cover" stackId="b" fill="#ef4444" radius={[4,4,0,0]} />
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
