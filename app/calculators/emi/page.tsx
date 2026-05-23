'use client';

import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Home, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { InputSlider } from '@/components/InputSlider';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';
import { ConsultationCTA } from '@/components/ConsultationCTA';

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [duration, setDuration] = useState(20);
  const [isDurationYears, setIsDurationYears] = useState(true);
  const [interestRate, setInterestRate] = useState(8.5);

  const months = isDurationYears ? duration * 12 : duration;
  const monthlyRate = interestRate / 12 / 100;
  
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = useMemo(() => {
    if (monthlyRate === 0) return loanAmount / months;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [loanAmount, monthlyRate, months]);

  const totalPayable = emi * months;
  const totalInterest = totalPayable - loanAmount;

  const chartData = useMemo(() => {
    const data = [];
    let balance = loanAmount;
    let accumulatedInterest = 0;
    
    // Create points per year or reasonable steps
    const step = Math.max(1, Math.floor(months / 20));
    
    for (let i = 1; i <= months; i++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      balance -= principalForMonth;
      accumulatedInterest += interestForMonth;
      
      if (i % step === 0 || i === months) {
        data.push({
            period: isDurationYears ? `Year ${(i/12).toFixed(1)}` : `Month ${i}`,
            balance: Math.max(0, balance),
            totalInterest: accumulatedInterest,
        });
      }
    }
    return data;
  }, [loanAmount, emi, monthlyRate, months, isDurationYears]);

  const resetCalculator = () => {
    setLoanAmount(5000000);
    setDuration(20);
    setIsDurationYears(true);
    setInterestRate(8.5);
  };

  const pieData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: totalInterest },
  ];
  const COLORS = ['#0F172A', '#B1924E']; // Primary and Secondary loosely

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
                <Home className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">EMI Calculator</h1>
            </div>
            <button onClick={resetCalculator} className="p-3 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-full transition-colors" title="Reset Calculator">
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl text-on-surface-variant font-sans leading-relaxed">
            Plan your home, auto, or personal loans. Calculate your Equated Monthly Installment (EMI) and understand your total interest outgo.
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-8">Loan Details</h2>
            
            <InputSlider
               label="Loan Amount"
               value={loanAmount}
               min={100000}
               max={100000000}
               step={100000}
               onChange={setLoanAmount}
               prefix="₹"
               formatValue={(val) => new Intl.NumberFormat('en-IN').format(val)}
            />

            <InputSlider
               label="Interest Rate (p.a)"
               value={interestRate}
               min={1}
               max={25}
               step={0.1}
               onChange={setInterestRate}
               suffix="%"
            />

            <div>
              <div className="flex justify-between items-center mb-6">
                 <label className="font-sans font-medium text-on-surface">Loan Tenure</label>
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
                 <p className="text-on-surface-variant font-sans text-sm tracking-wider uppercase mb-2">Monthly EMI</p>
                 <div className="text-4xl md:text-5xl font-serif font-bold text-primary truncate">
                   {formatCurrency(emi)}
                 </div>
               </div>
               
               <div className="bg-surface-container-low p-6 rounded-2xl">
                 <p className="text-on-surface-variant font-sans text-sm mb-2">Principal Amount</p>
                 <p className="text-xl md:text-2xl font-sans font-bold text-primary truncate">{formatCurrency(loanAmount)}</p>
               </div>
               
               <div className="bg-secondary/10 p-6 rounded-2xl">
                 <p className="text-secondary font-sans text-sm mb-2">Total Interest</p>
                 <p className="text-xl md:text-2xl font-sans font-bold text-secondary truncate">{formatCurrency(totalInterest)}</p>
               </div>

               <div className="bg-surface-container p-6 rounded-2xl sm:col-span-2">
                 <p className="text-on-surface font-sans text-sm mb-2">Total Payment (Principal + Interest)</p>
                 <p className="text-2xl font-sans font-bold text-primary">{formatCurrency(totalPayable)}</p>
               </div>
             </div>
             
             {/* Charts */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakup Pie */}
                <div className="bg-surface p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col items-center justify-center">
                  <h3 className="text-lg font-serif font-bold text-primary mb-4 self-start">Payment Breakup</h3>
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-2 w-full justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[0]}} />
                      <span className="text-xs font-sans text-on-surface-variant">Principal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[1]}} />
                      <span className="text-xs font-sans text-on-surface-variant">Interest</span>
                    </div>
                  </div>
                </div>

                {/* Amortization Area Chart */}
                <div className="bg-surface p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col">
                  <h3 className="text-lg font-serif font-bold text-primary mb-4">Loan Amortization</h3>
                  <div className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                         <defs>
                           <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <Tooltip 
                            formatter={(value: any) => formatCompactCurrency(value)}
                            labelStyle={{ color: '#0F172A' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         />
                         <Area 
                            type="monotone" 
                            dataKey="balance" 
                            name="Remaining Balance" 
                            stroke="#0F172A" 
                            strokeWidth={2}
                            fill="url(#colorBalance)" 
                            animationDuration={1000}
                         />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
             </div>

          </motion.div>
        </div>

        <ConsultationCTA />
      </div>
    </div>
  );
}

