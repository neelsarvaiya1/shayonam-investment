'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { BadgePercent, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function TaxSavingCalculatorPage() {
  const [annualIncome, setAnnualIncome] = useState(1500000);
  const [deduction80c, setDeduction80c] = useState(150000);
  const [medical80d, setMedical80d] = useState(25000);
  const [homeLoanInt, setHomeLoanInt] = useState(0);
  const [hraLta, setHraLta] = useState(0);

  const { oldTax, newTax, recommended, savings, chartData } = useMemo(() => {
    // Basic Old Regime logic
    // 50k Standard Deduction
    let oldTaxable = Math.max(0, annualIncome - 50000 - Math.min(150000, deduction80c) - medical80d - Math.min(200000, homeLoanInt) - hraLta);
    let oldTaxValue = 0;

    if (oldTaxable > 250000) {
      if (oldTaxable <= 500000) {
         oldTaxValue = (oldTaxable - 250000) * 0.05;
         // Rebate 87A
         if (oldTaxable <= 500000) oldTaxValue = 0;
      } else if (oldTaxable <= 1000000) {
         oldTaxValue = 12500 + (oldTaxable - 500000) * 0.2;
      } else {
         oldTaxValue = 112500 + (oldTaxable - 1000000) * 0.3;
      }
    }
    oldTaxValue = oldTaxValue * 1.04; // 4% cess

    // Standard New Regime Logic (2024 updated brackets approx)
    let newTaxable = Math.max(0, annualIncome - 50000); // Only std deduction
    let newTaxValue = 0;
    
    if (newTaxable <= 700000) {
        newTaxValue = 0; // Rebate
    } else {
        if (newTaxable > 300000) newTaxValue += Math.min(300000, newTaxable - 300000) * 0.05;
        if (newTaxable > 600000) newTaxValue += Math.min(300000, newTaxable - 600000) * 0.10;
        if (newTaxable > 900000) newTaxValue += Math.min(300000, newTaxable - 900000) * 0.15;
        if (newTaxable > 1200000) newTaxValue += Math.min(300000, newTaxable - 1200000) * 0.20;
        if (newTaxable > 1500000) newTaxValue += (newTaxable - 1500000) * 0.30;
    }
    newTaxValue = newTaxValue * 1.04; // 4% cess

    const savingsVal = Math.abs(oldTaxValue - newTaxValue);
    const rec = oldTaxValue < newTaxValue ? 'Old Regime' : 'New Regime';

    const data = [
      {
        name: 'Old Regime',
        'Tax Liability': oldTaxValue,
      },
      {
        name: 'New Regime',
        'Tax Liability': newTaxValue,
      }
    ];

    return { oldTax: oldTaxValue, newTax: newTaxValue, recommended: rec, savings: savingsVal, chartData: data };
  }, [annualIncome, deduction80c, medical80d, homeLoanInt, hraLta]);

  const resetCalculator = () => {
    setAnnualIncome(1500000);
    setDeduction80c(150000);
    setMedical80d(25000);
    setHomeLoanInt(0);
    setHraLta(0);
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
                <BadgePercent className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Tax Saving Simulator</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Compare Old vs New Tax Regimes instantly. Make informed decisions and understand how deductions impact your final tax liability.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Income & Deductions</h2>
            
            <InputSlider
               label="Annual Gross Income"
               value={annualIncome}
               min={300000}
               max={50000000}
               step={100000}
               onChange={setAnnualIncome}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="80C Investments (PPF, ELSS)"
               value={deduction80c}
               min={0}
               max={200000}
               step={10000}
               onChange={setDeduction80c}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="80D Medical Insurance"
               value={medical80d}
               min={0}
               max={100000}
               step={5000}
               onChange={setMedical80d}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Section 24(b) Home Loan Interest"
               value={homeLoanInt}
               min={0}
               max={250000}
               step={10000}
               onChange={setHomeLoanInt}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="HRA / LTA Exemption"
               value={hraLta}
               min={0}
               max={1000000}
               step={10000}
               onChange={setHraLta}
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
             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
               <div className="md:col-span-2">
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Recommended Regime</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-emerald-600 truncate">
                   {recommended}
                 </div>
                 {savings > 0 && (
                   <p className="text-sm font-sans mt-2 text-on-surface-variant">
                     You save {formatCurrency(savings)} by choosing the {recommended}.
                   </p>
                 )}
               </div>
               
               <div className={`p-6 rounded-2xl ${recommended === 'Old Regime' ? 'bg-secondary/10 border border-secondary/20' : 'bg-surface-container'}`}>
                 <p className="font-sans text-sm mb-2 opacity-80">Old Regime Liability</p>
                 <p className={`text-2xl font-sans font-bold truncate ${recommended === 'Old Regime' ? 'text-secondary' : 'text-on-surface'}`}>{formatCurrency(oldTax)}</p>
               </div>
               
               <div className={`p-6 rounded-2xl ${recommended === 'New Regime' ? 'bg-secondary/10 border border-secondary/20' : 'bg-surface-container'}`}>
                 <p className="font-sans text-sm mb-2 opacity-80">New Regime Liability</p>
                 <p className={`text-2xl font-sans font-bold truncate ${recommended === 'New Regime' ? 'text-secondary' : 'text-on-surface'}`}>{formatCurrency(newTax)}</p>
               </div>
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm h-[350px]">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Tax Liability Comparison</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barSize={80}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#707781', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompactCurrency} tick={{ fill: '#707781' }} dx={-10} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="Tax Liability" radius={[8,8,0,0]}>
                      {
                        chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === recommended ? '#0F172A' : '#B1924E'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>

             <p className="text-xs text-on-surface-variant font-sans px-4">
               * The calculation uses simplified simplified slabs for illustration. Actual tax slabs may include surcharges for high earners not fully accounted for here. Always consult a tax professional.
             </p>
          </motion.div>
        </div>
        <ConsultationCTA />
      </div>
    </div>
  );
}
