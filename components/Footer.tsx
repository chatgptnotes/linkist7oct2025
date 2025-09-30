import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto border-t border-white/10 w-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8 lg:mb-10">
          <div className="footer-section">
            <h3 className="text-white text-lg font-semibold mb-4 md:mb-5">Products</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Linkist Card</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Premium Card</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Business Card</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Student Card</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Family Cards</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="text-white text-lg font-semibold mb-4 md:mb-5">Services</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Banking</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Investments</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Loans</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Insurance</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Rewards Program</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="text-white text-lg font-semibold mb-4 md:mb-5">Support</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Contact Us</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Security</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Card Activation</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Report Fraud</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="text-white text-lg font-semibold mb-4 md:mb-5">Company</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">About Linkist</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Careers</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Press</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Investors</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-red-500 transition-colors duration-300 text-sm">Sustainability</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 lg:pt-10 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-5">
          <div className="text-white text-xl md:text-2xl font-bold order-1 lg:order-1">Linkist</div>
          <div className="flex gap-4 md:gap-8 flex-wrap justify-center order-3 lg:order-2">
            <Link href="/privacy" className="text-white/60 hover:text-red-500 transition-colors duration-300 text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-white/60 hover:text-red-500 transition-colors duration-300 text-sm">Terms of Service</Link>
            <Link href="#" className="text-white/60 hover:text-red-500 transition-colors duration-300 text-sm">Security</Link>
            <Link href="#" className="text-white/60 hover:text-red-500 transition-colors duration-300 text-sm">Accessibility</Link>
          </div>
          <div className="text-white/50 text-xs md:text-sm text-center lg:text-right order-2 lg:order-3">
            © {new Date().getFullYear()} Linkist Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}