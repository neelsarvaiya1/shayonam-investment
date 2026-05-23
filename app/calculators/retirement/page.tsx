'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Banknote, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [inflationRate, setInflationRate] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [existingSavings, setExistingSavings] = useState(500000);

  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const monthsToRetire = yearsToRetire * 12;

  const { targetCorpus, monthlySipNeeded, chartData } = useMemo(() => {
    // 1. Calculate future monthly expenses due to inflation
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
    
    // 2. Calculate corpus required at retirement
    // Assuming 80 years life expectancy (20 years post retirement) and post-retirement return of 8%
    const yearsPostRetire = Math.max(1, 80 - retirementAge);
    const postRetirementReturn = 8;
    const realReturn = ((1 + postRetirementReturn/100) / (1 + inflationRate/100)) - 1;
    let target = 0;
    if (realReturn > 0) {
       target = (futureMonthlyExpenses * 12) * ((1 - Math.pow(1 + realReturn, -yearsPostRetire)) / realReturn);
    } else {
       target = (futureMonthlyExpenses * 12) * yearsPostRetire;
    }

    // 3. See how much existing savings will grow to
    const futureSavings = existingSavings * Math.pow(1 + expectedReturn / 100, yearsToRetire);
    
    // 4. Calculate shortfall
    const shortfall = Math.max(0, target - futureSavings);
    
    // 5. Calculate monthly SIP to bridge the shortfall
    const monthlyRate = expectedReturn / 12 / 100;
    let requiredSip = 0;
    if (shortfall > 0) {
      if (monthlyRate > 0) {
        requiredSip = shortfall / (((Math.pow(1 + monthlyRate, monthsToRetire) - 1) / monthlyRate) * (1 + monthlyRate));
      } else {
        requiredSip = shortfall / monthsToRetire;
      }
    }

    // Chart Data
    const data = [];
    const step = Math.max(1, Math.floor(yearsToRetire / 10)); // points per year
    for (let i = 0; i <= yearsToRetire; i += step) {
      const age = currentAge + i;
      const savGrow = existingSavings * Math.pow(1 + expectedReturn/100, i);
      const mRate = expectedReturn / 12 / 100;
      let sipGrow = 0;
      if (mRate > 0 && i > 0) {
        sipGrow = requiredSip * ((Math.pow(1 + mRate, i * 12) - 1) / mRate) * (1 + mRate);
      }
      
      data.push({
        age: `Age ${age}`,
        corpus: savGrow + sipGrow,
        milestone: target * (i / yearsToRetire) // Ideal straight line progression for visuals
      });
    }

    return {
      targetCorpus: target,
      monthlySipNeeded: requiredSip,
      chartData: data
    };
  }, [currentAge, retirementAge, monthlyExpenses, inflationRate, expectedReturn, existingSavings, yearsToRetire, monthsToRetire]);

  const resetCalculator = () => {
    setCurrentAge(30);
    setRetirementAge(60);
    setMonthlyExpenses(50000);
    setInflationRate(6);
    setExpectedReturn(12);
    setExistingSavings(500000);
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
                <Banknote className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Retirement Calculator</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Find out exactly how much corpus you need to maintain your lifestyle post-retirement, and how much you need to invest monthly to get there.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Your Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <InputSlider
                 label="Current Age"
                 value={currentAge}
                 min={18}
                 max={ retirementAge - 1 }
                 step={1}
                 onChange={setCurrentAge}
                 suffix=" Yrs"
              />
              <InputSlider
                 label="Retirement Age"
                 value={retirementAge}
                 min={ currentAge + 1 }
                 max={75}
                 step={1}
                 onChange={setRetirementAge}
                 suffix=" Yrs"
              />
            </div>

            <InputSlider
               label="Current Monthly Expenses"
               value={monthlyExpenses}
               min={10000}
               max={500000}
               step={5000}
               onChange={setMonthlyExpenses}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Existing Savings"
               value={existingSavings}
               min={0}
               max={10000000}
               step={50000}
               onChange={setExistingSavings}
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
                 label="Inflation Rate"
                 value={inflationRate}
                 min={2}
                 max={12}
                 step={0.5}
                 onChange={setInflationRate}
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
             {/* Result Cards */}
             <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
               <div className="sm:col-span-2">
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Required Retirement Corpus</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate">
                   {formatCurrency(targetCorpus)}
                 </div>
               </div>
               
               <div className="bg-secondary/10 p-6 rounded-2xl sm:col-span-2">
                 <p className="text-secondary font-sans text-sm mb-2">Required Monthly Investment (SIP)</p>
                 <p className="text-3xl font-sans font-bold text-secondary truncate">{formatCurrency(monthlySipNeeded)}</p>
               </div>
             </div>
             
             {/* Charts */}
             <div className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant shadow-sm">
                <h3 className="text-lg font-serif font-bold text-primary mb-6">Corpus Projection</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#B1924E" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#B1924E" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis 
                          dataKey="age" 
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
                          dataKey="corpus" 
                          name="Accumulated Corpus" 
                          stroke="#B1924E" 
                          strokeWidth={3}
                          fill="url(#colorCorpus)" 
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
