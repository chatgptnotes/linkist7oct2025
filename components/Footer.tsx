import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-6 flex-wrap justify-center text-sm">
            <Link href="/privacy" className="text-white/70 hover:text-red-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/70 hover:text-red-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="text-white/70 hover:text-red-500 transition-colors">
              Security
            </Link>
            <Link href="/accessibility" className="text-white/70 hover:text-red-500 transition-colors">
              Accessibility
            </Link>
          </div>
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} Linkist Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}