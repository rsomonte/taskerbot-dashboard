import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#2b2d31] border-t border-[#1e1f22] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} rsomonte. BSD 3-Clause License.
        </div>
        <div className="flex gap-6">
          <Link
            href="https://github.com/rsomonte/taskerbot"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            GitHub Repo
          </Link>
          <Link 
            href="/privacy-policy" 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms-of-service" 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
