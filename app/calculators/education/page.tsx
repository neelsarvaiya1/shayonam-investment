'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { GraduationCap, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function ChildEducationCalculatorPage() {
  const [childAge, setChildAge] = useState(3);
  const [collegeAge, setCollegeAge] = useState(18);
  const [currentCost, setCurrentCost] = useState(1500000);
  const [educationInflation, setEducationInflation] = useState(10); // Education inflation is usually higher than normal
  const [expectedReturn, setExpectedReturn] = useState(12);

  const yearsToCollege = Math.max(1, collegeAge - childAge);
  const monthsToCollege = yearsToCollege * 12;
  const monthlyRate = expectedReturn / 12 / 100;

  const { futureCost, monthlySip, chartData } = useMemo(() => {
    // Future cost of education due to high inflation
    const target = currentCost * Math.pow(1 + educationInflation / 100, yearsToCollege);
    
    // Monthly SIP needed
    let sip = 0;
    if (monthlyRate === 0) {
      sip = target / monthsToCollege;
    } else {
      sip = target / (((Math.pow(1 + monthlyRate, monthsToCollege) - 1) / monthlyRate) * (1 + monthlyRate));
    }

    const data = [];
    const step = Math.max(1, Math.floor(yearsToCollege / 15));
    for (let i = 0; i <= yearsToCollege; i += step) {
      let accumulated = 0;
      if (monthlyRate > 0 && i > 0) {
        accumulated = sip * ((Math.pow(1 + monthlyRate, i * 12) - 1) / monthlyRate) * (1 + monthlyRate);
      } else if (i > 0) {
        accumulated = sip * i * 12;
      }
      
      data.push({
        age: `Age ${childAge + i}`,
        projectedWealth: accumulated,
        targetCost: target
      });
    }

    return { futureCost: target, monthlySip: sip, chartData: data };
  }, [childAge, collegeAge, currentCost, educationInflation, expectedReturn, yearsToCollege, monthsToCollege, monthlyRate]);

  const resetCalculator = () => {
    setChildAge(3);
    setCollegeAge(18);
    setCurrentCost(1500000);
    setEducationInflation(10);
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
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Child Education</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Education costs rise faster than standard inflation. Calculate how much you must invest today to secure your child's future higher education.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Education Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <InputSlider
                 label="Child's Current Age"
                 value={childAge}
                 min={0}
                 max={ collegeAge - 1 }
                 step={1}
                 onChange={setChildAge}
                 suffix=" Yrs"
              />
              <InputSlider
                 label="College Age"
                 value={collegeAge}
                 min={ childAge + 1 }
                 max={25}
                 step={1}
                 onChange={setCollegeAge}
                 suffix=" Yrs"
              />
            </div>

            <InputSlider
               label="Current Cost of Education"
               value={currentCost}
               min={100000}
               max={50000000}
               step={100000}
               onChange={setCurrentCost}
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
                 label="Ed. Inflation"
                 value={educationInflation}
                 min={4}
                 max={15}
                 step={0.5}
                 onChange={setEducationInflation}
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
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Required Future Corpus</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate">
                   {formatCurrency(futureCost)}
                 </div>
               </div>
               
               <div className="bg-secondary/10 p-6 rounded-2xl sm:col-span-2">
                 <p className="text-secondary font-sans text-sm mb-2">Required Monthly Investment (SIP)</p>
                 <p className="text-3xl font-sans font-bold text-secondary truncate">{formatCurrency(monthlySip)}</p>
               </div>
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Investment Journey</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorEdu" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0F172A" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#707781' }} tickFormatter={formatCompactCurrency} dx={-10} />
                       <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" dataKey="projectedWealth" name="Accumulated Wealth" stroke="#0F172A" strokeWidth={3} fill="url(#colorEdu)" animationDuration={1500} />
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
