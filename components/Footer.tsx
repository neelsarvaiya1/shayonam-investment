import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full pt-16 pb-32 md:pb-16 lg:py-24 bg-surface-container-low border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 lg:px-0 max-w-7xl mx-auto">
        <div className="col-span-1 md:col-span-2 mb-8 md:mb-0">
          <Link href="/" className="font-serif text-3xl font-semibold text-primary block mb-4">
            Shayonam
          </Link>
          <p className="font-sans text-base text-on-surface-variant max-w-sm mb-6">
            AMFI Registered Mutual Fund Distributor.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-2">
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-sm font-semibold text-primary uppercase tracking-widest">
              Services
            </h4>
            <Link href="/services" className="font-sans text-base text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-transform inline-block w-fit">
              Taxation
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-sm font-semibold text-primary uppercase tracking-widest">
              Company
            </h4>
            <Link href="/calculators" className="font-sans text-base text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-transform inline-block w-fit">
              Calculations Tools
            </Link>
            <Link href="#" className="font-sans text-base text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-transform inline-block w-fit">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
      <div className="px-6 lg:px-0 max-w-7xl mx-auto mt-16 pt-8 border-t border-outline/20">
        <p className="font-sans text-sm text-outline text-center md:text-left">
          © {new Date().getFullYear()} Shayonam Investment. AMFI Registered Mutual Fund Distributor.
        </p>
      </div>
    </footer>
  );
}
