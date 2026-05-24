import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { NavigationSystem } from '@/components/navigation/NavigationSystem';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Shayonam Investment',
  description: 'Premium financial advisory & investment services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-on-surface`}>
        <NavigationSystem />
        <main className="relative z-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}