'use client';

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
import { motion } from 'motion/react';
import {
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  Target,
  Banknote,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

export default function AdvisoryPage() {
  const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");

const [consultationType, setConsultationType] =
  useState("");

const [financialGoal, setFinancialGoal] =
  useState("");

const [investmentRange, setInvestmentRange] =
  useState("");

const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  setIsSubmitting(true);

  const { error } =
    await supabase
      .from("leads")
      .insert([
  {
    full_name: fullName,
    email,
    phone,
    consultation_type: consultationType,
    financial_goal: financialGoal,
    investment_range: investmentRange,
    message,
    status: 'New',
  },
])

  setIsSubmitting(false);

  if (error) {
  alert(JSON.stringify(error));
  console.error(error);
  return;
}

  setSubmitted(true);

  setFullName("");
  setEmail("");
  setPhone("");
  setConsultationType("");
  setFinancialGoal("");
  setInvestmentRange("");
  setMessage("");
};
  

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column - Copy */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
           className="flex flex-col justify-center max-w-xl"
        >
          <div className="inline-block py-1 px-3 rounded-full bg-[#EFE7DA]/50 text-[#C7A86D] border border-[#C7A86D]/20 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm w-fit">
            Private Advisory
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#162033] mb-8 leading-tight">
            Request a <span className="text-[#C7A86D]">Consultation</span>
          </h1>
          <p className="text-lg text-[#666666] font-sans leading-relaxed mb-10">
            Let's discuss your financial legacy. Provide us with some details about your goals, and a principal advisor will contact you to schedule a confidential discussion.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F8F5EF] border border-[#EFE7DA] flex items-center justify-center text-[#162033] shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-sans text-[#666666]">Direct Line</p>
                <p className="text-lg font-sans font-semibold text-[#162033]">+91 9376925339</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F8F5EF] border border-[#EFE7DA] flex items-center justify-center text-[#162033] shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-sans text-[#666666]">Email</p>
                <p className="text-lg font-sans font-semibold text-[#162033]">pareshshayonam@gmail.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-[#F8F5EF]/50 backdrop-blur-xl border border-[#EFE7DA] shadow-xl p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7A86D]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            {submitted ? (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6"
               >
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                   className="w-24 h-24 bg-[#162033] rounded-full flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(22,32,51,0.2)]"
                 >
                   <svg className="w-10 h-10 text-[#C7A86D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                 </motion.div>
                 <h3 className="text-3xl font-serif font-bold text-[#162033]">Request Received</h3>
                 <p className="text-[#666666] font-sans text-lg max-w-sm mx-auto">
                   Thank you for trusting Shayonam. A principal advisor will contact you shortly to schedule your premium consultation.
                 </p>
                 <button 
                   onClick={() => setSubmitted(false)}
                   className="mt-6 px-8 py-3 bg-white border border-[#EFE7DA] text-[#162033] rounded-full font-sans font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all"
                 >
                   Send Another Message
                 </button>
               </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-1 mb-6">
  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#666666] ml-2">
    Full Name
  </label>

  <div className="relative group">
    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#162033]/40 group-focus-within:text-[#C7A86D] transition-colors" />

    <input
      required
      type="text"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder="e.g. Rahul Sharma"
      className="w-full bg-white/70 backdrop-blur-sm pl-12 pr-4 py-4 rounded-2xl font-sans text-[#162033] placeholder:text-[#162033]/30 outline-none border border-[#EFE7DA] focus:border-[#C7A86D] focus:ring-4 focus:ring-[#C7A86D]/10 transition-all shadow-sm"
    />
  </div>
</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#666666] ml-2">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#162033]/40 group-focus-within:text-[#C7A86D] transition-colors" />
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white/70 backdrop-blur-sm pl-12 pr-4 py-4 rounded-2xl font-sans text-[#162033] placeholder:text-[#162033]/30 outline-none border border-[#EFE7DA] focus:border-[#C7A86D] focus:ring-4 focus:ring-[#C7A86D]/10 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#666666] ml-2">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#162033]/40 group-focus-within:text-[#C7A86D] transition-colors" />
                      <input 
                        required
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/70 backdrop-blur-sm pl-12 pr-4 py-4 rounded-2xl font-sans text-[#162033] placeholder:text-[#162033]/30 outline-none border border-[#EFE7DA] focus:border-[#C7A86D] focus:ring-4 focus:ring-[#C7A86D]/10 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#666666] ml-2">Consultation Type</label>
                  <div className="relative group">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#162033]/40 pointer-events-none z-10" />
<select
  required
  value={consultationType}
  onChange={(e) => setConsultationType(e.target.value)}
  className="w-full appearance-none bg-white/70 backdrop-blur-sm pl-12 pr-10 py-4 rounded-2xl border border-[#D8CBB8] text-[#162033] font-sans text-base focus:outline-none focus:ring-2 focus:ring-[#C7A35D]/30"
>

  <option value="" disabled>
    Select an option...
  </option>

  <option value="SIP Planning">
    SIP Planning
  </option>

  <option value="Retirement Planning">
    Retirement Planning
  </option>

  <option value="Child Education">
    Child Education
  </option>
</select>
<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#162033]/50 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#666666] ml-2">Financial Goal</label>
                    <div className="relative group">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#162033]/40 group-focus-within:text-[#C7A86D] transition-colors" />
                      <select
                        required
                        value={financialGoal}
                        onChange={(e) =>
                          setFinancialGoal(e.target.value)
                        }
                        className="w-full appearance-none bg-white/70 backdrop-blur-sm pl-12 pr-4 py-4 rounded-2xl font-sans text-[#162033] outline-none border border-[#EFE7DA] focus:border-[#C7A86D] focus:ring-4 focus:ring-[#C7A86D]/10 transition-all shadow-sm cursor-pointer"
                      >
                        <option value="" disabled>
                          Primary goal...
                        </option>

                        <option value="Wealth Creation">
                          Wealth Creation
                        </option>

                        <option value="Capital Preservation">
                          Capital Preservation
                        </option>

                        <option value="Regular Income">
                          Regular Income
                        </option>

                        <option value="Tax Optimization">
                          Tax Optimization
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#666666] ml-2">Investment Range</label>
                    <div className="relative group">
                      <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#162033]/40 group-focus-within:text-[#C7A86D] transition-colors" />
                      <select
  required
  value={investmentRange}
  onChange={(e) => setInvestmentRange(e.target.value)}
  className="w-full appearance-none bg-white/70 backdrop-blur-sm pl-12 pr-4 py-4 rounded-2xl border border-[#e2d8c7] text-[#162033] font-medium focus:outline-none"
>
  <option value="" disabled>
    Select range...
  </option>

  <option value="< 10L">
    &lt; 10 Lakhs
  </option>

  <option value="10L - 50L">
    10 Lakhs - 50 Lakhs
  </option>

  <option value="50L - 1Cr">
    50 Lakhs - 1 Crore
  </option>

  <option value="> 1Cr">
    &gt; 1 Crore
  </option>
</select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#666666] ml-2">Message (Optional)</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-5 -translate-y-1/2 w-5 h-5 text-[#162033]/40 group-focus-within:text-[#C7A86D] transition-colors" />
                    <textarea 
                      rows={3}
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      placeholder="Briefly describe your requirements..."
                      className="w-full bg-white/70 backdrop-blur-sm pl-12 pr-4 py-4 rounded-2xl font-sans text-[#162033] placeholder:text-[#162033]/30 outline-none border border-[#EFE7DA] focus:border-[#C7A86D] focus:ring-4 focus:ring-[#C7A86D]/10 transition-all resize-none shadow-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#162033] text-white py-4 rounded-2xl font-sans font-bold text-lg hover:bg-[#1a263c] hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                  {!isSubmitting && <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
