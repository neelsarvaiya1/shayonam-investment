'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Home, Grid2X2, PieChart } from 'lucide-react';

export function MobileDock({ onMoreClick }: { onMoreClick: () => void }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // If scrolling down and scrolled past 50px, hide
    if (latest > lastScrollY && latest > 50) {
      setIsVisible(false);
    } 
    // If scrolling up, show
    else if (latest < lastScrollY) {
      setIsVisible(true);
    }
    setLastScrollY(latest);
  });

  const dockItems = [
    { id: 'services', label: 'Services', icon: PieChart, href: '/services' },
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'more', label: 'More', icon: Grid2X2, action: onMoreClick },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden w-[80%] max-w-[320px]"
        >
          <div className="bg-[#F8F5EF]/75 backdrop-blur-2xl border border-[#EFE7DA]/60 shadow-[0_8px_32px_rgba(22,32,51,0.06)] rounded-full px-4 py-2 flex justify-between items-center">
            {dockItems.map((item) => {
              const isActive = pathname === item.href;
              const isAction = !!item.action;

              const content = (
                <div className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300">
                  <item.icon 
                    className={`relative z-10 w-5 h-5 mb-1 transition-colors duration-300 ${
                      isActive ? 'text-[#162033]' : 'text-[#666666]'
                    }`} 
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span className={`relative z-10 text-[10px] font-sans tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-[#162033] font-semibold' : 'text-[#666666]'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Subtle active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="dock-dot"
                      className="absolute -bottom-1 w-1 h-1 bg-[#C7A86D] rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </div>
              );

              if (isAction) {
                return (
                  <button 
                    key={item.id} 
                    onClick={item.action}
                    className="flex-1 flex justify-center active:scale-95 transition-transform"
                    aria-label={item.label}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link 
                  key={item.id} 
                  href={item.href!}
                  className="flex-1 flex justify-center active:scale-95 transition-transform"
                  aria-label={item.label}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
