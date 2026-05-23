'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, HelpCircle, Phone, Lock, Shield, FileText, Calculator, MessageCircle } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Client Portal', href: '/portfolio', icon: Lock },
    { label: 'Financial Tools', href: '/calculators', icon: Calculator },
    { label: 'Request Message', href: '/advisory', icon: MessageCircle },
    { label: 'Contact Us', href: '/contact', icon: Phone },
    { label: 'FAQs', href: '/faqs', icon: HelpCircle },
  ];

  const legalItems = [
    { label: 'Privacy Policy', href: '#', icon: Shield },
    { label: 'Terms & Conditions', href: '#', icon: FileText },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#162033]/40 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-[#F8F5EF] shadow-2xl md:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#EFE7DA]">
              <span className="font-serif text-xl font-bold text-[#162033]">Menu</span>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-[#162033] bg-[#EFE7DA]/50 rounded-full active:scale-95 transition-transform"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-grow flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link 
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#EFE7DA] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F8F5EF] flex items-center justify-center text-[#C7A86D] group-hover:scale-110 group-hover:bg-[#C7A86D]/10 transition-all duration-300">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-sans font-semibold text-[#162033]">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#666666]/50 group-hover:text-[#C7A86D] group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-white/50 border-t border-[#EFE7DA] pb-32">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-4">Legal & Support</p>
              <div className="flex flex-col gap-4">
                {legalItems.map((item) => (
                  <Link 
                    key={item.label} 
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 text-sm font-sans font-medium text-[#666666] hover:text-[#162033] transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
