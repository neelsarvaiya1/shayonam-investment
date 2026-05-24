'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Menu, MessageCircle, Phone } from 'lucide-react';

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const WHATSAPP_NUMBER = "919376925339";

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'Advisory', href: '/advisory' },
    { label: 'Calculators', href: '/calculators' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-2xl border-b border-[#162033]/5 shadow-[0_4px_30px_rgba(22,32,51,0.02)] transition-all duration-300">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="font-serif text-2xl font-bold text-[#162033]">
          Shayonam
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-sans text-sm tracking-wide transition-colors ${
                  isActive ? 'text-[#C7A86D] font-bold' : 'text-[#666666] hover:text-[#162033] font-medium'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#C7A86D] rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <Link 
          href="/portfolio" 
          className="hidden md:flex bg-[#162033] text-white px-6 py-2.5 rounded-full font-sans text-sm font-semibold hover:shadow-[0_4px_15px_rgba(22,32,51,0.2)] hover:-translate-y-0.5 transition-all duration-300"
        >
          Client Portal
        </Link>

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden items-center gap-3">
          <Link 
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F5EF] border border-[#EFE7DA]/50 text-[#4A6E55] shadow-[0_2px_10px_rgba(22,32,51,0.03)] hover:shadow-[0_0_12px_rgba(199,168,109,0.3)] active:scale-95 transition-all duration-300"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </Link>
          <Link 
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F5EF] border border-[#EFE7DA]/50 text-[#162033] shadow-[0_2px_10px_rgba(22,32,51,0.03)] hover:shadow-[0_0_12px_rgba(199,168,109,0.3)] active:scale-95 transition-all duration-300"
            aria-label="Call Now"
          >
            <Phone className="w-4 h-4" />
          </Link>
          <button 
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F5EF] border border-[#EFE7DA]/50 text-[#162033] shadow-[0_2px_10px_rgba(22,32,51,0.03)] hover:shadow-[0_0_12px_rgba(199,168,109,0.3)] active:scale-95 transition-all duration-300"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
