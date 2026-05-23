'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { MobileDock } from './MobileDock';
import { MobileMenu } from './MobileMenu';

export function NavigationSystem() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MobileDock onMoreClick={() => setIsMenuOpen(true)} />
    </>
  );
}
