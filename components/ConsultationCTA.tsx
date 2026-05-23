import { motion } from 'motion/react';
import { Phone, MessageCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function ConsultationCTA() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-20 bg-surface-container-lowest p-8 md:p-14 rounded-[2rem] border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-4xl mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
      
      <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
        <ShieldCheck className="w-4 h-4 text-secondary" />
        AMFI Registered Distributor
      </div>

      <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 tracking-tight">Expert Wealth Guidance.</h3>
      <p className="text-on-surface-variant font-sans mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
        Speak strictly with experienced advisors to evaluate your portfolio, protect your capital, and craft a family-centric wealth plan.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href="https://wa.me/919376925339"
          target="_blank"
          referrerPolicy="no-referrer"
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-on-primary px-8 py-4 rounded-xl font-sans font-bold transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          <MessageCircle className="w-5 h-5 text-secondary" />
          WhatsApp Consultation
        </Link>
        <Link 
          href="tel:+919376925339"
          className="flex items-center justify-center gap-2 bg-surface hover:bg-surface-container border border-outline-variant/50 text-primary px-8 py-4 rounded-xl font-sans font-bold transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Phone className="w-5 h-5" />
          Call +91 93769 25339
        </Link>
      </div>
    </motion.div>
  );
}
